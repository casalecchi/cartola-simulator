import json
import pandas as pd
import numpy as np
import os
import warnings
from concurrent.futures import ProcessPoolExecutor, as_completed
from keras.callbacks import EarlyStopping
from keras.models import Sequential
from keras.layers import LSTM, Dense
from pathlib import Path
from sklearn.preprocessing import StandardScaler
from tqdm import tqdm
from typing import Dict, List, Tuple
from utils.dir import load_all_csvs
from utils.players import get_players_from_season


warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=FutureWarning)


# Função para criar sequências de entrada e saída
def create_sequences(data, n_steps):
    X, y = [], []
    for i in range(n_steps, len(data)):
        X.append(data[(i - n_steps) : i, 0])
        y.append(data[i, 0])
    return np.array(X), np.array(y)


def get_timeseries(id: int, csvs: Dict[str, pd.DataFrame]):
    timeseries = np.array([])
    for i in range(1, 39):
        df = csvs[f"rodada-{i:02}.csv"]
        row = df[df["atletas.atleta_id"] == id]
        points = np.nan if row.empty else row.iloc[0]["atletas.pontos_num"].item()
        timeseries = np.append(timeseries, points)
    return timeseries


def player_lstm(
    player_id: int,
    previous_csvs: Dict[str, pd.DataFrame],
    next_csvs: Dict[str, pd.DataFrame],
    n_steps: int = 5,
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

    X_train, y_train = create_sequences(scaled_prev, n_steps)

    # Reshape para o formato que o LSTM espera (amostras, passos temporais, número de features)
    try:
        X_train = X_train.reshape((X_train.shape[0], X_train.shape[1], 1))
    except IndexError as e:
        print(f"Erro ao reshaping os dados do jogador {player_id}: {e}")
        return

    # --- DEFINIÇÃO DO MODELO ---
    model = Sequential()
    model.add(LSTM(64, return_sequences=True, input_shape=(n_steps, 1), dropout=0.2))
    model.add(LSTM(32))
    model.add(Dense(1))

    model.compile(optimizer="adam", loss="mae")
    early_stop = EarlyStopping(monitor="loss", patience=20, restore_best_weights=True)
    model.fit(X_train, y_train, epochs=500, batch_size=1, callbacks=[early_stop], verbose=0)

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
    players: Dict[int, Tuple[str, str, int]],
    n_steps=5,
    num_workers=0,
):
    all_predictions: Dict[int, List[float]] = {}

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
                    all_predictions[key] = future.result()
                except Exception as e:
                    print(f"Erro no future loop. {e}")
    else:
        for id in tqdm(players.keys()):
            pred = player_lstm(id, previous_csvs, next_csvs, n_steps)
            all_predictions[id] = pred

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
    run_lstm(2020, path_2019, path_2020, num_workers=10)

    # Código para teste rápido do modelo
    # prev_csv = load_all_csvs(path_2019)
    # next_csv = load_all_csvs(path_2020)
    # preds = player_lstm(83257, prev_csv, next_csv)
    # reais = get_timeseries(83257, next_csv)

    # import matplotlib.pyplot as plt

    # plt.plot(reais, label="Real")
    # plt.plot(preds, label="Previsto")
    # plt.title("Previsão rodada a rodada")
    # plt.legend()
    # plt.grid(True)
    # plt.show()
