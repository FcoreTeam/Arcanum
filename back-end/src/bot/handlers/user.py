from aiogram import Router
from aiogram.types import Message, WebAppInfo
from aiogram.filters.command import CommandStart
from aiogram.utils.keyboard import InlineKeyboardBuilder 

from auth.models import User

from config import TelegramBotConfig

async def start(message: Message, config: TelegramBotConfig):
    builder = InlineKeyboardBuilder()
    builder.button(text="Начать! 🧩", web_app=WebAppInfo(url=config.APP_URL))
    response = (
        "👋 Привествую в боте Золтана!\n"
        "_Нажмите на кнопку чтобы начать!_"
    )
    await message.answer(response, reply_markup=builder.as_markup())

def register_user_handlers(router: Router):
    router.message.register(start, CommandStart())

