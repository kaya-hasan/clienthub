from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class ActivityBase(BaseModel):
    customer_id: int
    type: str = Field(min_length=2, max_length=30)
    note: str = Field(min_length=2, max_length=1000)
    activity_date: datetime


class ActivityCreate(ActivityBase):
    pass


class ActivityOut(ActivityBase):
    id: int
    created_at: datetime
    customer_name: Optional[str] = None

    class Config:
        from_attributes = True
