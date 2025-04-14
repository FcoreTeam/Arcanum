from pydantic import BaseModel, UUID4
from typing import Optional

class UserUpdateRequest(BaseModel):
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

    class Config:
        from_attributes: True

