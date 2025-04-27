from fastapi import APIRouter, Header, HTTPException
from .models import Game, GameResult
from auth.models import User
from tortoise.contrib.pydantic import pydantic_model_creator, pydantic_queryset_creator
from typing import List
from tortoise import Tortoise
from .schemas import BaseGame, FullGameResponse, AnswerIn, AnswerOut, GameResultOut

from datetime import datetime

from minio import get_minio_instance

from datetime import datetime

games_api_router = APIRouter(prefix="/games")

def _get_points_by_place(place: int) -> int:
    if place == 1: return 100
    if place == 2: return 50
    if place == 3: return 25
    if place <= 20: return 10
    return 5

@games_api_router.get("/")
async def read_games(until_today: bool = False, limit: int = 50) -> List[BaseGame]:
    if until_today:
        return await Game.filter(date__lte=datetime.now()).limit(limit)
    return await Game.all().limit(limit)

@games_api_router.get("/{game_id}", response_model=FullGameResponse)
async def read_game(game_id: str):
    minio = await get_minio_instance()
    game = await Game.get(id=game_id).prefetch_related("owner", "tips")
    response = FullGameResponse.from_orm(game)
    response = response.model_dump()
    response.update({"photo_url":await minio.presigned_get_object("photos", f"{game.owner.telegram_id}-{game.photo_message_id}.png")})
    response.update({"video_url":await minio.presigned_get_object("videos", f"{game.owner.telegram_id}-{game.video_message_id}.mp4")})
    return response

@games_api_router.post("/{game_id}/answer", response_model=AnswerOut)
<<<<<<< HEAD
async def answer(game_id: str, answer: AnswerIn):
    game = await Game.get(id=game_id)
    if not game:
        raise HTTPException(status_code=404, detail="Game doesn't exists")
    if game.answer == answer.answer:
        user = await User.get_or_none(telegram_id=answer.telegram_id)
        if not user:
            raise HTTPException(status_code=404, detail="User doesn't exists.")
=======
async def answer(
    game_id: Annotated[UUID4, Path(description="ID from the game.")], 
    answer: Annotated[AnswerIn, Body(description="Payload for the game, contains 'telegram_id', 'answer'")]
):

    user = await User.get_or_none(telegram_id=answer.telegram_id)
    if not user: raise HTTPException(status_code=401, detail="User doesn't exists.")
    game = await Game.get_or_none(id=game_id).prefetch_related("users")
    if not game:
        raise HTTPException(status_code=404, detail="Game doesn't exists")
    if user not in game.users: raise HTTPException(status_code=403, detail="The user did not buy this game")
    if game.answer.lower() == answer.answer.lower():
>>>>>>> a930943 (chat update and add payment)
        result = await GameResult.get_or_none(user=user, game=game)
        if result:
            raise HTTPException(status_code=403, detail="The user has already responded to the game")
        result_count = await GameResult.all().count()
        place = result_count + 1
        result = await GameResult.create(place=place, points=_get_points_by_place(place), user=user, game=game)
        await result.save()
        video_consequences = await game.get_video_consequences_url()
        return AnswerOut(success=True, consequences_video=video_consequences, place=place, points=_get_points_by_place(place))
    return AnswerOut(success=False)

@games_api_router.get("/{game_id}/leaderboard")
async def read_game_leaderboard(game_id: str) -> List[GameResultOut]:
    game = await Game.get_or_none(id=game_id)
    if not game:
        raise HTTPException(status_code=404, detail="Game doesn't exists")
    game_results = await GameResult.filter(game=game).all().prefetch_related("user")
    return game_results
