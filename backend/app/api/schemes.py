"""
GET /schemes/{slug}  — full scheme detail page data.
GET /schemes/        — list with filters.
"""
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy import select, or_, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.models.scheme import Scheme, SchemeStatus, SchemeLevel

router = APIRouter()


class SchemeDetail(BaseModel):
    id: int
    slug: str
    name: str
    summary: Optional[str]
    description: Optional[str]
    ministry: Optional[str]
    department: Optional[str]
    state: Optional[str]
    level: str
    status: str
    eligibility_raw: Optional[dict]
    eligibility_summary: Optional[str]
    benefits_raw: Optional[dict]
    benefit_summary: Optional[str]
    documents_required: List[str]
    application_process: Optional[str]
    application_mode: Optional[str]
    application_url: Optional[str]
    source_url: Optional[str]
    official_pdf_url: Optional[str]
    opening_date: Optional[str]
    closing_date: Optional[str]
    financial_year: Optional[str]
    helpline: Optional[str]
    email: Optional[str]
    contacts_json: Optional[dict]
    faq: Optional[list]
    who_should_apply: Optional[str]
    common_rejection_reasons: Optional[list]
    important_notes: Optional[str]
    scraped_at: Optional[str]
    verified_at: Optional[str]


class SchemeListItem(BaseModel):
    id: int
    slug: str
    name: str
    summary: Optional[str]
    ministry: Optional[str]
    state: Optional[str]
    level: str
    status: str
    benefit_summary: Optional[str]
    closing_date: Optional[str]


def orm_to_detail(s: Scheme) -> SchemeDetail:
    return SchemeDetail(
        id=s.id,
        slug=s.slug,
        name=s.name,
        summary=s.summary,
        description=s.description,
        ministry=s.ministry,
        department=s.department,
        state=s.state,
        level=s.level.value if s.level else "central",
        status=s.status.value if s.status else "active",
        eligibility_raw=s.eligibility_raw,
        eligibility_summary=s.eligibility_summary,
        benefits_raw=s.benefits_raw,
        benefit_summary=s.benefit_summary,
        documents_required=s.documents_required or [],
        application_process=s.application_process,
        application_mode=s.application_mode,
        application_url=s.application_url,
        source_url=s.source_url,
        official_pdf_url=s.official_pdf_url,
        opening_date=s.opening_date.isoformat() if s.opening_date else None,
        closing_date=s.closing_date.isoformat() if s.closing_date else None,
        financial_year=s.financial_year,
        helpline=s.helpline,
        email=s.email,
        contacts_json=s.contacts_json,
        faq=s.faq,
        who_should_apply=s.who_should_apply,
        common_rejection_reasons=s.common_rejection_reasons,
        important_notes=s.important_notes,
        scraped_at=s.scraped_at.isoformat() if s.scraped_at else None,
        verified_at=s.verified_at.isoformat() if s.verified_at else None,
    )


@router.get("/schemes/{slug}", response_model=SchemeDetail)
async def get_scheme(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Scheme).where(Scheme.slug == slug))
    scheme = result.scalar_one_or_none()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return orm_to_detail(scheme)


@router.get("/schemes", response_model=dict)
async def list_schemes(
    state: Optional[str] = Query(None),
    level: Optional[str] = Query(None),
    ministry: Optional[str] = Query(None),
    q: Optional[str] = Query(None),
    page: int = Query(0, ge=0),
    size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """List schemes with optional filters and keyword search."""
    stmt = select(Scheme).where(Scheme.status == SchemeStatus.ACTIVE)

    if state:
        stmt = stmt.where(or_(Scheme.state == state, Scheme.state.is_(None)))
    if level:
        stmt = stmt.where(Scheme.level == level)
    if ministry:
        stmt = stmt.where(Scheme.ministry.ilike(f"%{ministry}%"))
    if q:
        # Full-text search on name + summary
        stmt = stmt.where(
            or_(
                Scheme.name.ilike(f"%{q}%"),
                Scheme.summary.ilike(f"%{q}%"),
                Scheme.description.ilike(f"%{q}%"),
            )
        )

    count_stmt = select(func.count()).select_from(stmt.subquery())
    total_result = await db.execute(count_stmt)
    total = total_result.scalar()

    stmt = stmt.offset(page * size).limit(size).order_by(Scheme.name)
    result = await db.execute(stmt)
    schemes = result.scalars().all()

    items = [
        SchemeListItem(
            id=s.id,
            slug=s.slug,
            name=s.name,
            summary=s.summary,
            ministry=s.ministry,
            state=s.state,
            level=s.level.value if s.level else "central",
            status=s.status.value if s.status else "active",
            benefit_summary=s.benefit_summary,
            closing_date=s.closing_date.isoformat() if s.closing_date else None,
        )
        for s in schemes
    ]

    return {"total": total, "page": page, "size": size, "schemes": items}
