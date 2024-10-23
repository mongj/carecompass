import os
from typing import Annotated, List, Optional

from dotenv import load_dotenv
from fastapi import Depends
from sqlmodel import Field, Relationship, Session, SQLModel, create_engine

class Person(SQLModel):
    id: int = Field(primary_key=True, index=True)
    citizenship: str
    care_recipient_age: int
    care_recipient_citizenship: str
    care_recipient_residence: int
    care_recipient_relationship: str

class User(Person, table=True):
    clerk_id: str = Field(unique=True, index=True)
    threads: List["Thread"] = Relationship(back_populates="user")

class Thread(SQLModel, table=True):
    thread_id: str = Field(primary_key=True, index=True)
    user_id: str = Field(foreign_key="user.clerk_id")
    title: str | None = Field(default=None)

    user: User = Relationship(back_populates="threads")

load_dotenv()

def build_db_conn_string():
    db_user = os.getenv("DB_USER")
    db_password = os.getenv("DB_PASSWORD")
    db_host = os.getenv("DB_HOST")
    db_name = os.getenv("DB_NAME")
    db_sslmode = os.getenv("DB_SSLMODE")

    return f"postgresql://{db_user}:{db_password}@{db_host}/{db_name}?sslmode={db_sslmode}"

DB_CONN_STRING = "postgresql://neondb_owner:ipIB5z2vSHJG@ep-yellow-wind-a1642y1z.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

engine = create_engine(DB_CONN_STRING)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]