from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.ticket import Ticket


def get_analytics_data(db: Session):
    total_tickets = db.query(func.count(Ticket.id)).scalar() or 0
    open_tickets = db.query(func.count(Ticket.id)).filter(Ticket.status == "Open").scalar() or 0
    in_progress_tickets = db.query(func.count(Ticket.id)).filter(Ticket.status == "In Progress").scalar() or 0
    resolved_tickets = db.query(func.count(Ticket.id)).filter(Ticket.status == "Resolved").scalar() or 0
    closed_tickets = db.query(func.count(Ticket.id)).filter(Ticket.status == "Closed").scalar() or 0

    low_priority = db.query(func.count(Ticket.id)).filter(Ticket.priority == "Low").scalar() or 0
    medium_priority = db.query(func.count(Ticket.id)).filter(Ticket.priority == "Medium").scalar() or 0
    high_priority = db.query(func.count(Ticket.id)).filter(Ticket.priority == "High").scalar() or 0

    resolved_ticket_rows = (
        db.query(Ticket)
        .filter(Ticket.resolved_at.isnot(None))
        .all()
    )

    resolution_times_minutes = []
    for ticket in resolved_ticket_rows:
        if ticket.created_at and ticket.resolved_at:
            diff = ticket.resolved_at - ticket.created_at
            resolution_times_minutes.append(diff.total_seconds() / 60)

    avg_resolution_time_minutes = None
    avg_resolution_time_hours = None

    if resolution_times_minutes:
        avg_resolution_time_minutes = round(
            sum(resolution_times_minutes) / len(resolution_times_minutes), 2
        )
        avg_resolution_time_hours = round(avg_resolution_time_minutes / 60, 2)

    return {
        "total_tickets": total_tickets,
        "status_breakdown": {
            "open": open_tickets,
            "in_progress": in_progress_tickets,
            "resolved": resolved_tickets,
            "closed": closed_tickets
        },
        "tickets_by_priority": {
            "low": low_priority,
            "medium": medium_priority,
            "high": high_priority
        },
        "average_resolution_time_minutes": avg_resolution_time_minutes,
        "average_resolution_time_hours": avg_resolution_time_hours
    }