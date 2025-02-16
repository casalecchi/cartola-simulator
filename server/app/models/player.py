from pydantic import BaseModel


class PlayerRequest(BaseModel):
    id: int
    year: int
