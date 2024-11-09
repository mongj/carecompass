from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict

from app.models.review import Review, ReviewSource, ReviewableType
from app.core.database import db_dependency

router = APIRouter(prefix="/reviews", tags=["reviews"])

# Pydantic models for request/response
class ReviewBase(BaseModel):
    review_source: ReviewSource
    target_id: int
    target_type: ReviewableType
    content: str
    overall_rating: int
    author_id: Optional[str] = None
    google_author_name: Optional[str] = None
    google_author_url: Optional[str] = None
    google_author_photo_url: Optional[str] = None
    published_time: Optional[datetime] = None

class ReviewCreate(ReviewBase):
    pass

class ReviewResponse(ReviewBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    # published time is not optional in the response
    published_time: datetime


@router.get("/", response_model=List[ReviewResponse])
def list_reviews(
    db: db_dependency,
    skip: Optional[int] = None,
    limit: Optional[int] = None,
    target_type: Optional[ReviewableType] = None,
    target_id: Optional[int] = None,
    review_source: Optional[ReviewSource] = None,
):
    """
    List reviews with optional filtering and pagination.
    """
    query = db.query(Review)
    
    if target_type:
        query = query.filter(Review.target_type == target_type)
    if target_id:
        query = query.filter(Review.target_id == target_id)
    if review_source:
        query = query.filter(Review.review_source == review_source)
    
    reviews = query.offset(skip).limit(limit).all()
    return reviews


@router.post("/", response_model=ReviewResponse, status_code=201)
def create_review(review: ReviewCreate, db: db_dependency):
    """
    Create a new review.
    """
    db_review = Review(**review.model_dump())
    db.add(db_review)
    try:
        db.commit()
        db.refresh(db_review)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return db_review


@router.get("/{review_id}", response_model=ReviewResponse)
def get_review(review_id: int, db: db_dependency):
    """
    Get a specific review by ID.
    """
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review


@router.delete("/{review_id}", status_code=204)
def delete_review(review_id: int, db: db_dependency):
    """
    Delete a specific review by ID.
    """
    db_review = db.query(Review).filter(Review.id == review_id).first()
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    try:
        db.delete(db_review)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))