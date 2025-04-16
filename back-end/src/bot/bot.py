from aiogram import Bot
from aiogram.client.default import DefaultBotProperties

from config import TelegramSettings

bot = Bot(TelegramSettings.telegram_token, default=DefaultBotProperties(parse_mode=TelegramSettings.telegram_parse_mode))



