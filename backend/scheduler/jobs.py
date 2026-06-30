"""
Scheduler — runs scraping jobs on a cron schedule.

Jobs:
  - daily_full_scrape()    : 2am every day — scrape all sources
  - hourly_link_check()    : every 6 hours — verify scheme URLs still work
  - weekly_pdf_refresh()   : Sunday 3am — re-download and re-OCR PDFs

Change detection:
  - After each scrape, compares source_hash of new content vs stored hash
  - If changed → re-extract → update DB → write to SchemeChangeLog
  - Notifications triggered via event system
"""
import asyncio
import hashlib
import logging
from datetime import datetime
from typing import Optional

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.db.database import AsyncSessionLocal
from app.models.scheme import Scheme, SchemeChangeLog, ScrapeJob, SchemeStatus
from scraper.spiders.myscheme_spider import MySchemeSpider
from scraper.spiders.state_portals import StatePortalSpider
from scraper.spiders.pdf_spider import PDFSpider
from scraper.spiders.dynamic_spider import DynamicSpider
from scraper.extractors.ai_extractor import AIExtractor
from scraper.pipelines.db_pipeline import SchemePipeline

logger = logging.getLogger(__name__)
settings = get_settings()


class ScraperOrchestrator:
    """Coordinates all spiders and pipelines in a single scrape run."""

    def __init__(self):
        self.extractor = AIExtractor()
        self.pipeline = SchemePipeline()
        self.myscheme_spider = MySchemeSpider(rps=settings.scraper_rps)
        self.state_spider = StatePortalSpider(rps=settings.scraper_rps)
        self.pdf_spider = PDFSpider(rps=settings.scraper_rps)

    async def run_myscheme(self, db: AsyncSession) -> dict:
        """Scrape MyScheme.gov.in — most reliable source (structured API)."""
        job = ScrapeJob(spider_name="myscheme", status="running", started_at=datetime.utcnow())
        db.add(job)
        await db.commit()

        try:
            logger.info("[Scheduler] Starting MyScheme scrape...")
            raw_schemes = await self.myscheme_spider.run()
            stats = await self.pipeline.process_batch(db, raw_schemes)
            job.status = "done"
            job.schemes_found = stats["found"]
            job.schemes_new = stats["new"]
            job.schemes_updated = stats["updated"]
            job.finished_at = datetime.utcnow()
            await db.commit()
            logger.info(f"[Scheduler] MyScheme done: {stats}")
            return stats
        except Exception as e:
            logger.error(f"[Scheduler] MyScheme failed: {e}")
            job.status = "failed"
            job.errors = [str(e)]
            job.finished_at = datetime.utcnow()
            await db.commit()
            return {}

    async def run_state_portals(self, db: AsyncSession, states: list[str] = None) -> dict:
        """Scrape state government portals."""
        job = ScrapeJob(spider_name="state_portals", status="running", started_at=datetime.utcnow())
        db.add(job)
        await db.commit()

        try:
            logger.info(f"[Scheduler] Starting state portal scrape for: {states or 'all'}")
            raw_results = await self.state_spider.run(states=states)

            # AI extraction needed for HTML results
            extracted = []
            for raw in raw_results:
                if raw.get("needs_ai_extraction"):
                    result = await self.extractor.extract_scheme(raw)
                    if result and result.get("name"):
                        extracted.append(result)
                else:
                    extracted.append(raw)

            stats = await self.pipeline.process_batch(db, extracted)
            job.status = "done"
            job.schemes_found = stats["found"]
            job.schemes_new = stats["new"]
            job.schemes_updated = stats["updated"]
            job.finished_at = datetime.utcnow()
            await db.commit()
            logger.info(f"[Scheduler] State portals done: {stats}")
            return stats
        except Exception as e:
            logger.error(f"[Scheduler] State portals failed: {e}")
            job.status = "failed"
            job.errors = [str(e)]
            job.finished_at = datetime.utcnow()
            await db.commit()
            return {}

    async def run_pdf_refresh(self, db: AsyncSession) -> dict:
        """Download and re-process government scheme PDFs."""
        try:
            logger.info("[Scheduler] Starting PDF refresh...")
            raw_pdfs = await self.pdf_spider.run()
            extracted = []
            for pdf in raw_pdfs:
                result = await self.extractor.extract_scheme(pdf)
                if result and result.get("name"):
                    extracted.append(result)
            stats = await self.pipeline.process_batch(db, extracted)
            logger.info(f"[Scheduler] PDF refresh done: {stats}")
            return stats
        except Exception as e:
            logger.error(f"[Scheduler] PDF refresh failed: {e}")
            return {}

    async def check_scheme_links(self, db: AsyncSession):
        """Verify all scheme URLs are still live. Mark broken ones."""
        import httpx
        result = await db.execute(
            select(Scheme).where(
                Scheme.status == SchemeStatus.ACTIVE,
                Scheme.source_url.isnot(None),
            ).limit(200)
        )
        schemes = result.scalars().all()
        broken = []

        async with httpx.AsyncClient(timeout=10, follow_redirects=True, verify=False) as client:
            for scheme in schemes:
                try:
                    resp = await client.head(scheme.source_url)
                    if resp.status_code >= 400:
                        broken.append(scheme.id)
                        logger.warning(f"[LinkCheck] Broken link for {scheme.name}: {scheme.source_url}")
                except Exception:
                    broken.append(scheme.id)

        if broken:
            await db.execute(
                update(Scheme)
                .where(Scheme.id.in_(broken))
                .values(needs_human_review=True)
            )
            await db.commit()
            logger.info(f"[LinkCheck] {len(broken)} broken links flagged for review")


# ── Scheduled job functions ───────────────────────────────────────────────────

orchestrator: Optional[ScraperOrchestrator] = None


async def daily_full_scrape():
    global orchestrator
    if not orchestrator:
        orchestrator = ScraperOrchestrator()

    async with AsyncSessionLocal() as db:
        logger.info("[Scheduler] === Daily full scrape starting ===")
        await orchestrator.run_myscheme(db)
        # Scrape 3 random states each day (rotate through all states over time)
        import random
        from scraper.spiders.state_portals import get_all_states
        states = random.sample(get_all_states(), min(3, len(get_all_states())))
        await orchestrator.run_state_portals(db, states=states)
        logger.info("[Scheduler] === Daily full scrape complete ===")


async def link_health_check():
    global orchestrator
    if not orchestrator:
        orchestrator = ScraperOrchestrator()
    async with AsyncSessionLocal() as db:
        await orchestrator.check_scheme_links(db)


async def weekly_pdf_refresh():
    global orchestrator
    if not orchestrator:
        orchestrator = ScraperOrchestrator()
    async with AsyncSessionLocal() as db:
        await orchestrator.run_pdf_refresh(db)


# ── Scheduler setup ───────────────────────────────────────────────────────────

def create_scheduler() -> AsyncIOScheduler:
    scheduler = AsyncIOScheduler(timezone="Asia/Kolkata")

    # Daily full scrape at 2:00 AM IST
    scheduler.add_job(
        daily_full_scrape,
        trigger=CronTrigger(hour=settings.daily_scrape_hour, minute=settings.daily_scrape_minute),
        id="daily_scrape",
        name="Daily Full Scrape",
        replace_existing=True,
    )

    # Link health check every 6 hours
    scheduler.add_job(
        link_health_check,
        trigger=CronTrigger(hour="*/6"),
        id="link_check",
        name="Scheme Link Health Check",
        replace_existing=True,
    )

    # Weekly PDF refresh — Sunday 3:00 AM
    scheduler.add_job(
        weekly_pdf_refresh,
        trigger=CronTrigger(day_of_week="sun", hour=3),
        id="pdf_refresh",
        name="Weekly PDF Refresh",
        replace_existing=True,
    )

    return scheduler


async def run_once(job: str = "myscheme"):
    """CLI helper — run a single scrape job immediately."""
    orch = ScraperOrchestrator()
    async with AsyncSessionLocal() as db:
        if job == "myscheme":
            await orch.run_myscheme(db)
        elif job == "states":
            await orch.run_state_portals(db)
        elif job == "pdfs":
            await orch.run_pdf_refresh(db)
        elif job == "links":
            await orch.check_scheme_links(db)
        else:
            logger.error(f"Unknown job: {job}")


if __name__ == "__main__":
    import sys
    job_name = sys.argv[1] if len(sys.argv) > 1 else "myscheme"
    asyncio.run(run_once(job_name))
