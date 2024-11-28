from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from enum import Enum

class SSLModeEnum(str, Enum):
    disable = 'disable'
    allow = 'allow'
    prefer = 'prefer'
    require = 'require'
    verify_ca = 'verify-ca'
    verify_full = 'verify-full'

class Config(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8')

    DB_USER: str = Field(default='')
    DB_PASSWORD: str = Field(default='')
    DB_HOST: str = Field(default='')
    DB_PORT: int = Field(default=5432)
    DB_NAME: str = Field(default='postgres')

    DB_SSLMODE: SSLModeEnum = Field(default=SSLModeEnum.disable)

    OPENAI_API_KEY: str = Field(default='')
    OPENAI_ASSISTANT_ID: str = Field(default='')

    GOOGLE_MAPS_API_KEY: str = Field(default='')

    SENTRY_DSN: str = Field(default='')

    ENV: str = Field(default='development')

    def model_post_init(self, *args, **kwargs) -> None:
        required_fields = ['DB_USER', 'DB_PASSWORD', 'DB_HOST', 'OPENAI_API_KEY', 'OPENAI_ASSISTANT_ID', 'GOOGLE_MAPS_API_KEY']
        missing_fields = [field for field in required_fields if not getattr(self, field)]
        
        if missing_fields:
            raise ValueError(
                f"Missing required environment variables: {', '.join(missing_fields)}"
            )

config = Config()

# Export config
__all__ = ['config']
