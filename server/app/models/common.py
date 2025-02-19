from pydantic import BaseModel


class YearRequest(BaseModel):
    year: int
