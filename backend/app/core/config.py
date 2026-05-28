from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "CRM App API"
    environment: str = "dev"
    debug: bool = True

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")
    database_url: str = "sqlite:///./crm.db"


settings = Settings()
