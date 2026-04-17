from pydantic import BaseModel
from datetime import datetime


class NotificationResponse(BaseModel):
    id: int
    message: str
    user_id: int
    created_at: datetime | None = None

    class Config:
        from_attributes = True