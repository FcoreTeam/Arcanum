from bot.main import start_telegram_bot

from config import Settings

from database import init_db

from fastapi import FastAPI, APIRouter

from games.router import games_api_router
from auth.router import auth_api_router

import asyncio

async def on_startup():
    pgsql_url = "asyncpg://{}:{}@{}:{}/{}".format(
        Settings.pgsql_user,
        Settings.pgsql_password,
        Settings.pgsql_host,
        Settings.pgsql_port,
        Settings.pgsql_name,
    )
    await init_db(pgsql_url)
    asyncio.ensure_future(start_telegram_bot())

app = FastAPI(on_startup=[on_startup], root_path="/api")
api_router = APIRouter()
api_router.include_router(games_api_router)
api_router.include_router(auth_api_router)
app.include_router(api_router)

