from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, func
from app.db.session import Base


class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False, index=True)
    type = Column(String, nullable=False, index=True)
    note = Column(String, nullable=False)
    activity_date = Column(DateTime, nullable=False, index=True)
    created_at = Column(DateTime, nullable=False, default=func.now())
