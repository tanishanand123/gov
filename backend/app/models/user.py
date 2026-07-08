"""
User profile model — every field the eligibility engine reads.
"""
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, Float, Boolean, DateTime, JSON, Text, func
from sqlalchemy.orm import Mapped, mapped_column
from app.db.database import Base


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    auth_id: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    mobile: Mapped[Optional[str]] = mapped_column(String(20))
    email: Mapped[Optional[str]] = mapped_column(String(200))
    name: Mapped[Optional[str]] = mapped_column(String(200))

    # ── Demographics ──────────────────────────────────────────────
    age: Mapped[Optional[int]] = mapped_column(Integer)
    dob: Mapped[Optional[datetime]] = mapped_column(DateTime)
    gender: Mapped[Optional[str]] = mapped_column(String(20))       # male/female/other
    caste: Mapped[Optional[str]] = mapped_column(String(20))        # general/obc/sc/st
    religion: Mapped[Optional[str]] = mapped_column(String(50))
    minority_status: Mapped[bool] = mapped_column(Boolean, default=False)

    # ── Geography ─────────────────────────────────────────────────
    state: Mapped[Optional[str]] = mapped_column(String(100))
    district: Mapped[Optional[str]] = mapped_column(String(100))
    block: Mapped[Optional[str]] = mapped_column(String(100))
    pincode: Mapped[Optional[str]] = mapped_column(String(10))
    area_type: Mapped[Optional[str]] = mapped_column(String(10))    # urban/rural

    # ── Economic ──────────────────────────────────────────────────
    annual_income: Mapped[Optional[float]] = mapped_column(Float)
    annual_turnover: Mapped[Optional[float]] = mapped_column(Float)
    bpl_card: Mapped[bool] = mapped_column(Boolean, default=False)
    has_bank_account: Mapped[bool] = mapped_column(Boolean, default=True)
    bank_details: Mapped[Optional[str]] = mapped_column(String(300))
    existing_loans: Mapped[bool] = mapped_column(Boolean, default=False)
    loan_amount_existing: Mapped[Optional[float]] = mapped_column(Float)

    # ── Occupation & Business ─────────────────────────────────────
    occupation: Mapped[Optional[str]] = mapped_column(String(50))
    # farmer/student/salaried/self-employed/daily-wage/unemployed/other
    sector: Mapped[Optional[str]] = mapped_column(String(100))
    # agriculture/manufacturing/services/retail/handicraft/technology/...

    business_type: Mapped[Optional[str]] = mapped_column(String(100))
    # proprietorship/partnership/pvt-ltd/llp/cooperative/...
    business_registration: Mapped[Optional[str]] = mapped_column(String(50))
    # udyam/gst/fssai/startup-india/...

    # ── Special Categories ────────────────────────────────────────
    is_farmer: Mapped[bool] = mapped_column(Boolean, default=False)
    is_student: Mapped[bool] = mapped_column(Boolean, default=False)
    is_woman_entrepreneur: Mapped[bool] = mapped_column(Boolean, default=False)
    is_msme: Mapped[bool] = mapped_column(Boolean, default=False)
    is_startup: Mapped[bool] = mapped_column(Boolean, default=False)
    is_shg: Mapped[bool] = mapped_column(Boolean, default=False)    # self help group
    has_disability: Mapped[bool] = mapped_column(Boolean, default=False)
    disability_type: Mapped[Optional[str]] = mapped_column(String(100))
    is_military: Mapped[bool] = mapped_column(Boolean, default=False)
    is_ex_serviceman: Mapped[bool] = mapped_column(Boolean, default=False)
    is_pensioner: Mapped[bool] = mapped_column(Boolean, default=False)
    is_widowed: Mapped[bool] = mapped_column(Boolean, default=False)

    # ── Land & Agriculture ────────────────────────────────────────
    land_holding_acres: Mapped[Optional[float]] = mapped_column(Float)
    land_type: Mapped[Optional[str]] = mapped_column(String(50))    # irrigated/rainfed/barren
    has_kisan_credit_card: Mapped[bool] = mapped_column(Boolean, default=False)
    crop_type: Mapped[Optional[str]] = mapped_column(String(200))

    # ── Education ─────────────────────────────────────────────────
    education: Mapped[Optional[str]] = mapped_column(String(50))
    # none/primary/8th/10th/12th/diploma/graduate/postgraduate/phd
    institution_name: Mapped[Optional[str]] = mapped_column(String(300))
    course_name: Mapped[Optional[str]] = mapped_column(String(300))

    # ── Documents in vault (which docs user has uploaded) ─────────
    documents_uploaded: Mapped[Optional[list]] = mapped_column(JSON)
    # ["aadhaar", "pan", "income_certificate", "caste_certificate", ...]

    # ── Derived tags (computed by eligibility engine) ─────────────
    profile_tags: Mapped[Optional[list]] = mapped_column(JSON)
    # ["farmer", "female", "sc", "karnataka", "small-farmer", "low-income", "diploma"]

    profile_completeness: Mapped[float] = mapped_column(Float, default=0.0)
    language_pref: Mapped[str] = mapped_column(String(100), default="English")
    preferences: Mapped[Optional[dict]] = mapped_column(JSON)
    # {"inapp": true, "sms": true, "whatsapp": false}

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
