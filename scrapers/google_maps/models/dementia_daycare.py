from typing import List, Optional
from pydantic import BaseModel, HttpUrl

from models.review import Review

class DaycareAddress(BaseModel):
    id: int
    name: str
    address: str
    
class DementiaDaycare(BaseModel):
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[HttpUrl] = None
    operating_hours: Optional[List[str]] = None
    building_name: Optional[str] = None
    block: Optional[str] = None
    street_name: Optional[str] = None
    unit_no: Optional[str] = None
    postal_code: Optional[str] = None
    photos: Optional[List[str]] = None
    google_map_place_id: Optional[str] = None
    reviews: Optional[List[Review]] = None