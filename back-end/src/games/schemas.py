from pydantic import BaseModel, UUID4, HttpUrl
from datetime import datetime
from decimal import Decimal
from typing import List, Optional

class BaseORMModel(BaseModel):
    class Config:
        from_attributes = True

class BaseStage(BaseORMModel):
    id: UUID4

class BaseDemo(BaseORMModel):
    id: UUID4

class BaseTip(BaseORMModel):
    id: UUID4
    content: str

class FullStage(BaseStage):
    video_url: HttpUrl
    tips: List[BaseTip]
    end: bool | None = None
    start: bool | None = None
    next_correct_answer: BaseStage | None = None
    next_wrong_answer: BaseStage | None = None

class FullDemo(BaseDemo):
    stages: List[FullStage]

class BaseGame(BaseORMModel):
    id: UUID4
    name: str
    description: str
    date: datetime
    price: Decimal
    demo: BaseDemo | None = None
    photo_url: HttpUrl | None = None

class FullGame(BaseGame):
    tips: List[BaseTip]
    video_url: HttpUrl | None = None

class AnswerInBase(BaseModel):
    answer: str

class AnswerIn(AnswerInBase):
    telegram_id: int

class AnswerOut(BaseModel):
    success: bool
    place: int | None = None
    points: int | None = None

class GameResultUserOut(BaseModel):
    first_name: str
    username: str
    avatar_url: str

class GameResultOut(BaseORMModel):
    id: UUID4
    place: int
    points: int
    user: GameResultUserOut
