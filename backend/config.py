from pydantic import BaseSettings
from typing import List


class Settings(BaseSettings):
    APP_NAME: str = "AI Code Review Tool"
    GEMINI_API_KEY: str | None = None  # or other LLM provider key
    ALLOW_ORIGINS: List[str] = ["http://127.0.0.1:5500", "http://localhost:5500", "*"]

    class Config:
        env_file = ".env"


settings = Settings()

