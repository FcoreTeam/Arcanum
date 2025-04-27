from fastapi import APIRouter, HTTPException, Depends, Query, UploadFile
from typing import Annotated

from .schemas import UserResponse, UserUpdateRequest

from realtime.chat import chat_name_space

from aiogram.utils.web_app import WebAppUser
from aiogram.types import BufferedInputFile

from .models import User

from bot.bot import bot

from .depends import get_user_by_init_data, get_user_id

auth_api_router = APIRouter(prefix="/auth")

GetUserIdDeps = Annotated[WebAppUser, Depends(get_user_id)]

@auth_api_router.get("/me", response_model=UserResponse)
async def read_user(user_id: GetUserIdDeps):
    return await User.get(telegram_id=user_id).prefetch_related("bougth_games")
    
#@auth_api_router.patch("/me/sync", response_model=UserResponse)
#async def sync_user(webapp_user: WebAppUserDep):
#    await User.filter(telegram_id=webapp_user.id).update(
#        username=webapp_user.username,
#        avatar_url=webapp_user.photo_url,
#        first_name=webapp_user.first_name
#    )
#    return await User.get(telegram_id=webapp_user.id)

@auth_api_router.post("/chat/photo")
async def send_chat_photo(\
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
    return await User.get(telegram_id=payload.user_id)


