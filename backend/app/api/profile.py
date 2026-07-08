"""
GET  /v1/profile/{auth_id}  — fetch (or lazily create) a user's profile
PUT  /v1/profile/{auth_id}  — partial update of profile fields

Exposes a flat dict of display-ready fields so the frontend doesn't need to
know about the underlying SQLAlchemy column types.
"""
import re
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.models.user import UserProfile

router = APIRouter()

DOB_FORMAT = "%d %B %Y"


class ProfileUpdate(BaseModel):
    fields: dict[str, str]


def _parse_money(value: str) -> Optional[float]:
    digits = re.sub(r"[^\d.]", "", value or "")
    return float(digits) if digits else None


def _format_money(value: Optional[float]) -> str:
    if value is None:
        return ""
    n = int(value)
    s = str(n)
    if len(s) <= 3:
        return f"₹{s}"
    last3 = s[-3:]
    rest = s[:-3]
    rest = re.sub(r"(\d)(?=(\d{2})+(?!\d))", r"\1,", rest)
    return f"₹{rest},{last3}"


def _parse_dob(value: str) -> Optional[datetime]:
    try:
        return datetime.strptime(value.strip(), DOB_FORMAT)
    except (ValueError, AttributeError):
        return None


def _yes_no(value: Optional[bool]) -> str:
    return "Yes" if value else "No"


def _bool(value: str) -> bool:
    return value.strip().lower() in ("yes", "true", "enabled", "1")


def _enabled(value: Optional[bool]) -> str:
    return "Enabled" if value else "Disabled"


async def _get_or_create(db: AsyncSession, auth_id: str) -> UserProfile:
    result = await db.execute(select(UserProfile).where(UserProfile.auth_id == auth_id))
    profile = result.scalar_one_or_none()
    if profile:
        return profile
    profile = UserProfile(auth_id=auth_id)
    db.add(profile)
    await db.flush()
    return profile


def to_flat(p: UserProfile) -> dict:
    prefs = p.preferences or {}
    return {
        "name": p.name or "",
        "dob": p.dob.strftime(DOB_FORMAT) if p.dob else "",
        "gender": (p.gender or "").capitalize(),
        "category": (p.caste or "").upper(),
        "mobile": p.mobile or "",
        "email": p.email or "",
        "income": _format_money(p.annual_income),
        "occupation": p.occupation or "",
        "bpl": _yes_no(p.bpl_card),
        "bank": p.bank_details or (_yes_no(p.has_bank_account)),
        "disability": _yes_no(p.has_disability),
        "state": p.state or "",
        "district": p.district or "",
        "block": p.block or "",
        "pincode": p.pincode or "",
        "area": (p.area_type or "").capitalize(),
        "language": p.language_pref or "",
        "inapp": _enabled(prefs.get("inapp", True)),
        "sms": _enabled(prefs.get("sms", True)),
        "whatsapp": _enabled(prefs.get("whatsapp", False)),
    }


def apply_flat(p: UserProfile, fields: dict) -> None:
    if "name" in fields:
        p.name = fields["name"]
    if "dob" in fields:
        parsed = _parse_dob(fields["dob"])
        if parsed:
            p.dob = parsed
    if "gender" in fields:
        p.gender = fields["gender"].lower()
    if "category" in fields:
        p.caste = fields["category"].lower()
    if "mobile" in fields:
        p.mobile = fields["mobile"]
    if "email" in fields:
        p.email = fields["email"]
    if "income" in fields:
        p.annual_income = _parse_money(fields["income"])
    if "occupation" in fields:
        p.occupation = fields["occupation"]
    if "bpl" in fields:
        p.bpl_card = _bool(fields["bpl"])
    if "bank" in fields:
        p.bank_details = fields["bank"]
        p.has_bank_account = "yes" in fields["bank"].lower()
    if "disability" in fields:
        p.has_disability = _bool(fields["disability"])
    if "state" in fields:
        p.state = fields["state"]
    if "district" in fields:
        p.district = fields["district"]
    if "block" in fields:
        p.block = fields["block"]
    if "pincode" in fields:
        p.pincode = fields["pincode"]
    if "area" in fields:
        p.area_type = fields["area"].lower()
    if "language" in fields:
        p.language_pref = fields["language"]

    prefs = dict(p.preferences or {})
    for key in ("inapp", "sms", "whatsapp"):
        if key in fields:
            prefs[key] = _bool(fields[key])
    if prefs:
        p.preferences = prefs


@router.get("/profile/{auth_id}")
async def get_profile(auth_id: str, db: AsyncSession = Depends(get_db)):
    profile = await _get_or_create(db, auth_id)
    return to_flat(profile)


@router.put("/profile/{auth_id}")
async def update_profile(auth_id: str, payload: ProfileUpdate, db: AsyncSession = Depends(get_db)):
    profile = await _get_or_create(db, auth_id)
    apply_flat(profile, payload.fields)
    await db.flush()
    return to_flat(profile)
