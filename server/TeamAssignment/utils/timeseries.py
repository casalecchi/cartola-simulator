import os
import pandas as pd


def create_timeseries(id: int, data_dir) -> pd.DataFrame:
    FILE_LIST = os.listdir(data_dir)
    FILE_LIST.sort()
    timeseries = pd.DataFrame(columns=["rodada", "pontos"])
    for round, file in enumerate(FILE_LIST):
        rodada = pd.read_csv(data_dir + file)
        player_row = rodada[rodada["atletas.atleta_id"] == id]
        if player_row.empty:
            continue
        points = player_row["atletas.pontos_num"].item()
        timeseries.loc[len(timeseries)] = [round, points]
    timeseries.set_index("rodada", inplace=True)
    return timeseries
