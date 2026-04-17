from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from app.dependencies.auth import get_db, get_current_user
from app.schemas.attachment import AttachmentResponse
from app.services.attachment_service import upload_attachment, get_ticket_attachments

router = APIRouter(prefix="/tickets", tags=["Attachments"])


@router.post("/{ticket_id}/attachments", response_model=AttachmentResponse)
def upload_ticket_attachment(
    ticket_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return upload_attachment(db, ticket_id, file, current_user)


@router.get("/{ticket_id}/attachments", response_model=list[AttachmentResponse])
def list_ticket_attachments(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_ticket_attachments(db, ticket_id, current_user)