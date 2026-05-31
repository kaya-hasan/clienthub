# pyrefly: ignore [missing-import]
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class CustomerBase(BaseModel):
  full_name: str = Field(description="Full name of the customer", min_length=3)
  phone: Optional[str] = Field(description="Phone number of the customer", default=None, pattern=r"^\+?[0-9\s\-\(\)]{10,20}$")
  email: Optional[str] = Field(description="Email address of the customer", default=None, pattern=r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
  notes: Optional[str] = Field(description="Notes about the customer", default=None)
  business_type: Optional[str] = Field(description="Type of business", default=None)
  city: Optional[str] = Field(description="City of the customer", default=None)
  status: Optional[str] = Field(description="Status of the customer", default="lead")
  last_contacted_at: Optional[datetime] = Field(description="Date and time of the last contact with the customer", default=None)


class CustomerCreate(CustomerBase):
  pass

class CustomerOut(CustomerBase):
  id: int
  created_at: datetime
  updated_at: datetime
  status: str
  last_contacted_at: Optional[datetime] = None
  class Config:
    from_attributes = True



class CustomerUpdate(CustomerBase):
  full_name: Optional[str] = Field(default=None, min_length=3)
  phone: Optional[str] = Field(default=None, pattern=r"^\+?[0-9\s\-\(\)]{10,20}$")
  email: Optional[str] = Field(default=None, pattern=r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
  notes: Optional[str] = Field(default=None)
  business_type: Optional[str] = Field(default=None)
  city: Optional[str] = Field(default=None)
  status: Optional[str] = Field(default="lead")
  last_contacted_at: Optional[datetime] = Field(default=None)
