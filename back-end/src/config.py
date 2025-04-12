from os import environ
from dotenv import load_dotenv
from typing import Optional

load_dotenv()

class BaseConfig:
    DEBUG: bool = bool(environ.get("DEBUG"))

    MINIO_ACCESS_KEY: str = environ.get("MINIO_ACCESS_KEY")
    MINIO_SECRET_KEY: str = environ.get("MINIO_SECRET_KEY")

    MINIO_HOST: str = environ.get("MINIO_HOST")
    MINIO_PORT: int = environ.get("MINIO_PORT")
    MINIO_CONSOLE_PORT: int = environ.get("MINIO_CONSOLE_PORT")

class TelegramBotConfig(BaseConfig):
    TELEGRAM_TOKEN: Optional[str] = environ.get("TELEGRAM_TOKEN")
    TELEGRAM_PARSE_MODE: Optional[str] = environ.get("TELEGRAM_PARSE_MODE")  
    
    APP_URL: Optional[str] = environ.get("APP_URL")

    API_ID: Optional[str] = environ.get("API_ID")
    API_HASH: Optional[str] = environ.get("API_HASH")

class DevConfig(BaseConfig):
    APP_URL: Optional[str] = environ.get("API_URL")
    # Database Postgresql
    PGSQL_USER: Optional[str] = environ.get("PGSQL_USER")
    PGSQL_NAME: Optional[str] = environ.get("PGSQL_NAME")
    PGSQL_PASSWORD: Optional[str] = environ.get("PGSQL_PASSWORD")
    PGSQL_HOST: Optional[str] = environ.get("PGSQL_HOST")
    PGSQL_PORT: Optional[int] = int(environ.get("PGSQL_PORT"))
