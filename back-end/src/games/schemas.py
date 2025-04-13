from pydantic import BaseModel, UUID4
from datetime import datetime
from typing import List, Optional

class BaseGame(BaseModel):
    id: UUID4
    name: str
    description: str
    date: datetime

    class Config:
        from_attributes = True

class BaseTip(BaseModel):
    id: UUID4
    content: str

    class Config:
        from_attributes = True

class FullGameResponse(BaseGame):
    photo_url: Optional[str]
    video_url: Optional[str]
    tips: List[BaseTip] 
