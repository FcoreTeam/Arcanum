from config import MinioSettings
from miniopy_async import Minio

async def get_minio_instance() -> Minio:
    minio = Minio(
        f"{MinioSettings.host}:{MinioSettings.port}",
        access_key=MinioSettings.access_key,
        secret_key=MinioSettings.secret_key, 
        secure=MinioSettings.server_url.startswith("https://"),
        server_url=MinioSettings.server_url
    )
    if not await minio.bucket_exists("videos"):
        await minio.make_bucket("videos")
    if not await minio.bucket_exists("photos"):
        await minio.make_bucket("photos")
    return minio
 
