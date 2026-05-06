import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from db import Base


def gen_uuid():
    return str(uuid.uuid4())


class Book(Base):
    __tablename__ = "books"

    id = Column(String, primary_key=True, default=gen_uuid)
    owner_id = Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False, index=True)
    author = Column(String, nullable=False, index=True)
    cover_image_url = Column(String, nullable=True)
    spine_color = Column(String, default="#8B4513")
    condition = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    available = Column(Boolean, default=True)
    exchange_type = Column(String, default="both")
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="books")
    checkouts = relationship("Checkout", back_populates="book", order_by="Checkout.requested_at")
