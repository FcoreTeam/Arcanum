from pydantic import BaseModel, UUID4
from typing import Optional, List
from datetime import date, datetime
from games.schemas import BaseGame, GameResultUserOut

class UserResult(BaseModel):
    id: UUID4
    point: int
    place: int
    created_at: datetime
    game: BaseGame

class UserUpdateRequest(BaseModel):
    user_id: int
    email: str
    phone: str | None = None

class UserSubscriptionResponse(BaseModel):
    id: UUID4
    expire: datetime

    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    id: UUID4
    username: Optional[str]
    first_name: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    balance: float
    is_admin: bool
    subscription: UserSubscriptionResponse
    avatar_url: Optional[str] = None
    bougth_games: List[BaseGame]
    resulsts: List[UserResult]

    class Config:
        from_attributes = True

