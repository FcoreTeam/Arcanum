from typing import Any, Callable, Dict, Union
from aiogram.dispatcher.middlewares.base import BaseMiddleware
from aiogram.types import Message, CallbackQuery, TelegramObject
from auth.models import User

class UserMiddleware(BaseMiddleware):
    async def __call__(self, handler: Callable, event: Union[Message, CallbackQuery], data: Dict[str, Any]) -> Any:
        from_user = event.from_user
        bot = data.get("bot")
        photos = await from_user.get_profile_photos(limit=1)
        avatar_url = None if photos.total_count < 1 else await bot.get_file(photos.photos[0][0].file_id)
        user = await User.get_or_create(telegram_id=from_user.id, defaults={
            "first_name":from_user.first_name,
            "username":from_user.username,
            "avatar_url":avatar_url,
        })
        data["user"] = user[0]
        return await handler(event, data)
