from typing import Optional, Literal
from datetime import datetime
from pydantic import BaseModel


class CheckoutCreate(BaseModel):
    exchange_method: Literal["local", "shipping"]
    borrower_note: Optional[str] = None


class CheckoutUpdate(BaseModel):
    status: Literal["approved", "declined", "returned"]


class BorrowerInfo(BaseModel):
    id: str
    display_name: str
    avatar_url: Optional[str] = None

    class Config:
        from_attributes = True


class BookSummary(BaseModel):
    id: str
    title: str
    author: str
    cover_image_url: Optional[str] = None
    spine_color: str

    class Config:
        from_attributes = True


class CheckoutResponse(BaseModel):
    id: str
    book_id: str
    borrower: BorrowerInfo
    status: str
    exchange_method: str
    borrower_note: Optional[str] = None
    requested_at: datetime
    approved_at: Optional[datetime] = None
    returned_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class RichCheckoutResponse(CheckoutResponse):
    """Checkout with full book and owner info embedded."""
    book: BookSummary
    book_owner_name: str
    book_owner_avatar: Optional[str] = None
