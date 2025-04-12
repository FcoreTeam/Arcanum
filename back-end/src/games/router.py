from fastapi import APIRouter
from .models import Game
from tortoise.contrib.pydantic import pydantic_model_creator, pydantic_queryset_creator
from typing import List
from tortoise import Tortoise
from .schemas import BaseGame

games_api_router = APIRouter(prefix="/games")

@games_api_router.get("/")
async def read_games(limit: int = 50) -> List[BaseGame]:
    return await Game.all().limit(limit)
