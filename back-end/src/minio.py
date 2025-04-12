from config import BaseConfig
from miniopy_async import Minio

async def get_minio_instance(config: BaseConfig) -> Minio:
    minio = Minio(
            f"{config.MINIO_HOST}:{config.MINIO_PORT}",
        access_key=config.MINIO_ACCESS_KEY,
        secret_key=config.MINIO_SECRET_KEY,
        secure=False,
        server_url=config.MINIO_SERVER_URL
    )
    if not await minio.bucket_exists("videos"):
        await minio.make_bucket("videos")
    if not await minio.bucket_exists("photos"):
        await minio.make_bucket("photos")
    return minio
 
