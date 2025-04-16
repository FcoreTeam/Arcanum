from aiogram import Dispatcher
from aiogram.client.default import DefaultBotProperties

from .handlers.register import register_handlers
from .middlewares.register import register_middlewares

from .bot import bot

from config import TelegramSettings

import logging

async def start_telegram_bot():
    dp = Dispatcher()
    register_handlers(dp)
    register_middlewares(dp)
    await dp.start_polling(bot)
