from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = Field(default="CRM App API", alias="APP_NAME")
    environment: str = Field(default="dev", alias="ENVIRONMENT")
    debug: bool = Field(default=False, alias="DEBUG")
    secret_key: str = Field(default="change-me-in-env", alias="SECRET_KEY")
    access_token_expire_minutes: int = Field(default=480, alias="ACCESS_TOKEN_EXPIRE_MINUTES")
    cors_origins: list[str] = Field(
        default_factory=lambda: [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ],
        alias="CORS_ORIGINS",
    )
    default_admin_email: str = Field(default="owner@clienthub.local", alias="DEFAULT_ADMIN_EMAIL")
    default_admin_password: str = Field(default="ChangeMe123!", alias="DEFAULT_ADMIN_PASSWORD")
    database_url: str = Field(default="sqlite:///./crm.db", alias="DATABASE_URL")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        populate_by_name=True,
    )


settings = Settings()
