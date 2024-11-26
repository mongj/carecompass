import logging
from typing import Annotated, Optional
from fastapi import Depends, FastAPI
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from pydantic import PostgresDsn

from app.core.config import config

def build_dsn():
    connection_params = {
        "scheme": "postgresql",
        "username": config.DB_USER,
        "password": config.DB_PASSWORD,
        "host": config.DB_HOST,
        "port": config.DB_PORT,
        "path": config.DB_NAME,
        "query": f"sslmode={config.DB_SSLMODE.value}"
    }

    # Validate and build URL
    dsn = PostgresDsn.build(**connection_params)
    
    return str(dsn)

DATABASE_URL = build_dsn()

engine = create_engine(
    DATABASE_URL,
    echo=config.ENV == "development"
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Test the database connection
def test_db_connection() -> None:
    try:
        db = SessionLocal()
        # Test the connection
        db.execute(text("SELECT 1"))
        logging.info("Database connection was successful!")
    except Exception as e:
        err = f"Error connecting to the database: {str(e)}"
        logging.error(err)
        raise RuntimeError(err)
    finally:
        db.close()

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
