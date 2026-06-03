# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException, Query
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from app.core.auth import get_current_user
from app.core.rate_limit import rate_limit
from app.db.deps import get_db
from app.models.user import User
from app.schemas.customer import CustomerCreate, CustomerDetailOut, CustomerSummaryOut, CustomerUpdate
from app.services.customer_service import (
  get_customer_by_id as _get_customer_by_id,
  create_customer as _create_customer,
  list_customers as _list_customers,
  update_customer as _update_customer,
  delete_customer as _delete_customer
)

router = APIRouter(prefix="/customers", tags=["customers"])

@router.post("/", response_model=CustomerDetailOut, dependencies=[Depends(rate_limit(20, 60))])
def create_customer(
  customer: CustomerCreate,
  db: Session = Depends(get_db),
  current_user: User = Depends(get_current_user),
):
  return _create_customer(db, customer, current_user.id)

@router.get("/", response_model=list[CustomerSummaryOut], dependencies=[Depends(rate_limit(60, 60))])
def get_customers(
  skip: int = Query(default=0, ge=0),
  limit: int = Query(default=100, le=100),
  db: Session = Depends(get_db),
  current_user: User = Depends(get_current_user),
):
  return _list_customers(db, current_user.id, skip, limit)

@router.get("/{customer_id}", response_model=CustomerDetailOut, dependencies=[Depends(rate_limit(60, 60))])
def get_customer(
  customer_id: int,
  db: Session = Depends(get_db),
  current_user: User = Depends(get_current_user),
):
  customer = _get_customer_by_id(db, customer_id, current_user.id)
  if customer is None:
    raise HTTPException(status_code=404, detail="Customer not found")
  return customer

@router.put("/{customer_id}", response_model=CustomerDetailOut, dependencies=[Depends(rate_limit(30, 60))])
def update_customer(
  customer_id: int,
  customer: CustomerUpdate,
  db: Session = Depends(get_db),
  current_user: User = Depends(get_current_user),
):
  db_customer = _update_customer(db, customer_id, customer, current_user.id)
  if db_customer["message"] == "Customer not found":
    raise HTTPException(status_code=404, detail=db_customer["message"])
  elif db_customer["success"] == False:
    raise HTTPException(status_code=400, detail=db_customer["message"])
  return db_customer["data"]

@router.delete("/{customer_id}", dependencies=[Depends(rate_limit(20, 60))])
def delete_customer(
  customer_id: int,
  db: Session = Depends(get_db),
  current_user: User = Depends(get_current_user),
):
  db_customer = _delete_customer(db, customer_id, current_user.id)
  if not db_customer["success"]:
    raise HTTPException(status_code=404, detail="Customer not found")
  
  return {"detail": db_customer["message"]}
  


