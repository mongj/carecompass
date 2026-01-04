from enum import Enum
from app.models.base import Base
from sqlalchemy import (
    TIMESTAMP,
    Column,
    ForeignKey,
    Integer,
    Enum as SQLAlchemyEnum
)
from sqlalchemy.orm import relationship

class SelectedMood(str, Enum):
    HAPPY = "happy"
    OK = "ok"
    SAD = "sad"

class Mood(Base):
    __tablename__ = "mood"

    id = Column(Integer, primary_key=True)
    care_receipient_id = Column(Integer, ForeignKey("care_receipient.id"))
    mood = Column(SQLAlchemyEnum(SelectedMood))
    created_at = Column(TIMESTAMP, nullable=False)

    care_receipient = relationship("CareReceipient", back_populates="moods")