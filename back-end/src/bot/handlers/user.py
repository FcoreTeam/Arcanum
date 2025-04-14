from aiogram import Router
from aiogram.types import Message, WebAppInfo
from aiogram.filters.command import CommandStart
from aiogram.utils.keyboard import InlineKeyboardBuilder 

from auth.models import User

from config import TelegramSettings

async def start(message: Message):
    builder = InlineKeyboardBuilder()
    builder.button(text="Начать! 🧩", web_app=WebAppInfo(url=TelegramSettigns.app_url))
    response = (
        "👋 Привествую в боте Золтана!\n"
        "_Нажмите на кнопку чтобы начать!_"
    )
    await message.answer(response, reply_markup=builder.as_markup())

def register_user_handlers(router: Router):
    router.message.register(start, CommandStart())

