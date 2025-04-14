import json
import numpy as np
import pandas as pd
import os
import warnings
from concurrent.futures import ProcessPoolExecutor, as_completed
from functools import partial
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
    def __init__(self, scaled_prev, build_data_fn):
        self.scaled_prev = scaled_prev
        self.build_data = build_data_fn

    def build(self, hp):
        n_steps = hp.Choice("n_steps", [2, 5, 10, 15])
        input_shape = (n_steps, 1)

        model = Sequential()
        model.add(
            LSTM(
                units=hp.Choice("units_1", [2, 4, 8, 16, 32]),
                input_shape=input_shape,
            )
        )
        # model.add(
        #     LSTM(
        #         units=hp.Choice("units_2", [32, 64]),
        #     )
        # )
        model.add(Dense(1))

        optimizer = optimizers.Adam(learning_rate=0.005)
        model.compile(optimizer=optimizer, loss="mae")
        return model

    def fit(self, hp, model, *args, **kwargs):
        n_steps = hp.get("n_steps")
        epochs = 10  # hp.Choice("epochs", [750, 1000])

        X_train, y_train = self.build_data(n_steps)

        return model.fit(
            X_train,
            y_train,
            validation_split=0.2,
            epochs=epochs,
            batch_size=2,
            callbacks=[EarlyStopping(monitor="val_loss", patience=3, restore_best_weights=True)],
            verbose=0,
        )


# Função para criar sequências de entrada e saída
def create_sequences(data, n_steps):
    X, y = [], []
    for i in range(n_steps, len(data)):
        X.append(data[(i - n_steps) : i, 0])
        y.append(data[i, 0])
    return np.array(X), np.array(y)


def lstm_tuner(
    player_id: int,
    previous_csvs: Dict[str, pd.DataFrame],
    next_csvs: Dict[str, pd.DataFrame],
):
    prev_timeseries = get_timeseries(player_id, previous_csvs)
    next_timeseries = get_timeseries(player_id, next_csvs)
    next_timeseries = np.nan_to_num(next_timeseries)

    if np.count_nonzero(np.nan_to_num(prev_timeseries)) < 15:
        print(f"Jogador {player_id} não tem dados suficientes para criar sequências.")
        return {}

    context = np.nan_to_num(prev_timeseries)
    scaler = StandardScaler()
    scaled_prev = scaler.fit_transform(context.reshape(-1, 1))

    def build_data(n_steps):
        X, y = create_sequences(scaled_prev, n_steps)
        X = X.reshape((X.shape[0], X.shape[1], 1))
        return X, y

    hypermodel = LSTMHyperModel(scaled_prev, build_data)

    tuner = RandomSearch(
        hypermodel,
        objective="val_loss",
        max_trials=20,
        executions_per_trial=1,
        directory=f"lstm_tuning/player_{player_id}",
        project_name="run",
        overwrite=True,
    )

    tuner.search(verbose=0)

    best_hp = tuner.get_best_hyperparameters(1)[0]
    return best_hp.values


def all_lstm_tuner(
    year: int,
    previous_csvs: Dict[str, pd.DataFrame],
    next_csvs: Dict[str, pd.DataFrame],
    players: Dict[int, Tuple[str, str, int, str]],
    num_workers=0,
):
    hyperparameters: Dict[int, List[float]] = {}
    jogadores_validos = 0

    if num_workers > 0:
        with ProcessPoolExecutor(max_workers=num_workers) as executor:
            func_with_data = partial(lstm_tuner, previous_csvs=previous_csvs, next_csvs=next_csvs)
            futures = {executor.submit(func_with_data, id): id for id in players.keys()}

            for future in tqdm(
                as_completed(futures), total=len(futures), desc="Processando jogadores"
            ):
                try:
                    key = futures[future]
                    hp = future.result()
                    hyperparameters[key] = hp

                    if hp != {}:
                        jogadores_validos += 1
                except Exception as e:
                    print(f"Erro no future loop. {e}")
    else:
        for id in tqdm(players.keys()):
            hp = lstm_tuner(id, previous_csvs, next_csvs)
            hyperparameters[id] = hp
            if hp != {}:
                jogadores_validos += 1

    print(f"Validos {jogadores_validos}")

    ROOT_DIR = Path(__file__).resolve().parent.parent
    path = os.path.join(ROOT_DIR, f"static/lstm/hp/{year}.json")
    with open(path, "w") as f:
        json.dump(hyperparameters, f, indent=4, ensure_ascii=False)
    return hyperparameters


def tune(year: int, previous_path: str, next_path: str, num_workers=0):
    players = get_players_from_season(next_path)
    previous_csvs = load_all_csvs(previous_path)
    next_csvs = load_all_csvs(next_path)
    all_lstm_tuner(year, previous_csvs, next_csvs, players, num_workers)


if __name__ == "__main__":
    data_dir = os.path.join(os.path.dirname(__file__), "data/")
    path_2019 = os.path.join(data_dir, "2019")
    path_2020 = os.path.join(data_dir, "2020")
    tune(2020, path_2019, path_2020, num_workers=10)
