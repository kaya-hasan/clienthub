# pyrefly: ignore [missing-import]
from sqlalchemy import Column, Integer, String, DateTime, func
from app.db.session import Base

class Customer(Base):
    __tablename__ = "customers"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True, nullable=False)
    phone = Column(String, index=True)
    email = Column(String, index=True)
    notes = Column(String)
    business_type = Column(String, index=True)
    city = Column(String, index=True)
    created_at = Column(DateTime, index=True, default=func.now())
    updated_at = Column(DateTime, index=True, default=func.now(), onupdate=func.now())


