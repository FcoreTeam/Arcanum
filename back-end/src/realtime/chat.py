from socketio import AsyncServer
from socketio.asgi import ASGIApp

from aiogram import Bot
from auth.models import User

from config import TelegramSettings
from bot.kbs.games import chat

from bot.bot import bot

import logging

import json

sio = AsyncServer(cors_allowed_origins='*', async_mode='asgi')
socket_app = ASGIApp(sio)

chats = {}

@sio.on("connect")
async def connect(sid, env):
    print("New Client Connected to This id :"+" "+str(sid))

@sio.on("chat")
async def on_chat(sid, data):
    logging.error(f"{sid}, {data}")
    user_id = data["user_id"]
    user = await User.get_or_none(telegram_id=user_id)
    admins = await User.filter(is_admin=True).all()
    for admin in admins:
        response = (
            "Юзер открыл запрос на чат с администратором.\n"
            f"ID: {user_id}\n"
            f"Username: {user.username}\n"
            f"First name: {user.first_name}"
        )
        await bot.send_message(chat_id=admin.telegram_id, text=response, reply_markup=chat(sid))

@sio.on("new-chat-message")
async def on_message(sid, data):
    message = data["message"]
    admin = chats[sid]
    await bot.send_message(chat_id=admin.telegram_id,text=str(message))

@sio.on("disconnect")
async def disconnect(sid):
    print("Client Disconnected: "+" "+str(sid))
