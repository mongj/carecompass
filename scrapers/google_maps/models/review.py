from datetime import datetime
from typing import Optional
from pydantic import BaseModel, HttpUrl

class Review(BaseModel):
    review_source: str = "GOOGLE"
    target_id: int
    target_type: str
    content: Optional[str] = None
    overall_rating: int
    google_review_id: str
    google_author_name: str
    google_author_url: HttpUrl
    google_author_photo_url: HttpUrl
    published_time: datetime
