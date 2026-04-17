from pydantic import BaseModel
from datetime import datetime


class AttachmentResponse(BaseModel):
    id: int
    file_name: str
    file_path: str
    ticket_id: int
    uploaded_by: int
    created_at: datetime | None = None

    class Config:
        from_attributes = True