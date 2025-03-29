import json
import numpy as np
import os
import pandas as pd
from pathlib import Path
from typing import Dict, Optional, Tuple
from utils.dir import get_file_list, load_all_csvs
from utils.timeseries import get_timeseries

ROOT_DIR = Path(__file__).resolve().parent.parent


def get_players_from_season(
    data_dir: str, static_dir: Optional[str] = None
) -> Dict[int, Tuple[str, str, int]]:
    file_list = get_file_list(data_dir)
    players: Dict[int, Tuple[str, str, int]] = {}
    for file in file_list:
        df = pd.read_csv(f"{data_dir}/" + file)
        for _, row in df.iterrows():
            id = row["atletas.atleta_id"]
            if players.get(id) is not None:
                continue
            name = row["atletas.apelido"]
            photo = row["atletas.foto"]
            photo_url = photo.replace("FORMATO", "220x220") if isinstance(photo, str) else ""
            teamId = row["atletas.clube_id"]
            players[id] = (name, photo_url, teamId)

    df = pd.DataFrame.from_dict(players, columns=["name", "photoUrl", "teamId"], orient="index")
    df.index.name = "id"
    if static_dir is not None:
        path = os.path.join(ROOT_DIR, static_dir)
        df.reset_index().to_json(path, orient="records", indent=4)

    return players


def generate_json_players(year: int):
    data_dir = os.path.join(ROOT_DIR, f"TeamAssignment/data/{year}")
    file_dir = os.path.join(ROOT_DIR, f"static/players/{year}.json")
    get_players_from_season(data_dir, file_dir)
    with open(file_dir, "r") as f:
        players = json.load(f)
    prev_csvs = load_all_csvs(os.path.join(ROOT_DIR, f"TeamAssignment/data/{year-1}"))
    for player in players:
        prev_timeseries = get_timeseries(player["id"], prev_csvs)
        player["validLSTMValues"] = np.count_nonzero(~np.isnan(prev_timeseries))
    with open(file_dir, "w") as f:
        json.dump(players, f, indent=4, ensure_ascii=False)


if __name__ == "__main__":
    generate_json_players(2020)
