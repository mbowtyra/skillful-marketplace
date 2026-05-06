import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from db import Base


def gen_uuid():
    return str(uuid.uuid4())


class Checkout(Base):
    __tablename__ = "checkouts"

    id = Column(String, primary_key=True, default=gen_uuid)
    book_id = Column(String, ForeignKey("books.id"), nullable=False)
    borrower_id = Column(String, ForeignKey("users.id"), nullable=False)
    status = Column(String, default="requested")
    exchange_method = Column(String, nullable=False)
    borrower_note = Column(Text, nullable=True)
    requested_at = Column(DateTime, default=datetime.utcnow)
    approved_at = Column(DateTime, nullable=True)
    returned_at = Column(DateTime, nullable=True)

    book = relationship("Book", back_populates="checkouts")
    borrower = relationship("User", back_populates="checkouts")
    notifications = relationship("Notification", back_populates="checkout")
