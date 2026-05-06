from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from db import engine, Base
from models import user, book, checkout, notification  # noqa: F401 — ensure models register
from routers import auth, books, checkouts, notifications, friends

Base.metadata.create_all(bind=engine)

app = FastAPI(title="BookBuds API", version="1.0.0")

_default_origins = "http://localhost:3000,http://localhost:3001"
_origins = os.getenv("ALLOWED_ORIGINS", _default_origins).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in _origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(books.router)
app.include_router(checkouts.router)
app.include_router(notifications.router)
app.include_router(friends.router)

static_dir = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(static_dir, exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")


@app.get("/health")
def health():
    return {"status": "ok"}
