from bot.main import start_telegram_bot
from dotenv import load_dotenv

from config import TelegramBotConfig, DevConfig

from database import init_db

from fastapi import FastAPI, APIRouter

from games.router import games_api_router
from auth.router import auth_api_router

import asyncio

async def on_startup():
    config = DevConfig()
    await init_db(f"asyncpg://{config.PGSQL_USER}:{config.PGSQL_PASSWORD}@{config.PGSQL_HOST}:{config.PGSQL_PORT}/{config.PGSQL_NAME}")
    asyncio.ensure_future(start_telegram_bot(TelegramBotConfig()))

app = FastAPI(on_startup=[on_startup], docs_url="/api/docs")
api_router = APIRouter()
api_router.include_router(games_api_router)
api_router.include_router(auth_api_router)
app.include_router(api_router)

