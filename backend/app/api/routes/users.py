from typing import List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, ConfigDict

from app.api.routes.threads import ThreadReadResponse
from app.core.database import db_dependency
from app.models import User, Citizenship, Residence, Relationship, Thread

router = APIRouter()


# Pydantic models
class UserBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    clerk_id: str
    citizenship: Citizenship
    care_recipient_age: int
    care_recipient_citizenship: Citizenship
    care_recipient_residence: Residence
    care_recipient_relationship: Relationship

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int # primary key in db
    threads: List[ThreadReadResponse] = []


# Routes
@router.post("/users/", response_model=UserResponse)
def create_user(userToAdd: UserCreate, db: db_dependency) -> UserResponse:
    # check if user already exists
    user = db.query(User).filter(User.clerk_id == userToAdd.clerk_id).first()
    if user:
        raise HTTPException(status_code=400, detail="user already exists")
    
    user = User(**userToAdd.model_dump())
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.get("/users/{user_id}", response_model=UserResponse)
def read_user(user_id: str, db: db_dependency):
    user = db.query(User).filter(User.clerk_id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="user not found")

    return user
