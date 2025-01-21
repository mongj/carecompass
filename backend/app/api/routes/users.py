from typing import List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

from app.api.routes.threads import ThreadReadResponse
from app.core.database import db_dependency
from app.models import User, Citizenship, Residence, Relationship

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

@router.patch("/users/{user_id}", response_model=UserResponse)
def update_user(user_id: str, user_info: UserUpdate, db: db_dependency):
    # stored_item_data = items[item_id]
    # stored_item_model = Item(**stored_item_data)
    # update_data = item.dict(exclude_unset=True)
    # updated_item = stored_item_model.copy(update=update_data)
    # items[item_id] = jsonable_encoder(updated_item)
    # return updated_item
    user = db.query(User).filter(User.clerk_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="user not found")

    # update_data = user_info.model_dump(exclude_unset=True)
    # updated_user = user.copy(update=update_data)
    data_dict = user_info.model_dump(exclude_unset=True)

    for key, value in data_dict.items():
        setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return user

# TODO: move this into the PATCH endpoint above
@router.put("/users/{user_id}/pchi", response_model=UserResponse)
def add_pchi_info(user_id: str, pchi_info: PCHICreate, db: db_dependency):
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
