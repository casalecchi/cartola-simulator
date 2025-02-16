from typing import Optional
from models.player import PlayerRequest


class ArimaRequest(PlayerRequest):
    p: Optional[int]
    d: Optional[int]
    q: Optional[int]
