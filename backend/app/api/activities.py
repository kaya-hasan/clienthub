from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.auth import get_current_user
from app.core.rate_limit import rate_limit
from app.db.deps import get_db
from app.models.user import User
from app.schemas.activity import ActivityCreate, ActivityOut
from app.services.activity_service import (
    create_activity as _create_activity,
    delete_activity as _delete_activity,
    list_activities as _list_activities,
    list_customer_activities as _list_customer_activities,
)


router = APIRouter(prefix="/activities", tags=["activities"])


@router.post("/", response_model=ActivityOut, dependencies=[Depends(rate_limit(30, 60))])
def create_activity(
    payload: ActivityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = _create_activity(db, payload, current_user.id)
    if not result["success"]:
        raise HTTPException(status_code=404, detail=result["message"])
    return result["data"]


@router.get("/", response_model=list[ActivityOut], dependencies=[Depends(rate_limit(60, 60))])
def get_activities(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return _list_activities(db, current_user.id, skip, limit)


@router.get("/customer/{customer_id}", response_model=list[ActivityOut], dependencies=[Depends(rate_limit(60, 60))])
def get_customer_activities(
    customer_id: int,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return _list_customer_activities(db, customer_id, current_user.id, skip, limit)


@router.delete("/{activity_id}", dependencies=[Depends(rate_limit(30, 60))])
def remove_activity(
    activity_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = _delete_activity(db, activity_id, current_user.id)
    if not result["success"]:
        raise HTTPException(status_code=404, detail="Activity not found")
    return {"detail": "Activity deleted"}
