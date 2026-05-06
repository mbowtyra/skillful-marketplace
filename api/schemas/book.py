from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel
from .user import UserResponse
from .checkout import CheckoutResponse


class BookCreate(BaseModel):
    title: str
    author: str
    spine_color: str = "#8B4513"
    condition: str
    description: Optional[str] = None
    exchange_type: str = "both"
    cover_image_url: Optional[str] = None


class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    spine_color: Optional[str] = None
    condition: Optional[str] = None
    description: Optional[str] = None
    exchange_type: Optional[str] = None
    available: Optional[bool] = None


class BookResponse(BaseModel):
    id: str
    title: str
    author: str
    cover_image_url: Optional[str] = None
    spine_color: str
    condition: str
    description: Optional[str] = None
    available: bool
    exchange_type: str
    created_at: datetime
    owner: UserResponse

    class Config:
        from_attributes = True


class BookDetailResponse(BookResponse):
    checkouts: List[CheckoutResponse] = []
