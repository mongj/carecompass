from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, HttpUrl, ConfigDict, parse_obj_as
from sqlalchemy import and_
from sqlalchemy.exc import IntegrityError

from app.core.database import db_dependency
from app.models.dementia_daycare import DementiaDaycare
from app.models.review import Review, ReviewSource, ReviewableType

router = APIRouter(prefix="/dementia-daycare", tags=["dementia-daycare"])

# Pydantic models for request/response validation
class DementiaDaycareBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    friendly_id: str
    name: str
    display_name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    lat: float
    lng: float
    operating_hours: List[str]
    building_name: Optional[str] = None
    block: Optional[str] = None
    postal_code: str
    street_name: Optional[str] = None
    unit_no: Optional[str] = None
    availability: Optional[str] = None
    google_map_place_id: str
    photos: List[str] = []

class ReviewBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    target_type: ReviewableType
    target_id: int
    review_source: ReviewSource
    content: str
    overall_rating: int
    author_id: Optional[str] = None
    google_author_name: Optional[str] = None
    google_author_url: Optional[str] = None
    google_author_photo_url: Optional[str] = None
    published_time: datetime

class DementiaDaycareCreate(DementiaDaycareBase):
    pass

class DementiaDaycareResponse(DementiaDaycareBase):
    id: int
    reviews: List[ReviewBase]


# Routes
# List all dementia daycare centers
@router.get("/", response_model=List[DementiaDaycareResponse])
async def get_all_daycare_centers(
    db: db_dependency,
    skip: Optional[int] = None,
    limit: Optional[int] = None
):
    centers = db.query(
        DementiaDaycare
    ).offset(skip).limit(limit).all()

    # For each center, fetch its reviews
    response = []
    for center in centers:
        reviews = db.query(Review).filter(
            and_(
                Review.target_type == ReviewableType.DEMENTIA_DAY_CARE,
                Review.target_id == center.id
            )
        ).all()
        
        # Create response object with center data and reviews
        center_response = DementiaDaycareResponse(
            **center.__dict__,
            reviews=[ReviewBase.model_validate(review) for review in reviews]
        )
        response.append(center_response)
    
    return response

# Get specific dementia daycare center by ID
@router.get("/{center_id}", response_model=DementiaDaycareResponse)
def get_daycare_center(
    center_id: int,
    db: db_dependency
):
    center = db.query(
        DementiaDaycare
    ).filter(
        DementiaDaycare.id == center_id
    ).first()
    
    if not center:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dementia daycare center not found"
        )

    reviews = db.query(Review).filter(
        and_(
            Review.target_type == ReviewableType.DEMENTIA_DAY_CARE,
            Review.target_id == center_id
        )
    ).all()

    return DementiaDaycareResponse(
        **center.__dict__,
        reviews=[ReviewBase.model_validate(review) for review in reviews]
    )

# Create new dementia daycare center
@router.post("/", status_code=status.HTTP_201_CREATED)
def create_daycare_center(
    center: DementiaDaycareCreate,
    db: db_dependency
):
    try:
        db_center = DementiaDaycare(**center.model_dump())
        db.add(db_center)
        db.commit()
        db.refresh(db_center)
        return db_center
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A center with this friendly_id already exists"
        )

# DELETE dementia daycare center
@router.delete("/{center_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_daycare_center(
    center_id: int,
    db: db_dependency
):
    center = db.query(DementiaDaycare).filter(DementiaDaycare.id == center_id).first()
    if not center:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dementia daycare center not found"
        )
    
    db.delete(center)
    db.commit()

    # Delete all reviews associated with this center
    db.query(Review).filter(
        and_(
            Review.target_type == ReviewableType.DEMENTIA_DAY_CARE,
            Review.target_id == center_id
        )
    ).delete()
    return None
