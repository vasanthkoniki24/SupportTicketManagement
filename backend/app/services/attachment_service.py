import os
import shutil
from fastapi import UploadFile, HTTPException, status
from sqlalchemy.orm import Session
from app.models.attachment import Attachment
from app.models.ticket import Ticket
from app.models.user import User

UPLOAD_DIR = "uploads"


def upload_attachment(db: Session, ticket_id: int, file: UploadFile, current_user: User):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    if current_user.role == "customer" and ticket.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed to upload for this ticket")

    os.makedirs(UPLOAD_DIR, exist_ok=True)
    file_location = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    attachment = Attachment(
        file_name=file.filename,
        file_path=file_location,
        ticket_id=ticket.id,
        uploaded_by=current_user.id
    )

    db.add(attachment)
    db.commit()
    db.refresh(attachment)
    return attachment


def get_ticket_attachments(db: Session, ticket_id: int, current_user: User):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    if current_user.role == "customer" and ticket.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed to view attachments for this ticket")

    return db.query(Attachment).filter(Attachment.ticket_id == ticket_id).order_by(Attachment.id.desc()).all()