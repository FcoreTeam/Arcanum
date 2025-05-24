from fastapi import APIRouter, HTTPException, Depends, Query, UploadFile
from typing import Annotated, List

from .schemas import UserResponse, UserUpdateRequest, UserResult

from realtime.chat import chat_name_space

from aiogram.utils.web_app import WebAppUser
from aiogram.types import BufferedInputFile

from .models import User, Subscription
from games.models import GameResult, Game

from bot.bot import bot

from .depends import get_user_id

from games.services import build_game_response
from datetime import datetime, timedelta, timezone


auth_api_router = APIRouter(prefix="/auth")

GetUserIdDeps = Annotated[WebAppUser, Depends(get_user_id)]

@auth_api_router.get("/me", response_model=UserResponse)
async def read_user(user_id: GetUserIdDeps):
    user = await User.get(telegram_id=user_id).prefetch_related("bougth_games", "subscription")
    subscription = await Subscription.get(user=user)
    print(subscription.expire)
    print(subscription.expire >= datetime.now(timezone.utc))
    if subscription.expire >= datetime.now(timezone.utc):
        print(subscription.expire)
        bought_games = [await build_game_response(game) for game in Game.all()]
    else:
        bought_games = [await build_game_response(game) for game in user.bougth_games]
    return UserResponse.from_orm(user).copy(update={
        "avatar_url":await user.get_avatar_url(),
        "bougth_games":bought_games,
    }) 

@auth_api_router.get("/me/results")
async def read_user_results(user_id: GetUserIdDeps) -> List[UserResult]:
    results = await GameResult.filter(user__telegram_id=user_id).all()
    await GameResult.fetch_for_list(results, "game")
    return results 

@auth_api_router.post("/chat/photo")
async def send_chat_photo(
    sid: Annotated[str, Query(description="Id user from socket.io")],
    photo: UploadFile
):
    session = await chat_name_space.get_session(sid=sid)
    if not session: raise HTTPException(status_code=404, detail="SID not found")
    chat = session.get("chat")
    if not chat: raise HTTPException(status_code=403, detail="User not in chat")
    await bot.send_photo(chat_id=chat["admin_id"],photo=BufferedInputFile(photo.file.read(), filename=photo.filename))

@auth_api_router.patch("/me/update",response_model=UserResponse)
async def update_user(payload: UserUpdateRequest):
    queryset =  User.filter(telegram_id=payload.user_id)
    await queryset.update(email=payload.email)
    if payload.phone:
        await queryset.update(phone=payload.phone)
    user = await User.get(telegram_id=payload.user_id).prefetch_related("bougth_games", "subscription")
    return UserResponse.from_orm(user).copy(update={"avatar_url":await user.get_avatar_url()})
