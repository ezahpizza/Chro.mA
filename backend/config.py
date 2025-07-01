from pydantic_settings import BaseSettings
from pydantic import Field
from typing import Optional


class Settings(BaseSettings):
    MONGODB_URL: str = Field(..., env="MONGODB_URL")
    DATABASE_NAME: str = Field(..., env="DATABASE_NAME")
    SPOTIFY_CLIENT_ID: str = Field(..., env="SPOTIFY_CLIENT_ID")
    SPOTIFY_CLIENT_SECRET: str = Field(..., env="SPOTIFY_CLIENT_SECRET")
    SPOTIFY_REDIRECT_URI: str = Field(..., env="SPOTIFY_REDIRECT_URI")
    SERPAPI_KEY: str = Field(..., env="SERPAPI_KEY")
    GOOGLE_API_KEY : str = Field(..., env="GOOGLE_API_KEY")
    ENV: Optional[str] = Field("dev", env="ENV")
    DEBUG: bool = Field(False, env="DEBUG")
    CORS_ORIGINS: str = Field(..., env="CORS_ORIGINS")
    GEMINI_MODEL: str = Field("gemini-2.5-flash-preview-04-17", env="GEMINI_MODEL")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
