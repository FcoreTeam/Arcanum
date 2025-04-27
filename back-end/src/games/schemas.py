from pydantic import BaseModel, UUID4
from datetime import datetime
from typing import List, Optional

class BaseGame(BaseModel):
    id: UUID4
    name: str
    description: str
    date: datetime
    price: int
    photo_url: str | None = None

    class Config:
        from_attributes = True

class BaseTip(BaseModel):
    id: UUID4
    content: str

    class Config:
        from_attributes = True

class FullGameResponse(BaseGame):
    tips: List[BaseTip]
<<<<<<< HEAD
    photo_url: str | None = None
    video_url: str | None = None

class AnswerIn(BaseModel):
=======
    buy_url: str | None = None
    video_url: HttpUrl | None = None


class AnswerInBase(BaseModel):
    answer: str

class AnswerIn(AnswerInBase):
>>>>>>> a930943 (chat update and add payment)
    telegram_id: int
    answer: str

class AnswerOut(BaseModel):
    success: bool
    consequences_video: str | None = None 
    place: int | None = None
    points: int | None = None

class GameResultUserOut(BaseModel):
    first_name: str
    username: str
    avatar_url: str

class GameResultOut(BaseModel):
    id: UUID4
    place: int
    points: int
    user: GameResultUserOut

    class Config:
        from_attributes = True
