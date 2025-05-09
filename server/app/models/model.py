from pydantic import BaseModel
from typing import Optional
from models.player import PlayerRequest


class ArimaRequest(PlayerRequest):
    p: Optional[int]
    d: Optional[int]
    q: Optional[int]
    autoarima: Optional[bool]


class LSTMRequest(PlayerRequest):
    n_steps: Optional[int]
    epochs: Optional[int]
    units: Optional[int]


class OtmRequest(BaseModel):
    year: int
    code: str
