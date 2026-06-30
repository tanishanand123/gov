"""
POST /search  — core endpoint.

Takes a customer profile JSON → returns ranked schemes with
full eligibility breakdown, benefit summary, and document gap analysis.
"""
from __future__ import annotations
import logging
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.models.scheme import Scheme, SchemeStatus
from app.models.user import UserProfile
from app.engine.eligibility import rank_schemes, profile_to_tags, SchemeScore

logger = logging.getLogger(__name__)
router = APIRouter()


# ── Request / Response models ─────────────────────────────────────────────────

class ProfileInput(BaseModel):
    """Customer profile sent by the frontend."""

    # Demographics
    age: Optional[int] = None
    gender: Optional[str] = None           # male / female / other
    caste: Optional[str] = None            # general / obc / sc / st
    religion: Optional[str] = None
    minority_status: bool = False

    # Geography
    state: Optional[str] = None
    district: Optional[str] = None
    area_type: Optional[str] = None        # urban / rural

    # Economic
    annual_income: Optional[float] = None
    annual_turnover: Optional[float] = None
    bpl_card: bool = False
    has_bank_account: bool = True
    existing_loans: bool = False

    # Occupation
    occupation: Optional[str] = None       # farmer/student/salaried/self-employed/...
    sector: Optional[str] = None
    business_type: Optional[str] = None
    business_registration: Optional[str] = None

    # Special categories
    is_farmer: bool = False
    is_student: bool = False
    is_woman_entrepreneur: bool = False
    is_msme: bool = False
    is_startup: bool = False
    is_shg: bool = False
    has_disability: bool = False
    disability_type: Optional[str] = None
    is_military: bool = False
    is_ex_serviceman: bool = False
    is_pensioner: bool = False
    is_widowed: bool = False

    # Land
    land_holding_acres: Optional[float] = None

    # Education
    education: Optional[str] = None        # none/primary/8th/10th/12th/diploma/graduate/postgraduate/phd

    # Documents user already has
    documents_uploaded: List[str] = Field(default_factory=list)

    # Search options
    top_n: int = Field(default=20, ge=1, le=100)
    include_almost: bool = True


class DocumentGap(BaseModel):
    document: str
    have: bool
    label: str


class SchemeResult(BaseModel):
    id: int
    slug: str
    name: str
    summary: Optional[str]
    ministry: Optional[str]
    state: Optional[str]
    level: str
    status: str                         # eligible / almost / not-eligible
    score: int                          # 0–100
    benefit_summary: Optional[str]
    benefits_raw: Optional[dict]
    documents_required: List[str]
    document_gaps: List[DocumentGap]    # which docs user has vs needs
    matched_criteria: List[str]
    missing_criteria: List[str]
    gap_analysis: List[str]
    application_url: Optional[str]
    source_url: Optional[str]
    helpline: Optional[str]
    closing_date: Optional[str]
    eligibility_summary: Optional[str]
    who_should_apply: Optional[str]


class SearchResponse(BaseModel):
    total: int
    eligible_count: int
    almost_count: int
    profile_tags: List[str]
    schemes: List[SchemeResult]


# ── Helper ────────────────────────────────────────────────────────────────────

def build_document_gaps(required_docs: list, uploaded_docs: list) -> list[DocumentGap]:
    """Show which docs the scheme needs and which the user already has."""
    gaps = []
    uploaded_set = set(d.lower() for d in (uploaded_docs or []))
    for doc in (required_docs or []):
        have = doc.lower() in uploaded_set
        label = doc.replace("_", " ").title()
        gaps.append(DocumentGap(document=doc, have=have, label=label))
    return gaps


def profile_input_to_orm(p: ProfileInput) -> UserProfile:
    """Convert Pydantic input to ORM model for the eligibility engine."""
    user = UserProfile()
    for field_name in p.model_fields:
        if field_name in ("top_n", "include_almost", "documents_uploaded"):
            continue
        val = getattr(p, field_name, None)
        if hasattr(user, field_name):
            setattr(user, field_name, val)
    user.documents_uploaded = p.documents_uploaded
    return user


def scheme_score_to_result(ss: SchemeScore, uploaded_docs: list) -> SchemeResult:
    s = ss.scheme
    return SchemeResult(
        id=s.id,
        slug=s.slug,
        name=s.name,
        summary=s.summary,
        ministry=s.ministry,
        state=s.state,
        level=s.level.value if s.level else "central",
        status=ss.status,
        score=ss.score,
        benefit_summary=s.benefit_summary,
        benefits_raw=s.benefits_raw,
        documents_required=s.documents_required or [],
        document_gaps=build_document_gaps(s.documents_required, uploaded_docs),
        matched_criteria=ss.matched_criteria,
        missing_criteria=ss.missing_criteria,
        gap_analysis=ss.gap_analysis,
        application_url=s.application_url,
        source_url=s.source_url,
        helpline=s.helpline,
        closing_date=s.closing_date.isoformat() if s.closing_date else None,
        eligibility_summary=s.eligibility_summary,
        who_should_apply=s.who_should_apply,
    )


# ── Endpoint ──────────────────────────────────────────────────────────────────

@router.post("/search", response_model=SearchResponse)
async def search_schemes(profile: ProfileInput, db: AsyncSession = Depends(get_db)):
    """
    Primary endpoint — takes customer profile, returns ranked matching schemes.

    Example request:
    {
      "age": 27, "gender": "female", "caste": "sc",
      "state": "Karnataka", "occupation": "farmer",
      "annual_income": 240000, "land_holding_acres": 4,
      "is_farmer": true, "education": "diploma",
      "documents_uploaded": ["aadhaar", "bank_passbook"]
    }
    """
    # 1. Convert profile to ORM
    user_profile = profile_input_to_orm(profile)
    profile_tags = profile_to_tags(user_profile)

    # 2. Fetch active schemes from DB
    #    Pre-filter by state to reduce the candidate set before scoring
    stmt = select(Scheme).where(Scheme.status == SchemeStatus.ACTIVE)

    if profile.state:
        stmt = stmt.where(
            or_(
                Scheme.state == profile.state,
                Scheme.state.is_(None),     # null state = pan-India
            )
        )

    result = await db.execute(stmt)
    schemes = result.scalars().all()
    logger.info(f"[Search] {len(schemes)} active schemes for state={profile.state}")

    if not schemes:
        return SearchResponse(
            total=0, eligible_count=0, almost_count=0,
            profile_tags=list(profile_tags), schemes=[]
        )

    # 3. Run eligibility engine
    ranked = await rank_schemes(user_profile, schemes, top_n=profile.top_n)

    # 4. Filter by status
    if not profile.include_almost:
        ranked = [r for r in ranked if r.status == "eligible"]

    # 5. Build response
    eligible_count = sum(1 for r in ranked if r.status == "eligible")
    almost_count = sum(1 for r in ranked if r.status == "almost")

    scheme_results = [
        scheme_score_to_result(ss, profile.documents_uploaded)
        for ss in ranked
    ]

    return SearchResponse(
        total=len(scheme_results),
        eligible_count=eligible_count,
        almost_count=almost_count,
        profile_tags=sorted(profile_tags),
        schemes=scheme_results,
    )
