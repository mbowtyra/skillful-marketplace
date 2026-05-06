import uuid
import random
import string
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from db import Base


def gen_uuid():
    return str(uuid.uuid4())


def gen_friend_code():
    """Generate a memorable 8-char code like FOXM-4A2B."""
    chars = string.ascii_uppercase + string.digits
    return "".join(random.choices(chars, k=4)) + "-" + "".join(random.choices(chars, k=4))


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=gen_uuid)
    email = Column(String, unique=True, nullable=False, index=True)
    display_name = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    avatar_url = Column(String, nullable=True)
    friend_code = Column(String, unique=True, nullable=False, default=gen_friend_code)
    created_at = Column(DateTime, default=datetime.utcnow)

    books = relationship("Book", back_populates="owner")
    checkouts = relationship("Checkout", back_populates="borrower")
    notifications = relationship("Notification", back_populates="user")
    friendships_as_user = relationship("Friendship", foreign_keys="Friendship.user_id", back_populates="user")
    friendships_as_friend = relationship("Friendship", foreign_keys="Friendship.friend_id", back_populates="friend")


class Friendship(Base):
    __tablename__ = "friendships"
    __table_args__ = (UniqueConstraint("user_id", "friend_id", name="uq_friendship"),)

    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    friend_id = Column(String, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", foreign_keys=[user_id], back_populates="friendships_as_user")
    friend = relationship("User", foreign_keys=[friend_id], back_populates="friendships_as_friend")
