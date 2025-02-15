import pandas as pd
from typing import Tuple
from utils.dir import get_file_list


def create_timeseries_from_year(id: int, year_dir: str) -> Tuple[pd.DataFrame, str]:
    FILE_LIST = get_file_list(year_dir)
    timeseries = pd.DataFrame(columns=["rodada", "pontos"])
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
    timeseries.set_index("rodada", inplace=True)
    return timeseries, apelido
