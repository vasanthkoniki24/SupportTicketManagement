from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.dependencies.auth import get_db, get_current_user
from app.schemas.ticket import TicketCreate, TicketResponse, TicketAssign, TicketStatusUpdate
from app.services.ticket_service import create_ticket, get_tickets, get_ticket_by_id, assign_ticket, update_ticket_status

router = APIRouter(prefix="/tickets", tags=["Tickets"])


@router.post("", response_model=TicketResponse, status_code=status.HTTP_201_CREATED)
def create_new_ticket(
    data: TicketCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return create_ticket(db, data, current_user)


@router.get("", response_model=list[TicketResponse])
def list_tickets(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return get_tickets(db, current_user)


@router.get("/{ticket_id}", response_model=TicketResponse)
def get_single_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return get_ticket_by_id(db, ticket_id, current_user)



@router.patch("/{ticket_id}/assign", response_model=TicketResponse)
def assign_ticket_to_agent(
    ticket_id: int,
    data: TicketAssign,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return assign_ticket(db, ticket_id, data.agent_id, current_user)


@router.patch("/{ticket_id}/status", response_model=TicketResponse)
def update_status(
    ticket_id: int,
    data: TicketStatusUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return update_ticket_status(db, ticket_id, data.status, current_user)