"""
Uploaded document vault — files the user uploads (Aadhaar, PAN, etc.)
plus whatever the local OCR/LLM pipeline extracted from them.
"""
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, DateTime, JSON, Boolean, func, Index
from sqlalchemy.orm import Mapped, mapped_column
from app.db.database import Base


class Document(Base):
    __tablename__ = "documents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    auth_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)

    doc_type: Mapped[str] = mapped_column(String(50), nullable=False)
    # aadhaar / pan / bank / bpl / income / caste / land / passport_photo / ...

    original_name: Mapped[str] = mapped_column(String(500))
    stored_path: Mapped[str] = mapped_column(String(1000))
    mime_type: Mapped[Optional[str]] = mapped_column(String(100))
    size_bytes: Mapped[Optional[int]] = mapped_column(Integer)

    status: Mapped[str] = mapped_column(String(20), default="processing")
    # processing / verified / failed

    extracted_data: Mapped[Optional[dict]] = mapped_column(JSON)
    extraction_error: Mapped[Optional[str]] = mapped_column(String(1000))
    needs_review: Mapped[bool] = mapped_column(Boolean, default=False)

    uploaded_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        Index("ix_documents_auth_doctype", "auth_id", "doc_type"),
    )
