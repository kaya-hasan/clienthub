from app.db.session import engine, Base
from app.models.customer import Customer

def init_db():
    """Create all tables in the database"""
    Base.metadata.create_all(bind=engine)
    print("Database initialized")

if __name__ == "__main__":
    init_db()
