from aiogram import Dispatcher
from aiogram.client.default import DefaultBotProperties

from .handlers.register import register_handlers
from realtime.chat import register_chat_handlers
from .middlewares.register import register_middlewares

from .bot import bot, dp

from config import TelegramSettings

import logging

async def start_telegram_bot():
    register_handlers(dp)
    register_middlewares(dp)
    register_chat_handlers(dp)
    await dp.start_polling(bot)
