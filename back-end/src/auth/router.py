from fastapi import APIRouter, HTTPException, Depends
from typing import Annotated

from .schemas import UserResponse, UserUpdateRequest

from aiogram.utils.web_app import WebAppUser

from .models import User

from .depends import get_user_by_init_data

auth_api_router = APIRouter(prefix="/auth")

WebAppUserDep = Annotated[WebAppUser, Depends(get_user_by_init_data)]

@auth_api_router.get("/me", response_model=UserResponse)
async def read_user(webapp_user: WebAppUserDep):
    user = await User.get(telegram_id=webapp_user.id)
    return User

@auth_api_router.patch("/me/sync", response_model=UserResponse)
async def sync_user(webapp_user: WebAppUserDep):
    await User.filter(telegram_id=webapp_user.id).update(
        username=webapp_user.username,
        avatar_url=webapp_user.photo_url,
        first_name=webapp_user.first_name
    )
    return await User.get(telegram_id=webapp_user.id)

@auth_api_router.patch("/me/update",response_model=UserResponse)
async def update_user(payload: UserUpdateRequest, webapp_user: WebAppUserDep):
    queryset =  User.filter(telegram_id=webapp_user.id)
    await queryset.update(email=payload.email)
    if payload.phone:
        await queryset.update(phone=payload.phone)
    return await User.get(telegram_id=webapp_user.id)


