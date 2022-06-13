from pydantic import BaseSettings


class Settings(BaseSettings):
    static_dir: str

    class Config:
        env_file = ".env"
