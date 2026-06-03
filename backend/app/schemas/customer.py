from enum import Enum
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class CustomerStatus(str, Enum):
  lead = "lead"
  contacted = "contacted"
  customer = "customer"
  lost = "lost"

class CustomerBase(BaseModel):
  full_name: str = Field(description="Full name of the customer", min_length=3)
  phone: Optional[str] = Field(description="Phone number of the customer", default=None, pattern=r"^\+?[0-9\s\-\(\)]{10,20}$")
  email: Optional[str] = Field(description="Email address of the customer", default=None, pattern=r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
  notes: Optional[str] = Field(description="Notes about the customer", default=None, max_length=2000)
  business_type: Optional[str] = Field(description="Type of business", default=None, max_length=100)
  city: Optional[str] = Field(description="City of the customer", default=None, max_length=100)
  status: CustomerStatus = Field(description="Status of the customer", default=CustomerStatus.lead)
  last_contacted_at: Optional[datetime] = Field(description="Date and time of the last contact with the customer", default=None)
  last_visit_date: Optional[datetime] = None
  next_appointment_date: Optional[datetime] = None
  service_type: Optional[str] = Field(default=None, max_length=100)
  


class CustomerCreate(CustomerBase):
  pass

class CustomerSummaryOut(BaseModel):
  id: int
  full_name: str
  phone: Optional[str] = None
  business_type: Optional[str] = None
  city: Optional[str] = None
  status: CustomerStatus
  last_contacted_at: Optional[datetime] = None
  last_visit_date: Optional[datetime] = None
  next_appointment_date: Optional[datetime] = None
  service_type: Optional[str] = None
  created_at: datetime
  updated_at: datetime

  class Config:
    from_attributes = True


class CustomerDetailOut(CustomerBase):
  id: int
  created_at: datetime
  updated_at: datetime
  class Config:
    from_attributes = True



class CustomerUpdate(CustomerBase):
  full_name: Optional[str] = Field(default=None, min_length=3)
  phone: Optional[str] = Field(default=None, pattern=r"^\+?[0-9\s\-\(\)]{10,20}$")
  email: Optional[str] = Field(default=None, pattern=r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
  notes: Optional[str] = Field(default=None, max_length=2000)
  business_type: Optional[str] = Field(default=None, max_length=100)
  city: Optional[str] = Field(default=None, max_length=100)
  status: Optional[CustomerStatus] = Field(default=None)
  last_contacted_at: Optional[datetime] = Field(default=None)
  last_visit_date: Optional[datetime] = None
  next_appointment_date: Optional[datetime] = None
  service_type: Optional[str] = Field(default=None, max_length=100)
