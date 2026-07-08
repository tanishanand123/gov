"""
SmartGov Assist — FastAPI Backend
"""
import logging
from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.db.database import init_db
from app.api import search, schemes, profile, documents
from app.models import user, document  # noqa: F401 — register models for create_all

settings = get_settings()

# Structured logging
structlog.configure(
    processors=[
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer(),
    ]
)
logging.basicConfig(level=logging.DEBUG if settings.debug else logging.INFO)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logging.info("Starting SmartGov Assist API...")
    await init_db()
    logging.info("Database initialized.")
    yield
    # Shutdown
    logging.info("Shutting down...")


app = FastAPI(
    title="SmartGov Assist API",
    description="AI-powered government scheme eligibility and application platform",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://smartgov.in",
        settings.app_env == "development" and "*" or "",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(search.router, prefix="/v1", tags=["Search"])
app.include_router(schemes.router, prefix="/v1", tags=["Schemes"])
app.include_router(profile.router, prefix="/v1", tags=["Profile"])
app.include_router(documents.router, prefix="/v1", tags=["Documents"])


@app.get("/health")
async def health():
    return {"status": "ok", "version": "1.0.0"}


@app.get("/")
async def root():
    return {
        "name": "SmartGov Assist API",
        "docs": "/docs",
        "health": "/health",
        "endpoints": {
            "search": "POST /v1/search",
            "scheme_detail": "GET /v1/schemes/{slug}",
            "scheme_list": "GET /v1/schemes",
        }
    }
