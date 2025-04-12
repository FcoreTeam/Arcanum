from typing import Any, Callable, Dict, Union
from aiogram.dispatcher.middlewares.base import BaseMiddleware
from aiogram.types import Message, CallbackQuery, TelegramObject
from auth.models import User

class UserMiddleware(BaseMiddleware):

    async def __call__(self, handler: Callable, event: Union[Message, CallbackQuery], data: Dict[str, Any]) -> Any:
        from_user = event.from_user
        user = await User.get_or_create(telegram_id=from_user.id, defaults={
            "first_name":from_user.first_name,
            "username":from_user.username,
            "avatar_url":"ok",
        })
        data["user"] = user[0]
        return await handler(event, data)
