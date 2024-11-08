from enum import Enum
from typing import TYPE_CHECKING
from datetime import datetime
from sqlalchemy import DateTime, Integer, String
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.models.util import use_enum_values

if TYPE_CHECKING:
    from .dementia_daycare import DementiaDaycare  # Import only for type checking


class ReviewSource(Enum):
    GOOGLE = "GOOGLE"
    IN_APP = "IN_APP"


class Reviewable(str, Enum):
    DEMENTIA_DAYCARE = "CARESERVICE::DEMENTIA_DAYCARE"

class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True,
        unique=True
    )
    review_target: Mapped[Reviewable] = mapped_column(
        SQLAlchemyEnum(Reviewable, values_callable=use_enum_values)
    )
    # We sacrifice referential integrity for polymorphic association
    # TODO: refactor to use a supertype table where each reviewable
    # resource has a unique reviewable_id
    review_target_id: Mapped[int] = mapped_column(Integer)
    review_source: Mapped[ReviewSource] = mapped_column(
        SQLAlchemyEnum(ReviewSource)
    )
    author_name: Mapped[str] = mapped_column(String)
    content: Mapped[str] = mapped_column(String)
    overall_rating: Mapped[int] = mapped_column(Integer)
    published_time: Mapped[datetime] = mapped_column(DateTime)

    # Relationship with DementiaDaycare model
    dementia_daycare: Mapped["DementiaDaycare"] = relationship(
        "DementiaDaycare", 
        back_populates="reviews"
    )