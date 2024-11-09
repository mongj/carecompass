from typing import List, Optional
from fastapi import APIRouter, HTTPException, Response, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy import and_
from sqlalchemy.exc import IntegrityError

from app.core.database import db_dependency
from app.models.dementia_daycare import DementiaDaycare
from app.models.review import Review, ReviewableType
from app.api.routes.reviews import ReviewBase

router = APIRouter(prefix="/dementia-daycare", tags=["dementia-daycare"])

# Pydantic models for request/response validation
class DementiaDaycareBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    friendly_id: str
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    lat: float
    lng: float
    operating_hours: List[str] = []
    building_name: Optional[str] = None
    block: Optional[str] = None
    postal_code: str
    street_name: Optional[str] = None
    unit_no: Optional[str] = None
    availability: Optional[str] = None
    google_map_place_id: Optional[str] = None
    photos: List[str] = []

class DementiaDaycareCreate(DementiaDaycareBase):
    pass

class DementiaDaycarePatch(DementiaDaycareBase):
    model_config = ConfigDict(from_attributes=True)

    # Override all fields to be optional
    friendly_id: Optional[str] = None
    name: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    operating_hours: Optional[List[str]] = None
    postal_code: Optional[str] = None
    photos: Optional[List[str]] = None

class DementiaDaycareResponse(DementiaDaycareBase):
    id: int
    reviews: List[ReviewBase]

class DementiaDaycareAddress(BaseModel):
    id: int
    name: str
    address: str


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

# List all dementia daycare centre addresses for the scraper
@router.get("/addresses", response_model=List[DementiaDaycareAddress])
async def get_all_daycare_addresses(db: db_dependency):
    centers = db.query(DementiaDaycare).all()
    addresses = []
    for center in centers:
        address_parts = [center.block, center.street_name, center.building_name, center.unit_no, center.postal_code]
        addresses.append(DementiaDaycareAddress(
            id=center.id,
            name=center.name,
            address=" ".join([part for part in address_parts if part])
        ))
    return addresses

# Get specific dementia daycare center by ID
@router.get("/{center_id}", response_model=DementiaDaycareResponse)
async def get_daycare_center(
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

# Update dementia daycare center
@router.patch("/{center_id}", response_model=DementiaDaycareResponse)
async def update_daycare_center(
    center_id: int,
    update_data: DementiaDaycarePatch,
    db: db_dependency,
    override: bool = False
):
    """
    Update dementia daycare center with the given ID, using the provided update data.
    If `override` is set to True, existing values will be replaced with the update data.
    By default, `override` is False, and the update will only apply to empty fields.
    """
    # Get existing center
    center = db.query(DementiaDaycare).filter(
        DementiaDaycare.id == center_id
    ).first()
    
    if not center:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dementia daycare center not found"
        )

    # Convert update data to dict, excluding None values
    update_dict = update_data.model_dump(exclude_none=True)

    try:
        # Update each field based on override flag and None values
        for field, new_value in update_dict.items():
            existing_value = getattr(center, field)
            
            # Determine whether to update the field
            should_update = override or not existing_value
   
            if should_update:
                setattr(center, field, new_value)

        db.commit()
        db.refresh(center)

        # Fetch reviews for the response
        reviews = db.query(Review).filter(
            and_(
                Review.target_type == ReviewableType.DEMENTIA_DAY_CARE,
                Review.target_id == center.id
            )
        ).all()

        return DementiaDaycareResponse(
            **center.__dict__,
            reviews=[ReviewBase.model_validate(review) for review in reviews]
        )

    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Database integrity error occurred"
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

# Upsert dementia daycare center
@router.put("/", response_model=DementiaDaycareResponse)
async def upsert_daycare_center(
    center: DementiaDaycareCreate,
    db: db_dependency
):
    # Check if center exists with the given friendly_id
    existing_center = db.query(DementiaDaycare).filter(
        DementiaDaycare.friendly_id == center.friendly_id
    ).first()

    try:
        if existing_center:
            # Update existing center
            for key, value in center.model_dump(exclude_unset=True).items():
                setattr(existing_center, key, value)
            db_center = existing_center
        else:
            # Create new center
            db_center = DementiaDaycare(**center.model_dump())
            db.add(db_center)
        
        db.commit()
        db.refresh(db_center)

        # Fetch reviews for the response
        reviews = db.query(Review).filter(
            and_(
                Review.target_type == ReviewableType.DEMENTIA_DAY_CARE,
                Review.target_id == db_center.id
            )
        ).all()

        response = DementiaDaycareResponse(
            **db_center.__dict__,
            reviews=[ReviewBase.model_validate(review) for review in reviews]
        )

        return Response(
            status_code=status.HTTP_201_CREATED if not existing_center else status.HTTP_200_OK,
            content=response.model_dump_json(),
            media_type="application/json"
        )

    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Database integrity error occurred"
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
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
