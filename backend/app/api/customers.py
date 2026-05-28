# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException, Query
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.schemas.customer import CustomerCreate, CustomerOut, CustomerUpdate
from app.services.customer_service import (
  get_customer_by_id as _get_customer_by_id,
  create_customer as _create_customer,
  list_customers as _list_customers,
  update_customer as _update_customer,
  delete_customer as _delete_customer
)

router = APIRouter(prefix="/customers", tags=["customers"])

@router.post("/", response_model=CustomerOut)
def create_customer(customer: CustomerCreate, db: Session = Depends(get_db)):
  return _create_customer(db, customer)

@router.get("/", response_model=list[CustomerOut])
def get_customers(
  skip: int = Query(default=0, ge=0),
  limit: int = Query(default=100, le=100),
  db: Session = Depends(get_db)
):
  return _list_customers(db, skip, limit)

@router.get("/{customer_id}", response_model=CustomerOut)
def get_customer(customer_id: int, db: Session = Depends(get_db)):
  customer = _get_customer_by_id(db, customer_id)
  if customer is None:
    raise HTTPException(status_code=404, detail="Customer not found")
  return customer

@router.put("/{customer_id}", response_model=CustomerOut)
def update_customer(customer_id: int, customer: CustomerUpdate, db: Session = Depends(get_db)):
  db_customer = _update_customer(db, customer_id, customer)
  if db_customer["message"] == "Customer not found":
    raise HTTPException(status_code=404, detail=db_customer["message"])
  elif db_customer["success"] == False:
    raise HTTPException(status_code=400, detail=db_customer["message"])
  return db_customer["data"]

@router.delete("/{customer_id}")
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
  db_customer = _delete_customer(db, customer_id)
  if not db_customer["success"]:
    raise HTTPException(status_code=404, detail="Customer not found")
  
  return {"detail": db_customer["message"]}
  



