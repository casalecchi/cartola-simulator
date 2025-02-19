from fastapi import APIRouter
from fastapi.responses import FileResponse
from models.common import YearRequest
from models.model import ArimaRequest
from models.player import PlayerRequest
from pathlib import Path
import os
from utils.timeseries import create_timeseries_from_year
from TeamAssignment.arima import player_arima

router = APIRouter()
ROOT_DIR = Path(__file__).resolve().parent.parent


@router.get("/years")
def get_data_years():
    return [2020]


@router.post("/players")
def available_players(request: YearRequest):
    json_path = os.path.join(ROOT_DIR, f"static/players/{request.year}.json")
    return FileResponse(json_path, media_type="application/json")


@router.post("/player-arima")
def get_player_arima(request: ArimaRequest):
    previous_year = request.year - 1
    PREV_DIR = os.path.join(ROOT_DIR, f"TeamAssignment/data/{previous_year}")
    NEXT_DIR = os.path.join(ROOT_DIR, f"TeamAssignment/data/{request.year}")
    predictions = player_arima(
        request.id, PREV_DIR, NEXT_DIR, False, request.p, request.d, request.q
    )
    formattedPred = [{"rodada": i + 1, "pontos": pred} for i, pred in enumerate(predictions)]
    return {"predictions": formattedPred}


@router.post("/player-timeseries")
def get_timeseries_from_player(request: PlayerRequest):
    DATA_DIR = os.path.join(ROOT_DIR, f"TeamAssignment/data/{request.year}")
    df, player_name = create_timeseries_from_year(request.id, DATA_DIR)
    converted_df = df.reset_index().to_dict(orient="records")
    return {"name": player_name, "data": converted_df}
