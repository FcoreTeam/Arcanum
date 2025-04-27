from pydantic import BaseModel, UUID4
from typing import Optional, List

from games.schemas import BaseGame

class UserUpdateRequest(BaseModel):
    user_id: int
    email: str
    phone: str | None = None

class UserResponse(BaseModel):
    id: UUID4
    username: Optional[str]
    first_name: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    balance: float
    is_admin: bool
    avatar_url: Optional[str]
    bougth_games: List[BaseGame]

    class Config:
        from_attributes: True

