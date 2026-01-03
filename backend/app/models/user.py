import os
from enum import Enum
from sqlalchemy import Integer, String, Column
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy.orm import relationship
from app.models.base import Base
from sqlalchemy_utils import EncryptedType

DB_ENCRYPTION_SECRET = os.getenv("DB_ENCRYPTION_SECRET")

class Citizenship(Enum):
    CITIZEN = "CITIZEN"
    PR = "PR"
    OTHER = "OTHER"

class Residence(Enum):
    HOME = "HOME"
    NURSING_HOME_LTCF = "NURSING_HOME_LTCF"
    OTHER = "OTHER"

class Relationship(Enum):
    PARENT = "PARENT"
    SPOUSE = "SPOUSE"
    OTHER_FAMILY = "OTHER_FAMILY"
    NON_FAMILY = "NON_FAMILY"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    clerk_id = Column(String, unique=True, index=True)
    citizenship = Column(SQLAlchemyEnum(Citizenship))
    contact_number = Column(
        EncryptedType(String, DB_ENCRYPTION_SECRET), nullable=True, comment="Assumes SG phone number"
    )

    care_recipient_age = Column(Integer)
    care_recipient_citizenship = Column(SQLAlchemyEnum(Citizenship))
    care_recipient_residence = Column(SQLAlchemyEnum(Residence))
    care_recipient_relationship = Column(SQLAlchemyEnum(Relationship))

    # PCHI info
    household_size = Column(Integer, nullable=True)
    total_monthly_household_income = Column(Integer, nullable=True)
    annual_property_value = Column(Integer, nullable=True)
    monthly_pchi = Column(Integer, nullable=True)

    threads = relationship("Thread", back_populates="user")
    care_receipients = relationship("CareReceipient", back_populates="user")
