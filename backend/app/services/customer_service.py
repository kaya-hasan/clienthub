# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from app.schemas.customer import CustomerCreate, CustomerUpdate
from app.models.customer import Customer


def get_customer_by_id(db: Session, customer_id: int):
  return db.query(Customer).filter(Customer.id == customer_id).first()

def create_customer(db: Session, customer: CustomerCreate):
  db_customer = Customer(**customer.model_dump())
  db.add(db_customer)
  db.commit()
  db.refresh(db_customer)
  return db_customer


def list_customers(db: Session, skip: int = 0, limit: int = 100):
  customers = db.query(Customer).offset(skip).limit(limit).all()
  return customers


def update_customer(db: Session, customer_id: int, customer: CustomerUpdate):
  db_customer = db.query(Customer).filter(Customer.id == customer_id).first()
  if db_customer is None:
    return {"success": False, "message": "Customer not found"}
  update_data = customer.model_dump(exclude_unset=True)
  if update_data == {}:
    return {"success": False, "message": "No fields provided for update"}
  for key, value in update_data.items():
    setattr(db_customer, key, value)
  db.commit()
  db.refresh(db_customer)
  return {"success": True, "message": "Customer updated successfully", "data": db_customer}

def delete_customer(db: Session, customer_id: int):
  db_customer = db.query(Customer).filter(Customer.id == customer_id).first()
  if db_customer is None:
    return {"success": False, "message": "Customer not found"}
  db.delete(db_customer)
  db.commit()
  return {"success": True, "message": "Customer deleted successfully", "data": db_customer}
