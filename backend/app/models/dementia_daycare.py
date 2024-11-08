from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import Float, Integer, String
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base

if TYPE_CHECKING:
    from app.models.review import Review  # Import only for type checking

class DementiaDaycare(Base):
    __tablename__ = "dementia_daycare"

    id: Mapped[int] = mapped_column(
        Integer, 
        primary_key=True, 
        index=True, 
        autoincrement=True, 
        unique=True
    )
    friendly_id: Mapped[str] = mapped_column(String, unique=True)
    name: Mapped[str] = mapped_column(String)
    display_name: Mapped[str] = mapped_column(String)
    phone: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    email: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    website: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    lat: Mapped[float] = mapped_column(Float)
    lng: Mapped[float] = mapped_column(Float)
    operating_hours: Mapped[List[str]] = mapped_column(ARRAY(String))
    building_name: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    block: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    postal_code: Mapped[str] = mapped_column(String)
    street_name: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    unit_no: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    availability: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    google_map_place_id: Mapped[str] = mapped_column(String)
    photos: Mapped[List[str]] = mapped_column(ARRAY(String))
    
    # Relationship with Review model
    reviews: Mapped[List["Review"]] = relationship("Review", back_populates="dementia_daycare")