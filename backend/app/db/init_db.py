from sqlalchemy import inspect, text
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import hash_password
from app.db.session import Base, engine
from app.models.activity import Activity
from app.models.customer import Customer
from app.models.user import User


def init_db():
    """Keep legacy SQLite/dev installs compatible before migrations run."""
    inspector = inspect(engine)
    existing_tables = set(inspector.get_table_names())
    if not existing_tables:
        Base.metadata.create_all(bind=engine)
        return

    if "customers" in inspector.get_table_names():
        customer_columns = {column["name"] for column in inspector.get_columns("customers")}
        if "owner_id" not in customer_columns:
            with engine.begin() as connection:
                connection.execute(text("ALTER TABLE customers ADD COLUMN owner_id INTEGER"))


def ensure_default_user(db: Session) -> None:
    admin_email = settings.default_admin_email.lower()
    existing = db.query(User).filter(User.email == admin_email).first()
    if existing is not None:
        db.query(Customer).filter(Customer.owner_id.is_(None)).update(
            {"owner_id": existing.id},
            synchronize_session=False,
        )
        db.commit()
        return

    user = User(
        email=admin_email,
        password_hash=hash_password(settings.default_admin_password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    db.query(Customer).filter(Customer.owner_id.is_(None)).update(
        {"owner_id": user.id},
        synchronize_session=False,
    )
    db.commit()


if __name__ == "__main__":
    init_db()
