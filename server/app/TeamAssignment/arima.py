import json
import os
import pandas as pd
import warnings
from concurrent.futures import ProcessPoolExecutor, as_completed
from pathlib import Path
from statsmodels.tsa.arima.model import ARIMA
from tqdm import tqdm
from typing import Dict, List, Tuple
from utils.dir import get_file_list
from utils.players import get_players_from_season


warnings.filterwarnings("ignore", category=UserWarning)


def load_all_csvs(csv_dir: str) -> Dict[str, pd.DataFrame]:
    csv_dict = {}
    file_list = get_file_list(csv_dir)
    for file in file_list:
        path = os.path.join(csv_dir, file)
        csv_dict[file] = pd.read_csv(path)
    return csv_dict


def get_points(row: pd.DataFrame) -> float:
    if row.empty:
        return 0.0
    return row.iloc[0]["atletas.pontos_num"].item()


def player_arima(
    player_id: int,
    previous_csvs: Dict[str, pd.DataFrame],
    next_csvs: Dict[str, pd.DataFrame],
    p=2,
    d=0,
    q=3,
):
    timeseries: List[float] = []
    predictions: List[float] = []

    # Construir a timeseries do ano anterior
    for r in range(1, len(previous_csvs) + 1):
        df = previous_csvs[f"rodada-{r:02}.csv"]
        row = df[df["atletas.atleta_id"] == player_id]
        points = get_points(row)
        timeseries.append(points)

    # Fazer previsões
    for r in range(1, len(next_csvs) + 1):
        df = next_csvs[f"rodada-{r:02}.csv"]
        row = df[df["atletas.atleta_id"] == player_id]
        points = get_points(row)

        if len(timeseries) > p + q:
            try:
                model = ARIMA(
                    timeseries,
                    order=(p, d, q),
                )
                fit = model.fit()
                pred = fit.forecast(steps=1)[0]
            except Exception as error:
                print(f"Error predicting for {player_id} - {error}")
                pred = 0
        else:
            pred = 0

        predictions.append(pred)
        timeseries.append(points)

    return predictions


def all_players_arima(
    year: int,
    previous_csvs: Dict[str, pd.DataFrame],
    next_csvs: Dict[str, pd.DataFrame],
    players: Dict[int, Tuple[str, str, int]],
    p=2,
    d=0,
    q=3,
    num_workers=0,
) -> pd.DataFrame:
    all_predictions: Dict[int, List[float]] = {}

    if num_workers > 0:
        with ProcessPoolExecutor(max_workers=num_workers) as executor:
            futures = {
                executor.submit(player_arima, id, previous_csvs, next_csvs, p, d, q): id
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
            pred = player_arima(id, previous_csvs, next_csvs, p, d, q)
            all_predictions[id] = pred

    ROOT_DIR = Path(__file__).resolve().parent.parent
    path = os.path.join(ROOT_DIR, f"static/arima/{year}-{p}:{d}:{q}.json")
    with open(path, "w") as f:
        json.dump(all_predictions, f, indent=4, ensure_ascii=False)
    return all_predictions


def run_arima(year: int, previous_path: str, next_path: str, p=2, d=0, q=3, num_workers=0):
    prev_csv = load_all_csvs(previous_path)
    next_csv = load_all_csvs(next_path)
    players = get_players_from_season(next_path)
    all_players_arima(year, prev_csv, next_csv, players, p, d, q, num_workers)


if __name__ == "__main__":
    data_dir = os.path.join(os.path.dirname(__file__), "data/")
    path_2019 = os.path.join(data_dir, "2019")
    path_2020 = os.path.join(data_dir, "2020")
    run_arima(2020, path_2019, path_2020, num_workers=10)
