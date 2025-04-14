from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties

from .handlers.register import register_handlers
from .middlewares.register import register_middlewares

from config import TelegramSettings

import logging

async def start_telegram_bot():
    token = TelegramSettings.telegram_token
    parse_mode = TelegramSettings.telegram_parse_mode
    bot = Bot(token=token, default=DefaultBotProperties(parse_mode=parse_mode))
    dp = Dispatcher()
    register_handlers(dp)
    register_middlewares(dp)
    await dp.start_polling(bot)
