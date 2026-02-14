from typing import List, Optional

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

from app.api.routes.threads import ThreadReadResponse
from app.core.database import db_dependency
from app.core.dependencies import get_current_user_clerk_id, get_current_user
from app.models import Citizenship, Relationship, Residence, User

router = APIRouter()


# Pydantic models
class UserBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    clerk_id: str
    citizenship: Citizenship
    contact_number: Optional[int] = None
    
    care_recipient_age: int
    care_recipient_citizenship: Citizenship
    care_recipient_residence: Residence
    care_recipient_relationship: Relationship

    household_size: Optional[int] = None
    total_monthly_household_income: Optional[int] = None
    annual_property_value: Optional[int] = None
    monthly_pchi: Optional[int] = None

class UserCreate(UserBase):
    pass

# TODO: find a way to make all fields optional
# without setting them explicitly
class UserUpdate(UserBase):    
    model_config = ConfigDict(from_attributes=True)

    clerk_id: Optional[str] = None
    citizenship: Optional[Citizenship] = None
    care_recipient_age: Optional[int] = None
    care_recipient_citizenship: Optional[Citizenship] = None
    care_recipient_residence: Optional[Residence] = None
    care_recipient_relationship: Optional[Relationship] = None

class UserResponse(UserBase):
    id: int # primary key in db
    threads: List[ThreadReadResponse] = []

class PCHIBase(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )

    household_size: int
    total_monthly_household_income: int
    annual_property_value: Optional[int] = None
    monthly_pchi: int

class PCHICreate(PCHIBase):
    pass


# Routes

# Protected endpoint - requires authentication
@router.post("/users", response_model=UserResponse)
def create_user(
    userToAdd: UserCreate, 
    db: db_dependency,
    current_clerk_user: str = Depends(get_current_user_clerk_id)
) -> UserResponse:
    # Verify the authenticated user is creating their own profile
    if current_clerk_user != userToAdd.clerk_id:
        raise HTTPException(status_code=403, detail="Cannot create profile for another user")
    
    # Check if user already exists
    user = db.query(User).filter(User.clerk_id == userToAdd.clerk_id).first()
    if user:
        raise HTTPException(status_code=400, detail="user already exists")
    
    user = User(**userToAdd.model_dump())
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# Protected endpoint - requires authentication
@router.get("/users/{user_id}", response_model=UserResponse)
def read_user(
    clerk_id: str, 
    db: db_dependency,
    current_user: User = Depends(get_current_user)
):
    # Verify the authenticated user is accessing their own profile
    if current_user.clerk_id != clerk_id:
        raise HTTPException(status_code=403, detail="Cannot access another user's profile")
    
    user = db.query(User).filter(User.clerk_id == clerk_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="user not found")

    return user


# Protected endpoint - requires authentication
@router.patch("/users/{user_id}", response_model=UserResponse)
def update_user(
    clerk_id: str, 
    user_info: UserUpdate, 
    db: db_dependency,
    current_user: User = Depends(get_current_user)
):
    # Verify the authenticated user is updating their own profile
    if current_user.clerk_id != clerk_id:
        raise HTTPException(status_code=403, detail="Cannot update another user's profile")
    
    user = db.query(User).filter(User.clerk_id == clerk_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="user not found")

    data_dict = user_info.model_dump(exclude_unset=True)

    for key, value in data_dict.items():
        setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return user


# Protected endpoint - requires authentication
@router.put("/users/{user_id}/pchi", response_model=UserResponse)
def add_pchi_info(
    user_id: str, 
    pchi_info: PCHICreate, 
    db: db_dependency,
    current_user: User = Depends(get_current_user)
):
    # Verify the authenticated user is updating their own PCHI info
    if current_user.clerk_id != user_id:
        raise HTTPException(status_code=403, detail="Cannot update another user's PCHI info")
    
    user = db.query(User).filter(User.clerk_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="user not found")
    
    user.household_size = pchi_info.household_size
    user.total_monthly_household_income = pchi_info.total_monthly_household_income
    user.annual_property_value = pchi_info.annual_property_value
    user.monthly_pchi = pchi_info.monthly_pchi

    db.commit()
    db.refresh(user)
    return user
