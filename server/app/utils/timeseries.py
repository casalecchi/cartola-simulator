import numpy as np
import pandas as pd
from typing import Dict, Tuple
from utils.dir import get_file_list


def create_timeseries_from_year(id: int, year_dir: str) -> Tuple[pd.DataFrame, str]:
    FILE_LIST = get_file_list(year_dir)
    timeseries = pd.DataFrame(columns=["round", "points"])
    apelido = ""
    for round, file in enumerate(FILE_LIST):
        rodada = pd.read_csv(f"{year_dir}/" + file)
        player_row = rodada[rodada["atletas.atleta_id"] == id]
        if player_row.empty:
            continue
        points = player_row["atletas.pontos_num"].item()
        if apelido == "":
            apelido = player_row["atletas.apelido"].item()
        timeseries.loc[len(timeseries)] = [round + 1, points]
    timeseries.set_index("round", inplace=True)
    return timeseries, apelido


def get_timeseries(id: int, csvs: Dict[str, pd.DataFrame]):
    timeseries = np.array([])
    for i in range(1, 39):
        df = csvs[f"rodada-{i:02}.csv"]
        row = df[df["atletas.atleta_id"] == id]
        points = np.nan if row.empty else row.iloc[0]["atletas.pontos_num"].item()
        timeseries = np.append(timeseries, points)
    return timeseries
