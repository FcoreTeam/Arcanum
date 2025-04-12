from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties

from .handlers.register import register_handlers
from .middlewares.register import register_middlewares

from config import TelegramBotConfig

import logging

async def start_telegram_bot(config: TelegramBotConfig):
    logging.info("OK")
    token = config.TELEGRAM_TOKEN
    parse_mode = config.TELEGRAM_PARSE_MODE
    bot = Bot(token=token, default=DefaultBotProperties(parse_mode=parse_mode))
    dp = Dispatcher()
    register_handlers(dp)
    register_middlewares(dp)
    await dp.start_polling(bot, config=config)
