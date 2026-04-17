from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.comment import Comment
from app.models.ticket import Ticket
from app.models.user import User

from app.services.notification_service import create_notification

def _get_ticket_or_404(db: Session, ticket_id: int) -> Ticket:
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )
    return ticket


def _validate_ticket_access(ticket: Ticket, current_user: User):
    if current_user.role in ["admin", "support_agent"]:
        return

    if current_user.role == "customer" and ticket.customer_id == current_user.id:
        return

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You are not allowed to access comments for this ticket"
    )


def create_comment(db: Session, ticket_id: int, message: str, current_user: User) -> Comment:
    ticket = _get_ticket_or_404(db, ticket_id)
    _validate_ticket_access(ticket, current_user)

    comment = Comment(
        message=message,
        ticket_id=ticket.id,
        user_id=current_user.id
    )

    db.add(comment)
    db.commit()
    db.refresh(comment)


    # notify customer (if not commenter)
    if ticket.customer_id != current_user.id:
        create_notification(
            db,
            ticket.customer_id,
            f"New comment on ticket #{ticket.id}"
        )

    # notify agent (if exists and not commenter)
    if ticket.assigned_agent_id and ticket.assigned_agent_id != current_user.id:
        create_notification(
            db,
            ticket.assigned_agent_id,
            f"New comment on ticket #{ticket.id}"
        )

        
    return comment


def get_comments_by_ticket(db: Session, ticket_id: int, current_user: User):
    ticket = _get_ticket_or_404(db, ticket_id)
    _validate_ticket_access(ticket, current_user)

    comments = (
        db.query(Comment)
        .filter(Comment.ticket_id == ticket.id)
        .order_by(Comment.id.asc())
        .all()
    )
    return comments