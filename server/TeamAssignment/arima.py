import os
import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
from tqdm import tqdm
from typing import List
from utils.dir import get_file_list
from utils.visualization import plot_by_id


def get_points(row: pd.DataFrame) -> float:
    if row.empty:
        return 0.0
    return row["atletas.pontos_num"].item()


def player_arima(player_id: int, previous_path: str, next_path: str, plot=False, p=2, d=0, q=3):
    previous_files = get_file_list(previous_path)
    next_files = get_file_list(next_path)

    timeseries: List[float] = []
    predictions: List[float] = []

    # Construir a timeseries do ano anterior
    for previous in previous_files:
        path = os.path.join(previous_path, previous)
        df = pd.read_csv(path)
        row = df[df["atletas.atleta_id"] == player_id]
        points = get_points(row)
        timeseries.append(points)

    # Fazer previsões
    for next in tqdm(next_files):
        path = os.path.join(next_path, next)
        df = pd.read_csv(path)
        row = df[df["atletas.atleta_id"] == player_id]
        points = get_points(row)

        if len(timeseries) > p + q:
            try:
                model = ARIMA(timeseries, order=(p, d, q))
                fit = model.fit()
                pred = fit.forecast(steps=1)[0]
            except Exception as error:
                print(f"Error predicting for {next} - {error}")
                pred = 0
        else:
            pred = 0

        predictions.append(pred)
        timeseries.append(points)

    if plot:
        plot_by_id(player_id, 2020, next_path, predictions)


if __name__ == "__main__":
    data_dir = os.path.join(os.path.dirname(__file__), "data/")
    path_2019 = os.path.join(data_dir, "2019")
    path_2020 = os.path.join(data_dir, "2020")
    player_arima(38913, path_2019, path_2020)
