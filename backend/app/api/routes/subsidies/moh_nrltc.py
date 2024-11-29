from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, ConfigDict

from app.api.routes.users import PCHIBase
from app.core.database import db_dependency
from app.models import User, Citizenship

router = APIRouter(prefix="/moh-nrltc", tags=["moh-nrltc"])

# Pydantic models
class UserInfo(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str

class PCHIResponse(PCHIBase):
    pchi_band: str
    subsidy_level: int
    correct_as_of: str

# Routes
@router.post("/", response_model=PCHIResponse)
def calculate_pchi(user_info: UserInfo, db: db_dependency):
    user = db.query(User).filter(User.clerk_id == user_info.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="user not found")
    
    # Calculate subsidy level based on user info
    citizenship = user.care_recipient_citizenship
    monthly_pchi = user.monthly_pchi
    annual_property_value = user.annual_property_value

    if monthly_pchi is None:
        raise HTTPException(status_code=400, detail="user does not have PCHI info")

    # Determine PCHI band and subsidy level
    if monthly_pchi == 0:
        # No PCHI case - check annual value only
        if annual_property_value <= 21000:
            subsidy_level = 80 if citizenship == Citizenship.CITIZEN else 55
        else:
            subsidy_level = 0
        pchi_band = "NO_PCHI"
            
    else:
        # PCHI-based subsidy levels
        if monthly_pchi <= 900:
            subsidy_level = 80 if citizenship == Citizenship.CITIZEN else 55
            pchi_band = "$900 and below"
        elif monthly_pchi <= 1500:
            subsidy_level = 75 if citizenship == Citizenship.CITIZEN else 50
            pchi_band = "$901 to $1,500"
        elif monthly_pchi <= 2300:
            subsidy_level = 60 if citizenship == Citizenship.CITIZEN else 40
            pchi_band = "$1,501 to $2,300"
        elif monthly_pchi <= 2600:
            subsidy_level = 50 if citizenship == Citizenship.CITIZEN else 30
            pchi_band = "$2,301 to $2,600"
        elif monthly_pchi <= 3600:
            subsidy_level = 30 if citizenship == Citizenship.CITIZEN else 15
            pchi_band = "$2,601 to $3,600"
        else:
            subsidy_level = 0
            pchi_band = "$3,601 and above"

    return PCHIResponse(
        household_size=user.household_size,
        total_monthly_household_income=user.total_monthly_household_income,
        annual_property_value=user.annual_property_value,
        monthly_pchi=user.monthly_pchi,
        pchi_band=pchi_band,
        subsidy_level=subsidy_level,
        correct_as_of="1 Oct 2024"
    )
