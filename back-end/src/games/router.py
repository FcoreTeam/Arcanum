from fastapi import APIRouter, Header
from .models import Game
from tortoise.contrib.pydantic import pydantic_model_creator, pydantic_queryset_creator
from typing import List
from tortoise import Tortoise
from .schemas import BaseGame, FullGameResponse

from minio import get_minio_instance

from datetime import datetime

games_api_router = APIRouter(prefix="/games")

@games_api_router.get("/")
async def read_games(until_today: bool = False, limit: int = 50) -> List[BaseGame]:
    if until_today:
        return await Game.filter(date__lte=datetime.now()).limit(limit)
    return await Game.all().limit(limit)

@games_api_router.get("/games/{game_id}", response_model=FullGameResponse)
async def read_game(game_id: str):
    minio = await get_minio_instance()
    game = await Game.get(id=game_id)
    response = FullGameResponse.from_orm(game)
    response.photo_url = await minio.presigned_get_object("videos", "")
    return game

