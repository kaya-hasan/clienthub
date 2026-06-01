from sqlalchemy.orm import Session
from app.models.activity import Activity
from app.models.customer import Customer
from app.schemas.activity import ActivityCreate


def create_activity(db: Session, payload: ActivityCreate):
    customer = db.query(Customer).filter(Customer.id == payload.customer_id).first()
    if customer is None:
        return {"success": False, "message": "Customer not found"}

    activity = Activity(**payload.model_dump())
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return {"success": True, "data": activity}


def list_activities(db: Session, skip: int = 0, limit: int = 100):
    rows = (
        db.query(Activity, Customer.full_name)
        .join(Customer, Customer.id == Activity.customer_id)
        .order_by(Activity.activity_date.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return [
        {
            "id": activity.id,
            "customer_id": activity.customer_id,
            "type": activity.type,
            "note": activity.note,
            "activity_date": activity.activity_date,
            "created_at": activity.created_at,
            "customer_name": customer_name,
        }
        for activity, customer_name in rows
    ]


def list_customer_activities(db: Session, customer_id: int, skip: int = 0, limit: int = 100):
    rows = (
        db.query(Activity, Customer.full_name)
        .join(Customer, Customer.id == Activity.customer_id)
        .filter(Activity.customer_id == customer_id)
        .order_by(Activity.activity_date.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return [
        {
            "id": activity.id,
            "customer_id": activity.customer_id,
            "type": activity.type,
            "note": activity.note,
            "activity_date": activity.activity_date,
            "created_at": activity.created_at,
            "customer_name": customer_name,
        }
        for activity, customer_name in rows
    ]


def delete_activity(db: Session, activity_id: int):
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if activity is None:
        return {"success": False, "message": "Activity not found"}
    db.delete(activity)
    db.commit()
    return {"success": True}
