from hydrogram import Client
from hydrogram.types import Message
from hydrogram.raw.types import InputMessageID
from hydrogram.raw.functions.messages.get_messages import GetMessages
from config import TelegramSettings

from minio import get_minio_instance

async def get_message_by_id(app: Client, user_id: int, message_id: int) -> Message:
    return (await app.get_messages(user_id, message_ids=[message_id]))[0]

async def send_video_to_minio(user_id: int, message_id: int, filename: str, content_type: str) -> str:
    minio = await get_minio_instance(config)
    async with Client("bot", TelegramSettings.api_id, TelegramSettings.api_hash, bot_token=TelegramSettings.telegram_token) as app:
        message = await get_message_by_id(app, user_id, message_id)
        data = await app.download_media(message=message, in_memory=True)
        data.seek(0)
        await minio.put_object("videos", filename, data, data.getbuffer().nbytes, content_type=content_type)
        return await minio.presigned_get_object("videos", filename)

async def send_photo_to_minio(user_id: int, message_id: int, filename: str, content_type: str) -> str:
    minio = await get_minio_instance(config)
    async with Client("bot", TelegramSettings.api_id, TelegramSettings.api_hash, bot_token=TelegramSettings.telegram_token) as app:
        message = await get_message_by_id(app, user_id,  message_id)
        data = await app.download_media(message=message, in_memory=True)
        data.seek(0)
        await minio.put_object("photos", filename, data, data.getbuffer().nbytes, content_type=content_type)
        return await minio.presigned_get_object("photos", filename)
