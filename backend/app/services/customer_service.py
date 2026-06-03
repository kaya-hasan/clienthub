# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from app.schemas.customer import CustomerCreate, CustomerUpdate
from app.models.customer import Customer
from app.models.activity import Activity


def get_customer_by_id(db: Session, customer_id: int, owner_id: int):
  return db.query(Customer).filter(Customer.id == customer_id, Customer.owner_id == owner_id).first()

def create_customer(db: Session, customer: CustomerCreate, owner_id: int):
  db_customer = Customer(**customer.model_dump(), owner_id=owner_id)
  db.add(db_customer)
  db.commit()
  db.refresh(db_customer)

  return db_customer


def list_customers(db: Session, owner_id: int, skip: int = 0, limit: int = 100):
  customers = (
    db.query(Customer)
    .filter(Customer.owner_id == owner_id)
    .order_by(Customer.updated_at.desc())
    .offset(skip)
    .limit(limit)
    .all()
  )
  return customers


def update_customer(db: Session, customer_id: int, customer: CustomerUpdate, owner_id: int):
  db_customer = db.query(Customer).filter(Customer.id == customer_id, Customer.owner_id == owner_id).first()
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

def delete_customer(db: Session, customer_id: int, owner_id: int):
  db_customer = db.query(Customer).filter(Customer.id == customer_id, Customer.owner_id == owner_id).first()
  if db_customer is None:
    return {"success": False, "message": "Customer not found"}
  db.query(Activity).filter(Activity.customer_id == db_customer.id).delete()
  db.delete(db_customer)
  db.commit()
  return {"success": True, "message": "Customer deleted successfully", "data": db_customer}
