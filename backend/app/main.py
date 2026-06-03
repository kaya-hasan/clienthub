from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.customers import router as CustomerRouter
from app.api.activities import router as ActivityRouter
from app.api.auth import router as AuthRouter
from app.db.init_db import ensure_default_user, init_db
from app.db.session import SessionLocal


app = FastAPI(title=settings.app_name, debug=settings.debug)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(AuthRouter)
app.include_router(CustomerRouter)
app.include_router(ActivityRouter)


@app.on_event("startup")
def bootstrap_security() -> None:
    init_db()
    db = SessionLocal()
    try:
        ensure_default_user(db)
    finally:
        db.close()


@app.get("/")
def read_root() -> dict[str, str]:
    return {"status": "ok", "message": "CRM backend is running"}


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok", "message": "CRM backend is running"}
