from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    app_env: str = "development"
    debug: bool = True
    secret_key: str = "dev-secret"

    database_url: str = "postgresql+asyncpg://postgres:password@localhost:5432/smartgov"
    sync_database_url: str = "postgresql://postgres:password@localhost:5432/smartgov"
    redis_url: str = "redis://localhost:6379/0"

    anthropic_api_key: str = ""
    openai_api_key: str = ""

    meilisearch_url: str = "http://localhost:7700"
    meilisearch_key: str = "masterKey"

    s3_bucket: str = "smartgov-docs"
    s3_access_key: str = ""
    s3_secret_key: str = ""
    s3_endpoint: str = ""
    s3_region: str = "auto"

    tesseract_cmd: str = "/usr/bin/tesseract"
    scraper_rps: float = 1.0
    scraper_concurrency: int = 4

    daily_scrape_hour: int = 2
    daily_scrape_minute: int = 0

    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama3.2:latest"
    storage_dir: str = "./storage/documents"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
