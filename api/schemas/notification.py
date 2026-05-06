from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class NotificationResponse(BaseModel):
    id: str
    checkout_id: Optional[str] = None
    type: str
    message: str
    read: bool
    created_at: datetime

    class Config:
        from_attributes = True
