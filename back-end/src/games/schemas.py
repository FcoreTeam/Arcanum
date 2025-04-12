from pydantic import BaseModel, UUID4
from datetime import datetime
from typing import List

class BaseGame(BaseModel):
    id: UUID4
    name: str
    description: str
    date: datetime

    class Config:
        from_attributes = True


