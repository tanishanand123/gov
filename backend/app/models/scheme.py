"""
Core scheme data model — everything the scraper extracts goes here.
"""
from datetime import datetime
from typing import Optional
from sqlalchemy import (
    String, Text, Integer, Float, Boolean, DateTime, JSON,
    ForeignKey, Index, func, Enum
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
try:
    from pgvector.sqlalchemy import Vector
    _VECTOR_AVAILABLE = True
except ImportError:
    _VECTOR_AVAILABLE = False
    Vector = None

from app.db.database import Base
import enum


class SchemeLevel(str, enum.Enum):
    CENTRAL = "central"
    STATE = "state"
    DISTRICT = "district"


class SchemeStatus(str, enum.Enum):
    ACTIVE = "active"
    CLOSED = "closed"
    UPCOMING = "upcoming"
    UNKNOWN = "unknown"


class Scheme(Base):
    __tablename__ = "schemes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)

    # Core identity
    name: Mapped[str] = mapped_column(String(500), nullable=False)
    name_hi: Mapped[Optional[str]] = mapped_column(String(500))     # Hindi name
    summary: Mapped[Optional[str]] = mapped_column(Text)            # 2-line AI summary
    description: Mapped[Optional[str]] = mapped_column(Text)        # Full description
    level: Mapped[SchemeLevel] = mapped_column(Enum(SchemeLevel), default=SchemeLevel.CENTRAL)
    status: Mapped[SchemeStatus] = mapped_column(Enum(SchemeStatus), default=SchemeStatus.ACTIVE)

    # Origin
    ministry: Mapped[Optional[str]] = mapped_column(String(300))
    department: Mapped[Optional[str]] = mapped_column(String(300))
    state: Mapped[Optional[str]] = mapped_column(String(100))       # null = all-India
    source_url: Mapped[Optional[str]] = mapped_column(String(2000))
    application_url: Mapped[Optional[str]] = mapped_column(String(2000))
    official_pdf_url: Mapped[Optional[str]] = mapped_column(String(2000))

    # Eligibility — stored as structured JSON for the engine
    eligibility_raw: Mapped[Optional[dict]] = mapped_column(JSON)
    # Example:
    # {
    #   "age": {"min": 18, "max": 40},
    #   "gender": ["female"],
    #   "caste": ["SC", "ST", "OBC"],
    #   "income_max": 200000,
    #   "occupation": ["farmer", "student"],
    #   "states": ["Karnataka", "Tamil Nadu"],
    #   "education": ["10th", "diploma"],
    #   "land_max_acres": 5,
    #   "tags": ["farmer", "woman", "sc", "small-farmer"]
    # }

    eligibility_summary: Mapped[Optional[str]] = mapped_column(Text)  # AI-generated human-readable

    # Benefits
    benefits_raw: Mapped[Optional[dict]] = mapped_column(JSON)
    # Example:
    # {
    #   "type": ["loan", "subsidy", "grant"],
    #   "loan_amount": 500000,
    #   "subsidy_percent": 35,
    #   "grant_amount": 25000,
    #   "interest_rate": 7.0,
    #   "insurance_cover": 500000,
    #   "scholarship_amount": 25000,
    #   "description": "35% capital subsidy on loan up to ₹5L"
    # }

    benefit_summary: Mapped[Optional[str]] = mapped_column(Text)   # "₹25,000 scholarship / year"

    # Documents required
    documents_required: Mapped[Optional[list]] = mapped_column(JSON)
    # Example: ["aadhaar", "income_certificate", "caste_certificate", "bank_passbook", "photo"]

    # Application process (step-by-step)
    application_process: Mapped[Optional[str]] = mapped_column(Text)
    application_mode: Mapped[Optional[str]] = mapped_column(String(100))  # online/offline/both

    # Important dates
    opening_date: Mapped[Optional[datetime]] = mapped_column(DateTime)
    closing_date: Mapped[Optional[datetime]] = mapped_column(DateTime)
    renewal_date: Mapped[Optional[datetime]] = mapped_column(DateTime)
    financial_year: Mapped[Optional[str]] = mapped_column(String(20))

    # Contact
    helpline: Mapped[Optional[str]] = mapped_column(String(200))
    email: Mapped[Optional[str]] = mapped_column(String(200))
    contacts_json: Mapped[Optional[dict]] = mapped_column(JSON)

    # AI-generated
    faq: Mapped[Optional[list]] = mapped_column(JSON)
    who_should_apply: Mapped[Optional[str]] = mapped_column(Text)
    common_rejection_reasons: Mapped[Optional[list]] = mapped_column(JSON)
    important_notes: Mapped[Optional[str]] = mapped_column(Text)

    # Vector embedding — only added when pgvector extension is available

    # Extraction metadata
    extraction_confidence: Mapped[Optional[float]] = mapped_column(Float)
    needs_human_review: Mapped[bool] = mapped_column(Boolean, default=False)
    source_hash: Mapped[Optional[str]] = mapped_column(String(64))   # MD5 of raw source
    scraped_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
    verified_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
    last_modified: Mapped[Optional[datetime]] = mapped_column(DateTime)

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    applications: Mapped[list["SchemeApplication"]] = relationship(back_populates="scheme")
    change_logs: Mapped[list["SchemeChangeLog"]] = relationship(back_populates="scheme")

    __table_args__ = (
        Index("ix_schemes_state", "state"),
        Index("ix_schemes_level", "level"),
        Index("ix_schemes_status", "status"),
    )


class SchemeChangeLog(Base):
    """Tracks what changed between scrape runs."""
    __tablename__ = "scheme_change_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    scheme_id: Mapped[int] = mapped_column(ForeignKey("schemes.id"), nullable=False)
    field_changed: Mapped[str] = mapped_column(String(100))
    old_value: Mapped[Optional[str]] = mapped_column(Text)
    new_value: Mapped[Optional[str]] = mapped_column(Text)
    changed_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    scheme: Mapped["Scheme"] = relationship(back_populates="change_logs")


class SchemeApplication(Base):
    """User applications (linked to user profile)."""
    __tablename__ = "scheme_applications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    scheme_id: Mapped[int] = mapped_column(ForeignKey("schemes.id"), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="draft")  # draft/submitted/approved/rejected
    submission_id: Mapped[Optional[str]] = mapped_column(String(100))
    auto_filled_data: Mapped[Optional[dict]] = mapped_column(JSON)
    submitted_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    scheme: Mapped["Scheme"] = relationship(back_populates="applications")


class ScrapeJob(Base):
    """Tracks each scrape run."""
    __tablename__ = "scrape_jobs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    spider_name: Mapped[str] = mapped_column(String(100))
    status: Mapped[str] = mapped_column(String(50), default="running")  # running/done/failed
    schemes_found: Mapped[int] = mapped_column(Integer, default=0)
    schemes_updated: Mapped[int] = mapped_column(Integer, default=0)
    schemes_new: Mapped[int] = mapped_column(Integer, default=0)
    errors: Mapped[Optional[list]] = mapped_column(JSON)
    started_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    finished_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
