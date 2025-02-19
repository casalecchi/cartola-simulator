import os
import pandas as pd
from pathlib import Path
from typing import Dict, Tuple
from utils.dir import get_file_list

ROOT_DIR = Path(__file__).resolve().parent.parent


def get_players_from_season(data_dir: str, static_dir: str) -> pd.DataFrame:
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
    path = os.path.join(ROOT_DIR, static_dir)
    df.reset_index().to_json(path, orient="records", indent=4)


if __name__ == "__main__":
    t = get_players_from_season(
        os.path.join(ROOT_DIR, "TeamAssignment/data/2020"), "static/players/2020.json"
    )
