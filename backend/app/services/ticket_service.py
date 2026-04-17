from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.ticket import Ticket
from app.models.user import User
from app.schemas.ticket import TicketCreate, ALLOWED_PRIORITIES, ALLOWED_STATUSES
from datetime import datetime, timezone

from app.services.notification_service import create_notification
from app.services.email_service import send_email
from sqlalchemy import or_



def _add_ticket_meta(ticket: Ticket):
    ticket.is_high_priority = ticket.priority == "High"

    if ticket.created_at and ticket.resolved_at:
        diff = ticket.resolved_at - ticket.created_at
        resolution_minutes = round(diff.total_seconds() / 60, 2)
        resolution_hours = round(diff.total_seconds() / 3600, 2)
        ticket.resolution_time_minutes = resolution_minutes
        ticket.resolution_time_hours = resolution_hours
    else:
        ticket.resolution_time_minutes = None
        ticket.resolution_time_hours = None

    return ticket


def _add_ticket_meta_list(tickets: list[Ticket]):
    return [_add_ticket_meta(ticket) for ticket in tickets]



def create_ticket(db: Session, data: TicketCreate, current_user: User) -> Ticket:
    if current_user.role != "customer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only customers can create tickets"
        )

    if data.priority not in ALLOWED_PRIORITIES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Priority must be one of: Low, Medium, High"
        )

    ticket = Ticket(
        title=data.title,
        description=data.description,
        priority=data.priority,
        status="Open",
        customer_id=current_user.id
    )

    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return _add_ticket_meta(ticket)


def get_tickets(db: Session, current_user: User, page: int, limit: int, search: str | None, status: str | None, priority: str | None):
    query = db.query(Ticket)

    if current_user.role == "customer":
        query = query.filter(Ticket.customer_id == current_user.id)

    if search:
        query = query.filter(
            or_(
                Ticket.title.ilike(f"%{search}%"),
                Ticket.description.ilike(f"%{search}%")
            )
        )

    if status:
        query = query.filter(Ticket.status == status)

    if priority:
        query = query.filter(Ticket.priority == priority)

    total = query.count()

    tickets = (
        query.order_by(Ticket.id.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    tickets = _add_ticket_meta_list(tickets)

    return {
        "items": tickets,
        "page": page,
        "limit": limit,
        "total": total,
        "pages": (total + limit - 1) // limit
    }


def get_ticket_by_id(db: Session, ticket_id: int, current_user: User) -> Ticket:
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()

    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )

    if current_user.role in ["admin", "support_agent"]:
        return _add_ticket_meta(ticket)

    if ticket.customer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to view this ticket"
        )

    return _add_ticket_meta(ticket)


def assign_ticket(db: Session, ticket_id: int, agent_id: int, current_user: User) -> Ticket:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin can assign tickets"
        )

    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )

    agent = db.query(User).filter(User.id == agent_id).first()
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Support agent not found"
        )

    if agent.role != "support_agent":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Assigned user must have support_agent role"
        )

    ticket.assigned_agent_id = agent.id
    db.commit()
    db.refresh(ticket)

    # notify agent
    if agent.id != current_user.id:
        create_notification(
            db,
            agent.id,
            f"You have been assigned to ticket #{ticket.id}"
            )

    # notify customer
    if ticket.customer_id != current_user.id:
        create_notification(
            db,
            ticket.customer_id,
            f"Your ticket #{ticket.id} has been assigned to a support agent"
            )
        
    send_email(
        agent.email,
        f"Ticket #{ticket.id} Assigned",
        f"You have been assigned to ticket #{ticket.id}: {ticket.title}"
    )

    customer = db.query(User).filter(User.id == ticket.customer_id).first()
    if customer:
        send_email(
            customer.email,
            f"Ticket #{ticket.id} Assigned",
            f"Your ticket #{ticket.id} has been assigned to a support agent."
        )


    return _add_ticket_meta(ticket)


def update_ticket_status(db: Session, ticket_id: int, new_status: str, current_user: User) -> Ticket:
    if current_user.role not in ["admin", "support_agent"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin or support agent can update ticket status"
        )

    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )

    if new_status not in ALLOWED_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Status must be one of: Open, In Progress, Resolved, Closed"
        )

    allowed_flow = {
        "Open": ["In Progress"],
        "In Progress": ["Resolved"],
        "Resolved": ["Closed"],
        "Closed": []
    }

    if new_status == ticket.status:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ticket is already in '{ticket.status}' status"
        )

    if new_status not in allowed_flow[ticket.status]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status transition from '{ticket.status}' to '{new_status}'"
        )

    ticket.status = new_status

    if new_status == "Resolved":
        ticket.resolved_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(ticket)


    # notify customer
    if ticket.customer_id != current_user.id:
        create_notification(
            db,
            ticket.customer_id,
            f"Your ticket #{ticket.id} status updated to '{new_status}'"
            )

    # notify assigned agent (if exists and not updater)
    if ticket.assigned_agent_id and ticket.assigned_agent_id != current_user.id:
        create_notification(
            db,
            ticket.assigned_agent_id,
            f"Ticket #{ticket.id} status changed to '{new_status}'"
            )
        
    customer = db.query(User).filter(User.id == ticket.customer_id).first()
    if customer:
        send_email(
            customer.email,
            f"Ticket #{ticket.id} Status Update",
            f"Your ticket status has been updated to: {new_status}"
        )


    return _add_ticket_meta(ticket)