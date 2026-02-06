import os
from app.models.base import Base
from sqlalchemy import (
    TIMESTAMP,
    Column,
    ForeignKey,
    Integer,
    String,
    Boolean
)
from sqlalchemy.orm import relationship
from sqlalchemy_utils import EncryptedType

DB_ENCRYPTION_SECRET = os.getenv("DB_ENCRYPTION_SECRET")

class CareReceipient(Base):
    __tablename__ = "care_receipient"

    id = Column(Integer, primary_key=True)

    # USER SIGNUP FIELDS
    name = Column(EncryptedType(String, DB_ENCRYPTION_SECRET), nullable=False)
    contact_number = Column(
        EncryptedType(String, DB_ENCRYPTION_SECRET),
        nullable=False,
        comment="Assumes SG phone number",
    )
    alias = Column(
        String, nullable=False, comment="To prevent data overflow on frontend"
    )
    app_language = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    race = Column(String, nullable=False)
    gender = Column(String, nullable=False)
    postal_code = Column(Integer, nullable=False)
    floor = Column(Integer, nullable=False)
    block = Column(String, nullable=False)
    unit = Column(String, nullable=False)

    consecutive_checkins = Column(Integer, nullable=False)
    consecutive_non_checkins = Column(Integer, nullable=False)
    is_suspended = Column(Boolean, nullable=False, default=False)

    created_at = Column(TIMESTAMP, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))
    can_record_mood = Column(Boolean, nullable=False)

    user = relationship("User", back_populates="care_receipients")
    moods = relationship("Mood", back_populates="care_receipient")
