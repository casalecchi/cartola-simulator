import gc
import json
import numpy as np
import pandas as pd
import os
import tensorflow as tf
import warnings
from concurrent.futures import ProcessPoolExecutor, as_completed
from functools import partial
from keras import layers, models, optimizers, saving
from keras_tuner import HyperModel
from keras_tuner.tuners import BayesianOptimization
from lstm import create_sequences
from pathlib import Path
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import TimeSeriesSplit
from tqdm import tqdm
from typing import Dict, List, Tuple
from utils.dir import load_all_csvs
from utils.players import get_players_from_season
from utils.timeseries import get_timeseries

TUNE_NAME = "2layers"
DIR_NAME = "gru"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=FutureWarning)

physical_devices = tf.config.list_physical_devices("GPU")
if physical_devices:
    # Se tiver GPU, limitar uso de memória
    for device in physical_devices:
        tf.config.experimental.set_memory_growth(device, True)
else:
    # Se for CPU only, limitar threads para evitar sobrecarga
    tf.config.threading.set_intra_op_parallelism_threads(2)
    tf.config.threading.set_inter_op_parallelism_threads(2)


@saving.register_keras_serializable()
def custom_loss(y_true, y_pred):
    mse = tf.reduce_mean(tf.square(y_true - y_pred))
    variance_penalty = tf.square(tf.math.reduce_std(y_pred) - tf.math.reduce_std(y_true))
    return mse + 0.1 * variance_penalty


class LSTMHyperModel(HyperModel):
    def __init__(self, scaled_prev, build_data_fn):
        self.scaled_prev = scaled_prev
        self.build_data = build_data_fn

    def build(self, hp):
        n_steps = 2

        units_1 = hp.Choice("units_1", [64, 128])
        units_2 = hp.Choice("units_2", [8, 16])

        model = models.Sequential()
        model.add(
            layers.GRU(
                units=units_1, input_shape=(n_steps, 1), return_sequences=True, activation="relu"
            )
        )
        model.add(layers.GRU(units=units_2, activation="relu"))
        model.add(layers.Dense(1, "linear"))

        learning_rate = hp.Float("learning_rate", min_value=0.0001, max_value=0.01, sampling="log")
        optimizer = optimizers.Adam(learning_rate=learning_rate)

        model.compile(optimizer=optimizer, loss=custom_loss, metrics=["mae", "mse"])
        return model

    def fit(self, hp, model, *args, **kwargs):
        n_steps = 2
        batch = hp.Choice("batch_size", [4, 16])
        epochs = 30

        X, y = self.build_data(n_steps)

        tscv = TimeSeriesSplit(n_splits=3)
        train_index, val_index = list(tscv.split(X))[-1]
        X_train, X_val = X[train_index], X[val_index]
        y_train, y_val = y[train_index], y[val_index]

        return model.fit(
            X_train,
            y_train,
            validation_data=(X_val, y_val),
            epochs=epochs,
            batch_size=batch,
            verbose=0,
        )


def filter_players(
    players: Dict[int, Tuple[str, str, int, str]], previous_csvs: Dict[str, pd.DataFrame]
):
    filtered = []
    for id in players.keys():
        prev_timeseries = get_timeseries(id, previous_csvs)
        if np.count_nonzero(np.nan_to_num(prev_timeseries)) < 10:
            continue
        filtered.append(id)
    return filtered


def lstm_tuner(
    player_id: int,
    previous_csvs: Dict[str, pd.DataFrame],
    next_csvs: Dict[str, pd.DataFrame],
):
    prev_timeseries = get_timeseries(player_id, previous_csvs)
    next_timeseries = get_timeseries(player_id, next_csvs)
    next_timeseries = np.nan_to_num(next_timeseries)

    if np.count_nonzero(np.nan_to_num(prev_timeseries)) < 10:
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

    tuner = BayesianOptimization(
        hypermodel,
        objective="val_loss",
        max_trials=20,
        executions_per_trial=1,
        directory="lstm_tuning",
        project_name=f"{player_id}",
        overwrite=True,
    )

    tuner.search(verbose=0)

    best_hp = tuner.get_best_hyperparameters(1)[0]

    tf.keras.backend.clear_session()
    gc.collect()

    return best_hp.values


def all_lstm_tuner(
    year: int,
    previous_csvs: Dict[str, pd.DataFrame],
    next_csvs: Dict[str, pd.DataFrame],
    players: Dict[int, Tuple[str, str, int, str]],
    num_workers=0,
    chunk=0,
):
    hyperparameters: Dict[int, List[float]] = {}
    jogadores_validos = 0
    index = chunk * 20 + 50
    filtered_keys = filter_players(players, previous_csvs)[index : index + 20]

    if num_workers > 0:
        with ProcessPoolExecutor(max_workers=num_workers) as executor:
            func_with_data = partial(lstm_tuner, previous_csvs=previous_csvs, next_csvs=next_csvs)
            futures = {executor.submit(func_with_data, id): id for id in filtered_keys}

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
                    print(f"Erro no processamento de um grupo: {e}")

                # Forçar coleta de lixo após cada chunk para liberar memória
                gc.collect()
    else:
        for id in tqdm(players.keys()):
            hp = lstm_tuner(id, previous_csvs, next_csvs)
            hyperparameters[id] = hp
            if hp != {}:
                jogadores_validos += 1

            if jogadores_validos % 5 == 0:
                gc.collect()

    print(f"Validos {jogadores_validos}")

    ROOT_DIR = Path(__file__).resolve().parent.parent
    path = os.path.join(ROOT_DIR, f"static/{DIR_NAME}/hp/{year}-{TUNE_NAME}-{chunk}.json")
    with open(path, "w") as f:
        json.dump(hyperparameters, f, indent=4, ensure_ascii=False)
    return hyperparameters


def tune(year: int, previous_path: str, next_path: str, num_workers=0):
    players = get_players_from_season(next_path)
    previous_csvs = load_all_csvs(previous_path)
    next_csvs = load_all_csvs(next_path)
    ROOT_DIR = Path(__file__).resolve().parent.parent
    hps = {}
    for i in range(13):
        print(f"Chunk {i}")
        all_lstm_tuner(year, previous_csvs, next_csvs, players, num_workers, chunk=i)
        path = os.path.join(ROOT_DIR, f"static/{DIR_NAME}/hp/{year}-{TUNE_NAME}-{i}.json")
        with open(path, "r") as f:
            hp = json.load(f)
            hps.update(hp)
    path = os.path.join(ROOT_DIR, f"static/{DIR_NAME}/hp/{year}-{TUNE_NAME}.json")
    with open(path, "w") as f:
        json.dump(hps, f, indent=4, ensure_ascii=False)


if __name__ == "__main__":
    data_dir = os.path.join(os.path.dirname(__file__), "data/")
    path_2019 = os.path.join(data_dir, "2019")
    path_2020 = os.path.join(data_dir, "2020")
    # tune(2020, path_2019, path_2020, num_workers=10)
    ROOT_DIR = Path(__file__).resolve().parent.parent
    hps = {}
    path = os.path.join(ROOT_DIR, "static/gru/hp/2020-2layers-00.json")
    with open(path, "r") as f:
        hp = json.load(f)
        hps.update(hp)
    for i in range(13):
        path = os.path.join(ROOT_DIR, f"static/gru/hp/2020-2layers-{i}.json")
        with open(path, "r") as f:
            hp = json.load(f)
            hps.update(hp)
    path = os.path.join(ROOT_DIR, "static/gru/hp/2020-2layers.json")
    with open(path, "w") as f:
        json.dump(hps, f, indent=4, ensure_ascii=False)
