import json
import numpy as np
import pandas as pd
import os
import warnings
from sklearn.metrics import mean_absolute_error, mean_squared_error, root_mean_squared_error
from concurrent.futures import ProcessPoolExecutor, as_completed
from keras import callbacks, layers, models, optimizers
from tensorflow.keras.models import load_model
from pathlib import Path
from sklearn.model_selection import TimeSeriesSplit
from sklearn.preprocessing import StandardScaler
from tqdm import tqdm
from tuner import custom_loss
from typing import Dict, List, Tuple
from utils.dir import load_all_csvs
from utils.players import get_players_from_season
from utils.timeseries import get_timeseries


warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=FutureWarning)


# Função para criar sequências de entrada e saída
def create_sequences(data, n_steps):
    X, y = [], []
    for i in range(n_steps, len(data)):
        X.append(data[(i - n_steps) : i, 0])
        y.append(data[i, 0])
    return np.array(X), np.array(y)


def custom_lstm(
    player_id: int,
    previous_csvs: Dict[str, pd.DataFrame],
    next_csvs: Dict[str, pd.DataFrame],
    n_steps=5,
    epochs=100,
):
    predictions = []

    prev_timeseries = get_timeseries(player_id, previous_csvs)
    next_timeseries = get_timeseries(player_id, next_csvs)
    next_timeseries = np.nan_to_num(next_timeseries)

    if np.count_nonzero(np.nan_to_num(prev_timeseries)) < 10:
        print(f"Jogador {player_id} não tem dados suficientes para criar sequências.")
        return [-999 for _ in range(38)]

    context = np.nan_to_num(prev_timeseries)
    scaler = StandardScaler()
    scaled_prev = scaler.fit_transform(context.reshape(-1, 1))

    X, y = create_sequences(scaled_prev, n_steps)
    try:
        X = X.reshape((X.shape[0], X.shape[1], 1))
    except IndexError as e:
        print(f"Erro ao reshaping os dados do jogador {player_id}: {e}")
        return

    tscv = TimeSeriesSplit(n_splits=3)
    train_index, val_index = list(tscv.split(X))[-1]
    X_train, X_val = X[train_index], X[val_index]
    y_train, y_val = y[train_index], y[val_index]

    model = models.Sequential()
    model.add(layers.LSTM(1, input_shape=(n_steps, 1)))
    model.add(layers.Dense(1))

    check_point = callbacks.ModelCheckpoint(
        f"lstm/{player_id}.keras", save_best_only=True, monitor="loss"
    )
    optimizer = optimizers.Adam(learning_rate=0.01)

    model.compile(optimizer=optimizer, loss=custom_loss, metrics=["mae", "mse"])

    # Divida os dados em treinamento e validação
    # X_train = X
    # y_train = y

    model.fit(
        X_train,
        y_train,
        validation_data=(X_val, y_val),
        epochs=epochs,
        batch_size=1,
        # validation_split=0.2,
        callbacks=[check_point],
        verbose=1,
    )

    model = load_model(f"lstm/{player_id}.keras")
    # Começa com as últimas n_steps da temporada passada
    current_sequence = scaled_prev[-n_steps:].reshape(1, n_steps, 1)

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

    mae = mean_absolute_error(next_timeseries, predictions)
    rmse = root_mean_squared_error(next_timeseries, predictions)
    print(f"\nErro absoluto médio (MAE): {mae:.2f}")
    print(f"\nErro absoluto médio (RMSE):: {rmse:.2f}")

    return [float(pred) for pred in predictions]


def player_lstm(
    player_id: int,
    previous_csvs: Dict[str, pd.DataFrame],
    next_csvs: Dict[str, pd.DataFrame],
    hyperparameters: Dict[str, int],
):
    predictions = []

    prev_timeseries = get_timeseries(player_id, previous_csvs)
    next_timeseries = get_timeseries(player_id, next_csvs)
    next_timeseries = np.nan_to_num(next_timeseries)

    empty_pred = [-999 for _ in range(38)]

    if np.count_nonzero(np.nan_to_num(prev_timeseries)) < 10:
        print(f"Jogador {player_id} não tem dados suficientes para criar sequências.")
        return empty_pred

    context = np.nan_to_num(prev_timeseries)
    scaler = StandardScaler()
    scaled_prev = scaler.fit_transform(context.reshape(-1, 1))

    def build_data(n_steps):
        X, y = create_sequences(scaled_prev, n_steps)
        X = X.reshape((X.shape[0], X.shape[1], 1))
        return X, y

    if hyperparameters == {}:
        print(f"Jogador {player_id} não tem dados suficientes para criar sequências.")
        return empty_pred

    n_steps = 2  # hyperparameters.get("n_steps", 0)
    # units_1 = hyperparameters.get("units_1", 0)
    # units_2 = hyperparameters.get("units_2", 0)

    X, y = build_data(n_steps)

    tscv = TimeSeriesSplit(n_splits=3)
    train_index, val_index = list(tscv.split(X))[-1]
    X_train, X_val = X[train_index], X[val_index]
    y_train, y_val = y[train_index], y[val_index]

    # Pega o melhores hiperparâmetros e re-treina o modelo
    model = models.Sequential()
    model.add(layers.LSTM(1, input_shape=(n_steps, 1)))
    model.add(layers.Dense(1))

    check_point = callbacks.ModelCheckpoint(
        f"lstm/{player_id}.keras", save_best_only=True, monitor="loss"
    )
    optimizer = optimizers.Adam(learning_rate=0.01)

    model.compile(optimizer=optimizer, loss=custom_loss, metrics=["mae", "mse"])
    model.fit(
        X_train,
        y_train,
        epochs=1500,
        batch_size=1,
        validation_data=(X_val, y_val),
        # validation_split=0.2,
        callbacks=[check_point],
        verbose=0,
    )

    model = load_model(f"lstm/{player_id}.keras")
    # Começa com as últimas n_steps da temporada passada
    current_sequence = scaled_prev[-n_steps:].reshape(1, n_steps, 1)

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
    all_hp: Dict[str, Dict[str, int]],
    num_workers=0,
):
    all_predictions: Dict[int, List[float]] = {}
    total_mae = 0
    total_mse = 0
    total_rmse = 0
    valid_players = 0

    if num_workers > 0:
        with ProcessPoolExecutor(max_workers=num_workers) as executor:
            futures = {
                executor.submit(
                    player_lstm, id, previous_csvs, next_csvs, all_hp.get(f"{id}", {})
                ): id
                for id in players.keys()
            }

            for future in tqdm(
                as_completed(futures), total=len(futures), desc="Processando jogadores"
            ):
                try:
                    key = futures[future]
                    pred = future.result()
                    all_predictions[key] = pred

                    # Calcular MAE se for válido
                    if pred != [-999 for _ in range(38)] and len(pred) == 38:
                        real = get_timeseries(key, next_csvs)
                        real = np.nan_to_num(real)

                        if len(real) == 38:
                            mae = mean_absolute_error(real, pred)
                            mse = mean_squared_error(real, pred)
                            rmse = root_mean_squared_error(real, pred)
                            total_mae += mae
                            total_mse += mse
                            total_rmse += rmse
                            valid_players += 1
                except Exception as e:
                    print(f"Erro no future loop. {e}")
    else:
        for id in tqdm(players.keys()):
            pred = player_lstm(id, previous_csvs, next_csvs, all_hp.get(f"{id}", {}))
            if pred == []:
                continue
            all_predictions[id] = pred

    print(f"Validos {valid_players}")
    avg_mae = total_mae / valid_players if valid_players > 0 else None
    print(f"\nErro absoluto médio (MAE) entre todos os jogadores: {avg_mae:.2f}")
    avg_mse = total_mse / valid_players if valid_players > 0 else None
    print(f"\nErro absoluto médio (MSE) entre todos os jogadores com ARIMA: {avg_mse:.2f}")
    avg_rmse = total_rmse / valid_players if valid_players > 0 else None
    print(f"\nErro absoluto médio (RMSE) entre todos os jogadores com ARIMA: {avg_rmse:.2f}")

    ROOT_DIR = Path(__file__).resolve().parent.parent
    path = os.path.join(ROOT_DIR, f"static/lstm/{year}-hp.json")
    with open(path, "w") as f:
        json.dump(all_predictions, f, indent=4, ensure_ascii=False)
    return all_predictions


def run_lstm(year: int, previous_path: str, next_path: str, num_workers=0):
    players = get_players_from_season(next_path)
    previous_csvs = load_all_csvs(previous_path)
    next_csvs = load_all_csvs(next_path)
    ROOT_DIR = Path(__file__).resolve().parent.parent
    hp_path = os.path.join(ROOT_DIR, f"static/lstm/hp/{year}.json")
    with open(hp_path, "r") as f:
        all_hp = json.load(f)

    all_players_lstm(year, previous_csvs, next_csvs, players, all_hp, num_workers)


if __name__ == "__main__":
    data_dir = os.path.join(os.path.dirname(__file__), "data/")
    path_2019 = os.path.join(data_dir, "2019")
    path_2020 = os.path.join(data_dir, "2020")
    run_lstm(2020, path_2019, path_2020, num_workers=10)

    # Código para teste rápido do modelo 87863 83257 38162 38750 69040
    # prev_csv = load_all_csvs(path_2019)
    # next_csv = load_all_csvs(path_2020)
    # preds = custom_lstm(83257, prev_csv, next_csv, 2, 10)
    # preds2 = custom_lstm(83257, prev_csv, next_csv, 2, 100)
    # preds3 = custom_lstm(83257, prev_csv, next_csv, 2, 1500)
    # preds4 = custom_lstm(83257, prev_csv, next_csv, 2, 3000)
    # reais = get_timeseries(83257, next_csv)
    # anterior = get_timeseries(83257, prev_csv)

    # import matplotlib.pyplot as plt

    # plt.plot(reais, label="Real")
    # plt.plot(anterior, label="Anterior")
    # plt.plot(preds, label="10")
    # plt.plot(preds2, label="100")
    # plt.plot(preds3, label="1500")
    # plt.plot(preds4, label="3000")
    # plt.title("Previsão rodada a rodada")
    # plt.legend()
    # plt.grid(True)
    # plt.show()
