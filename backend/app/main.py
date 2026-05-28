from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.customers import router as CustomerRouter


app = FastAPI(title=settings.app_name, debug=settings.debug)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(CustomerRouter)

@app.get("/")
def read_root() -> dict[str, str]:
    return {"status": "ok", "message": "CRM backend is running"}


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok", "message": "CRM backend is running"}
