from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

from app.models.review import ReviewableType
from app.models.bookmark import Bookmark
from app.core.database import db_dependency

router = APIRouter(prefix="/bookmarks", tags=["bookmarks"])

# Pydantic models for request/response
class BookmarkBase(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )

    user_id: str
    target_id: int
    target_type: ReviewableType
    title: str
    link: str

class BookmarkCreate(BookmarkBase):
    pass

class BookmarkResponse(BookmarkBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


@router.get("/", response_model=List[BookmarkResponse])
def list_bookmarks(
    db: db_dependency,
    skip: Optional[int] = None,
    limit: Optional[int] = None,
    target_type: Optional[ReviewableType] = None,
    target_id: Optional[int] = None,
    user_id: Optional[str] = None,
):
    """
    List bookmarks with optional filtering and pagination.
    """
    query = db.query(Bookmark)
    
    if target_type:
        query = query.filter(Bookmark.target_type == target_type)
    if target_id:
        query = query.filter(Bookmark.target_id == target_id)
    if user_id:
        query = query.filter(Bookmark.user_id == user_id)

    bookmarks = query.offset(skip).limit(limit).all()
    return bookmarks


@router.post("/", response_model=BookmarkResponse, status_code=201)
def create_bookmark(bookmark: BookmarkCreate, db: db_dependency):
    """
    Create a new bookmark.
    """
    db_bookmark = Bookmark(**bookmark.model_dump())
    db.add(db_bookmark)
    try:
        db.commit()
        db.refresh(db_bookmark)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return db_bookmark


@router.get("/{bookmark_id}", response_model=BookmarkResponse)
def get_bookmark(bookmark_id: int, db: db_dependency):
    """
    Get a specific bookmark by ID.
    """
    bookmark = db.query(Bookmark).filter(Bookmark.id == bookmark_id).first()
    if not bookmark:
        raise HTTPException(status_code=404, detail="Bookmark not found")
    return bookmark

@router.delete("/{bookmark_id}", status_code=204)
def delete_bookmark(bookmark_id: int, db: db_dependency):
    """
    Delete a specific bookmark by ID.
    """
    db_bookmark = db.query(Bookmark).filter(Bookmark.id == bookmark_id).first()
    if not db_bookmark:
        raise HTTPException(status_code=404, detail="Bookmark not found")
    
    try:
        db.delete(db_bookmark)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))