import json
import pandas as pd
import numpy as np
import os
import warnings
from sklearn.metrics import mean_absolute_error, mean_squared_error, root_mean_squared_error
from concurrent.futures import ProcessPoolExecutor, as_completed
from keras import optimizers
from keras.callbacks import EarlyStopping
from keras.models import Sequential
from keras.layers import LSTM, Dense
from keras_tuner import HyperModel
from keras_tuner.tuners import RandomSearch
from pathlib import Path
from sklearn.preprocessing import StandardScaler
from tqdm import tqdm
from typing import Dict, List, Tuple
from utils.dir import load_all_csvs
from utils.players import get_players_from_season
from utils.timeseries import get_timeseries


warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=FutureWarning)


class LSTMHyperModel(HyperModel):
    def __init__(self, input_shape):
        self.input_shape = input_shape

    def build(self, hp):
        model = Sequential()
        model.add(
            LSTM(
                units=hp.Int("units_1", 64, 416, step=32),
                return_sequences=True,
                input_shape=self.input_shape,
            )
        )
        model.add(
            LSTM(
                units=hp.Int("units_2", 32, 160, step=16),
            )
        )
        model.add(Dense(1))

        learning_rate = hp.Float("learning_rate", 1e-4, 1e-2, sampling="log")
        optimizer = optimizers.Adam(learning_rate=learning_rate)
        model.compile(optimizer=optimizer, loss="mae")
        return model


# Função para criar sequências de entrada e saída
def create_sequences(data, n_steps):
    X, y = [], []
    for i in range(n_steps, len(data)):
        X.append(data[(i - n_steps) : i, 0])
        y.append(data[i, 0])
    return np.array(X), np.array(y)


def player_lstm(
    player_id: int,
    previous_csvs: Dict[str, pd.DataFrame],
    next_csvs: Dict[str, pd.DataFrame],
    n_steps=5,
):
    predictions = []

    prev_timeseries = get_timeseries(player_id, previous_csvs)
    next_timeseries = get_timeseries(player_id, next_csvs)
    next_timeseries = np.nan_to_num(next_timeseries)

    if np.count_nonzero(~np.isnan(prev_timeseries)) < n_steps:
        print(f"Jogador {player_id} não tem dados suficientes para criar sequências.")
        return [0.0 for _ in range(38)]

    context = np.nan_to_num(prev_timeseries)
    scaler = StandardScaler()
    scaled_prev = scaler.fit_transform(context.reshape(-1, 1))

    def build_data(n_steps):
        X, y = create_sequences(scaled_prev, n_steps)
        X = X.reshape((X.shape[0], X.shape[1], 1))
        return X, y

    # Hiperparâmetro tunável fora do modelo: n_steps
    def model_builder(hp):
        n_steps = hp.Int("n_steps", min_value=2, max_value=10, step=1)
        epochs = hp.Int("epochs", min_value=100, max_value=1200, step=50)
        X_train, y_train = build_data(n_steps)

        model = LSTMHyperModel(input_shape=(n_steps, 1)).build(hp)

        model.fit(
            X_train,
            y_train,
            validation_split=0.2,
            epochs=epochs,
            batch_size=4,
            callbacks=[EarlyStopping(patience=5)],
            verbose=0,
        )

        return model

    tuner = RandomSearch(
        model_builder,
        objective="val_loss",
        max_trials=30,
        executions_per_trial=1,
        directory="lstm_tuning",
        project_name=f"player_{player_id}",
        overwrite=True,
    )

    # Dummy data just to allow initial build (Keras Tuner requer isso no começo)
    dummy_X, dummy_y = build_data(5)
    tuner.search_space_summary()
    tuner.search(
        dummy_X, dummy_y, epochs=1, batch_size=1, validation_split=0.2, verbose=0
    )  # inicia espaço
    tuner.oracle.max_trials = 30  # definir max_trials depois de ajustar n_steps dinamicamente

    tuner.search(dummy_X, dummy_y, verbose=0)  # real tuning

    best_hp = tuner.get_best_hyperparameters(1)[0]
    best_n_steps = best_hp.get("n_steps")
    best_epochs = best_hp.get("epochs")

    X_train, y_train = build_data(best_n_steps)
    print(f"Y: {y_train}")
    print(f"prev: {prev_timeseries}")
    print(f"scaled_prev: {scaled_prev}")
    print("Best hyperparameters:", best_hp.values)
    print("Exemplo de y_train:", y_train[:10])
    print("Variância de y_train:", np.var(y_train))

    model = LSTMHyperModel(input_shape=(best_n_steps, 1)).build(best_hp)
    model.fit(
        X_train,
        y_train,
        epochs=best_epochs,
        batch_size=4,
        callbacks=[EarlyStopping(patience=10)],
        verbose=0,
    )

    # Começa com as últimas n_steps da temporada passada
    current_sequence = scaled_prev[-best_n_steps:].reshape(1, best_n_steps, 1)

    for r in range(38):
        pred = model.predict(current_sequence, verbose=0)
        prediction = scaler.inverse_transform(pred)[0, 0]
        predictions.append(prediction)

        # Adicionar valor real da rodada R
        real_value = next_timeseries[r]
        scaled_real = scaler.transform(np.array([[real_value]]))
        current_sequence = np.append(
            current_sequence[:, 1:, :], scaled_real.reshape(1, 1, 1), axis=1
        )

    return [float(pred) for pred in predictions]


def all_players_lstm(
    year: int,
    previous_csvs: Dict[str, pd.DataFrame],
    next_csvs: Dict[str, pd.DataFrame],
    players: Dict[int, Tuple[str, str, int, str]],
    n_steps=5,
    num_workers=0,
):
    all_predictions: Dict[int, List[float]] = {}
    total_mae = 0
    total_mse = 0
    total_rmse = 0
    jogadores_validos = 0

    if num_workers > 0:
        with ProcessPoolExecutor(max_workers=num_workers) as executor:
            futures = {
                executor.submit(player_lstm, id, previous_csvs, next_csvs, n_steps): id
                for id in players.keys()
            }

            for future in tqdm(
                as_completed(futures), total=len(futures), desc="Processando jogadores"
            ):
                try:
                    key = futures[future]
                    pred = future.result()
                    all_predictions[key] = future.result()
                    # Calcular MAE se for válido
                    if pred != [0.0 for _ in range(38)] and len(pred) == 38:
                        real = get_timeseries(key, next_csvs)
                        real = np.nan_to_num(real)

                        if len(real) == 38:
                            mae = mean_absolute_error(real, pred)
                            mse = mean_squared_error(real, pred)
                            rmse = root_mean_squared_error(real, pred)
                            total_mae += mae
                            total_mse += mse
                            total_rmse += rmse
                            jogadores_validos += 1
                except Exception as e:
                    print(f"Erro no future loop. {e}")
    else:
        for id in tqdm(players.keys()):
            pred = player_lstm(id, previous_csvs, next_csvs, n_steps)
            all_predictions[id] = pred

    print(f"Validos {jogadores_validos}")
    avg_mae = total_mae / jogadores_validos if jogadores_validos > 0 else None
    print(f"\nErro absoluto médio (MAE) entre todos os jogadores: {avg_mae:.2f}")
    avg_mse = total_mse / jogadores_validos if jogadores_validos > 0 else None
    print(f"\nErro absoluto médio (MSE) entre todos os jogadores com ARIMA: {avg_mse:.2f}")
    avg_rmse = total_rmse / jogadores_validos if jogadores_validos > 0 else None
    print(f"\nErro absoluto médio (RMSE) entre todos os jogadores com ARIMA: {avg_rmse:.2f}")

    ROOT_DIR = Path(__file__).resolve().parent.parent
    path = os.path.join(ROOT_DIR, f"static/lstm/{year}-{n_steps}.json")
    with open(path, "w") as f:
        json.dump(all_predictions, f, indent=4, ensure_ascii=False)
    return all_predictions


def run_lstm(year: int, previous_path: str, next_path: str, n_steps: int = 5, num_workers=0):
    prev_csv = load_all_csvs(previous_path)
    next_csv = load_all_csvs(next_path)
    players = get_players_from_season(next_path)
    all_players_lstm(year, prev_csv, next_csv, players, n_steps, num_workers)


if __name__ == "__main__":
    data_dir = os.path.join(os.path.dirname(__file__), "data/")
    path_2019 = os.path.join(data_dir, "2019")
    path_2020 = os.path.join(data_dir, "2020")
    # run_lstm(2020, path_2019, path_2020, num_workers=10)

    # Código para teste rápido do modelo 87863 83257 38162 38750
    prev_csv = load_all_csvs(path_2019)
    next_csv = load_all_csvs(path_2020)
    preds = player_lstm(38162, prev_csv, next_csv)
    reais = get_timeseries(38162, next_csv)

    import matplotlib.pyplot as plt

    plt.plot(reais, label="Real")
    plt.plot(preds, label="Previsto")
    plt.title("Previsão rodada a rodada")
    plt.legend()
    plt.grid(True)
    plt.show()
