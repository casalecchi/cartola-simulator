import os
import pandas as pd
from pathlib import Path
from utils import constants
from utils.dir import load_all_csvs

ROOT_DIR = Path(__file__).resolve().parent.parent


def generate_market_for_season(year: int):
    data_dir = os.path.join(ROOT_DIR, f"TeamAssignment/data/{year}")
    csvs = load_all_csvs(data_dir)

    for r in range(1, 39):
        prev_key = f"rodada-{(r-1):02}.csv"
        key = f"rodada-{r:02}.csv"
        market = {}
        for _, row in csvs[key].iterrows():
            id = row["atletas.atleta_id"]
            name = row["atletas.apelido"]
            photo = row["atletas.foto"]
            photo_url = photo.replace("FORMATO", "220x220") if isinstance(photo, str) else ""
            teamId = row["atletas.clube_id"]
            positionId = constants.POSITION_MAP[row["atletas.posicao_id"]]
            statusId = constants.STATUS_MAP[row["atletas.status_id"]]
            price = row["atletas.preco_num"] - row["atletas.variacao_num"]
            lastScore = 0.0
            average = 0.0
            gamesPlayed = 0
            if r > 1:
                prev = csvs[prev_key]
                df = prev[prev["atletas.atleta_id"] == id]
                for _, row in df.iterrows():
                    lastScore = row["atletas.pontos_num"]
                    average = row["atletas.media_num"]
                    gamesPlayed = row["atletas.jogos_num"]
            market[id] = (
                name,
                photo_url,
                teamId,
                positionId,
                statusId,
                price,
                lastScore,
                average,
                gamesPlayed,
            )
        df = pd.DataFrame.from_dict(
            market,
            columns=[
                "name",
                "photoUrl",
                "teamId",
                "positionId",
                "statusId",
                "price",
                "lastScore",
                "average",
                "gamesPlayed",
            ],
            orient="index",
        )
        df.index.name = "id"
        path = os.path.join(ROOT_DIR, f"static/market/{year}/market-{r:02}.json")
        df.reset_index().to_json(path, orient="records", indent=4, force_ascii=False)


if __name__ == "__main__":
    generate_market_for_season(2020)
