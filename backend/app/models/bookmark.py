from sqlalchemy import Integer, String
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base
from app.models.util import use_enum_values
# TODO: migrate ReviewableType to ResourceType
from app.models.review import ReviewableType

class Bookmark(Base):
    __tablename__ = "bookmarks"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True,
        unique=True
    )

    user_id: Mapped[str] = mapped_column(String)

    # We sacrifice referential integrity here for polymorphism
    target_id: Mapped[int] = mapped_column(Integer)
    target_type: Mapped[ReviewableType] = mapped_column(
        SQLAlchemyEnum(ReviewableType, values_callable=use_enum_values)
    )
    title: Mapped[str] = mapped_column(String)
    link: Mapped[str] = mapped_column(String)
