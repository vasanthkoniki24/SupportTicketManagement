from pydantic import BaseModel, Field
from datetime import datetime


ALLOWED_PRIORITIES = {"Low", "Medium", "High"}
ALLOWED_STATUSES = {"Open", "In Progress", "Resolved", "Closed"}


class TicketCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    description: str = Field(..., min_length=5)
    priority: str = Field(...)


class TicketAssign(BaseModel):
    agent_id: int

class TicketStatusUpdate(BaseModel):
    status: str = Field(...)

    
class TicketResponse(BaseModel):
    id: int
    title: str
    description: str
    priority: str
    status: str
    customer_id: int
    assigned_agent_id: int | None = None
    created_at: datetime | None = None
    resolved_at: datetime | None = None


    is_high_priority: bool = False
    resolution_time_minutes: float | None = None 
    resolution_time_hours: float | None = None

    class Config:
        from_attributes = True