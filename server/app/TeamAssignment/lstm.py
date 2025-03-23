import pandas as pd
import numpy as np
import os
from keras.models import Sequential
from keras.layers import LSTM, Dense
from sklearn.preprocessing import MinMaxScaler
from tqdm import tqdm
from typing import Dict
from utils.dir import load_all_csvs


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
):
    # Definir o número de rodadas (passos anteriores) usados para prever a próxima
    n_steps = 10  # Ajustar conforme necessário

    predictions = []

    prev_timeseries = get_timeseries(player_id, previous_csvs)
    next_timeseries = get_timeseries(player_id, next_csvs)

    for r in tqdm(range(1, 39)):
        context = np.concatenate([prev_timeseries, next_timeseries[:r]])
        if np.count_nonzero(~np.isnan(context)) < n_steps:
            print(f"Jogador {player_id} não tem dados suficientes para criar sequências.")
            return  # Pular jogadores que não têm dados suficientes

        context = np.nan_to_num(context)
        # Escalar os dados
        scaler = MinMaxScaler(feature_range=(0, 1))
        valid_context = context.reshape(-1, 1)
        scaler.fit(valid_context)
        scaled_context = scaler.transform(valid_context)

        # Criar sequências de treino com os dados de 2019
        X_train, y_train = create_sequences(scaled_context, n_steps)

        # Reshape para o formato que o LSTM espera (amostras, passos temporais, número de features)
        try:
            X_train = X_train.reshape((X_train.shape[0], X_train.shape[1], 1))
        except IndexError as e:
            print(f"Erro ao reshaping os dados do jogador {player_id}: {e}")
            return

        # --- DEFINIÇÃO DO MODELO ---
        model = Sequential()
        model.add(LSTM(32, return_sequences=True, input_shape=(n_steps, 1)))
        model.add(LSTM(16, return_sequences=False))
        model.add(Dense(1))
        model.compile(optimizer="adam", loss="mean_squared_error")
        model.fit(X_train, y_train, epochs=10, batch_size=4, verbose=0)

        # Usar as últimas n_steps de 2019 do jogador como ponto de partida
        input_seq = scaled_context[-n_steps:].reshape(1, n_steps, 1)
        pred = model.predict(input_seq, verbose=0)
        prediction = scaler.inverse_transform(pred)[0, 0]

        predictions.append(prediction)

    print(predictions)
    return predictions


if __name__ == "__main__":
    data_dir = os.path.join(os.path.dirname(__file__), "data/")
    path_2019 = os.path.join(data_dir, "2019")
    path_2020 = os.path.join(data_dir, "2020")
    prev_csv = load_all_csvs(path_2019)
    next_csv = load_all_csvs(path_2020)
    preds = player_lstm(42500, prev_csv, next_csv)
    reais = get_timeseries(42500, next_csv)

    import matplotlib.pyplot as plt

    plt.plot(reais, label="Real")
    plt.plot(preds, label="Previsto")
    plt.title("Previsão rodada a rodada")
    plt.legend()
    plt.grid(True)
    plt.show()
