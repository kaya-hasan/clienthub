from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.schemas.activity import ActivityCreate, ActivityOut
from app.services.activity_service import (
    create_activity as _create_activity,
    list_activities as _list_activities,
    list_customer_activities as _list_customer_activities,
)


router = APIRouter(prefix="/activities", tags=["activities"])


@router.post("/", response_model=ActivityOut)
def create_activity(payload: ActivityCreate, db: Session = Depends(get_db)):
    result = _create_activity(db, payload)
    if not result["success"]:
        raise HTTPException(status_code=404, detail=result["message"])
    return result["data"]


@router.get("/", response_model=list[ActivityOut])
def get_activities(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, le=100),
    db: Session = Depends(get_db),
):
    return _list_activities(db, skip, limit)


@router.get("/customer/{customer_id}", response_model=list[ActivityOut])
def get_customer_activities(
    customer_id: int,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, le=100),
    db: Session = Depends(get_db),
):
    return _list_customer_activities(db, customer_id, skip, limit)
