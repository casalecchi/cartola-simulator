from fastapi import APIRouter
from pathlib import Path
import os
from utils.timeseries import create_timeseries_from_year
from TeamAssignment.arima import player_arima

router = APIRouter()
ROOT_DIR = Path(__file__).resolve().parent.parent


@router.get("/years")
def get_data_years():
    return [2020]


@router.get("/player-timeseries")
def get_timeseries_from_player(id: int, year: int):
    DATA_DIR = os.path.join(ROOT_DIR, f"TeamAssignment/data/{year}")
    df, player_name = create_timeseries_from_year(id, DATA_DIR)
    converted_df = df.reset_index().to_dict(orient="records")
    return {"name": player_name, "data": converted_df}


@router.get("/player-arima")
def get_player_arima(id: int, year: int, p=2, d=0, q=3):
    previous_year = year - 1
    PREV_DIR = os.path.join(ROOT_DIR, f"TeamAssignment/data/{previous_year}")
    NEXT_DIR = os.path.join(ROOT_DIR, f"TeamAssignment/data/{year}")
    predictions = player_arima(id, PREV_DIR, NEXT_DIR, False, p, d, q)
    formattedPred = [{"rodada": i + 1, "pontos": pred} for i, pred in enumerate(predictions)]
    return {"predictions": formattedPred}
