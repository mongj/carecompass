from sqlalchemy import Integer, String, Column, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base


class Thread(Base):
    __tablename__ = "threads"
    thread_id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.clerk_id"))
    title = Column(String)

    user = relationship("User", back_populates="threads")
