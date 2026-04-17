from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.dependencies.auth import get_db, get_current_user
from app.services.admin_service import get_analytics_data

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/analytics")
def get_admin_analytics(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin can access analytics"
        )

    return get_analytics_data(db)