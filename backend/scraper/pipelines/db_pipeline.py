"""
DB Pipeline — takes normalized scheme dicts and upserts them into PostgreSQL.

Change detection:
  - Computes MD5 hash of key fields
  - If hash differs from stored → update + write SchemeChangeLog entry
  - If new → insert fresh
"""
import hashlib
import json
import logging
from datetime import datetime
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from slugify import slugify

from app.models.scheme import Scheme, SchemeChangeLog, SchemeStatus, SchemeLevel

logger = logging.getLogger(__name__)


def make_slug(name: str, state: Optional[str] = None) -> str:
    """Generate a unique slug from scheme name + optional state."""
    base = slugify(name, max_length=200, word_boundary=True)
    if state:
        base = f"{base}-{slugify(state)}"
    return base


def content_hash(data: dict) -> str:
    """MD5 of key fields — used to detect content changes between scrapes."""
    key_fields = {
        "name": data.get("name", ""),
        "eligibility_raw": data.get("eligibility_raw", {}),
        "benefits_raw": data.get("benefits_raw", {}),
        "documents_required": data.get("documents_required", []),
        "closing_date": str(data.get("closing_date", "")),
    }
    return hashlib.md5(json.dumps(key_fields, sort_keys=True, default=str).encode()).hexdigest()


WATCHED_FIELDS = [
    "eligibility_raw", "benefits_raw", "documents_required",
    "closing_date", "application_url", "status",
]


class SchemePipeline:

    async def upsert_scheme(self, db: AsyncSession, data: dict) -> tuple[Scheme, bool]:
        """
        Insert or update a scheme.
        Returns (scheme, is_new).
        Writes SchemeChangeLog entries for changed fields.
        """
        if not data.get("name"):
            return None, False

        # Generate slug
        slug = data.get("slug") or make_slug(data["name"], data.get("state"))

        # Check if exists
        result = await db.execute(select(Scheme).where(Scheme.slug == slug))
        existing = result.scalar_one_or_none()

        new_hash = content_hash(data)
        now = datetime.utcnow()

        if existing:
            # Check if content changed
            if existing.source_hash == new_hash:
                return existing, False  # no change

            # Detect and log field-level changes
            for field in WATCHED_FIELDS:
                old_val = getattr(existing, field, None)
                new_val = data.get(field)
                if old_val != new_val and new_val is not None:
                    log = SchemeChangeLog(
                        scheme_id=existing.id,
                        field_changed=field,
                        old_value=json.dumps(old_val, default=str),
                        new_value=json.dumps(new_val, default=str),
                    )
                    db.add(log)

            # Update fields
            for field, value in data.items():
                if hasattr(existing, field) and value is not None and field != "id":
                    setattr(existing, field, value)

            existing.source_hash = new_hash
            existing.scraped_at = now
            existing.updated_at = now
            logger.info(f"[Pipeline] Updated: {existing.name}")
            return existing, False

        else:
            # New scheme
            level_str = data.get("level", "central")
            try:
                level = SchemeLevel(level_str)
            except ValueError:
                level = SchemeLevel.CENTRAL

            scheme = Scheme(
                slug=slug,
                name=data["name"],
                summary=data.get("summary"),
                description=data.get("description"),
                ministry=data.get("ministry"),
                department=data.get("department"),
                state=data.get("state"),
                level=level,
                status=SchemeStatus.ACTIVE,
                source_url=data.get("source_url"),
                application_url=data.get("application_url"),
                official_pdf_url=data.get("official_pdf_url"),
                eligibility_raw=data.get("eligibility_raw", {}),
                eligibility_summary=data.get("eligibility_summary"),
                benefits_raw=data.get("benefits_raw", {}),
                benefit_summary=data.get("benefit_summary"),
                documents_required=data.get("documents_required", []),
                application_process=data.get("application_process"),
                application_mode=data.get("application_mode"),
                helpline=data.get("helpline"),
                email=data.get("email"),
                faq=data.get("faq", []),
                who_should_apply=data.get("who_should_apply"),
                common_rejection_reasons=data.get("common_rejection_reasons", []),
                important_notes=data.get("important_notes"),
                extraction_confidence=data.get("extraction_confidence", 0.7),
                needs_human_review=data.get("needs_human_review", False),
                source_hash=new_hash,
                scraped_at=now,
            )

            # Parse dates if strings
            for date_field in ["closing_date", "opening_date", "renewal_date"]:
                val = data.get(date_field)
                if val and isinstance(val, str):
                    try:
                        import dateparser
                        parsed = dateparser.parse(val)
                        setattr(scheme, date_field, parsed)
                    except Exception:
                        pass
                elif val:
                    setattr(scheme, date_field, val)

            db.add(scheme)
            logger.info(f"[Pipeline] New scheme: {scheme.name}")
            return scheme, True

    async def process_batch(self, db: AsyncSession, schemes: list[dict]) -> dict:
        """Process a batch of scraped scheme dicts."""
        stats = {"found": len(schemes), "new": 0, "updated": 0, "skipped": 0, "errors": 0}

        for data in schemes:
            try:
                scheme, is_new = await self.upsert_scheme(db, data)
                if scheme is None:
                    stats["skipped"] += 1
                elif is_new:
                    stats["new"] += 1
                else:
                    stats["updated"] += 1
            except Exception as e:
                logger.error(f"[Pipeline] Error processing {data.get('name', '?')}: {e}")
                stats["errors"] += 1

        try:
            await db.commit()
        except Exception as e:
            await db.rollback()
            logger.error(f"[Pipeline] Commit failed: {e}")

        return stats
