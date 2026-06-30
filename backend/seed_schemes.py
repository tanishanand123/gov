"""
Seed script — fetches real scheme data from myscheme.gov.in via Playwright
(browser session interception, bypasses API auth), then inserts into PostgreSQL.

Usage:
  cd backend
  python seed_schemes.py           # seed up to 500 schemes
  python seed_schemes.py --max 100 # seed up to 100 schemes
"""
import asyncio
import json
import logging
import sys
import os
from urllib.parse import urlencode

# Add project root to sys.path
sys.path.insert(0, os.path.dirname(__file__))

logging.basicConfig(level=logging.INFO, format="%(levelname)s  %(message)s")
logger = logging.getLogger("seed")


def parse_item(item: dict) -> dict:
    """Convert a myscheme search result item into our normalized scheme dict."""
    fields = item.get("fields", item)

    slug = fields.get("slug", "")
    name = fields.get("schemeName", fields.get("scheme_name", fields.get("name", "")))
    summary = fields.get("briefDescription", fields.get("brief_description", ""))
    ministry = fields.get("nodalMinistryName", fields.get("ministry", ""))

    beneficiary_states = fields.get("beneficiaryState", None)
    if isinstance(beneficiary_states, list):
        state_val = None if "All" in beneficiary_states else (beneficiary_states[0] if beneficiary_states else None)
    elif isinstance(beneficiary_states, str):
        state_val = None if beneficiary_states.lower() in ("all", "any", "pan india") else beneficiary_states
    else:
        state_val = None

    level_str = fields.get("level", "Central").lower()
    if level_str not in ("central", "state", "district"):
        level_str = "central"

    tags = [t.lower() for t in fields.get("tags", [])]
    categories = [c.lower() for c in fields.get("schemeCategory", [])]

    # Build basic eligibility_raw from tags
    eligibility_raw = {"tags": tags, "categories": categories}

    # Infer gender from tags
    gender_hints = []
    for t in tags:
        if "women" in t or "woman" in t or "female" in t or "girl" in t:
            gender_hints.append("female")
    if gender_hints:
        eligibility_raw["gender"] = list(set(gender_hints))

    # Infer caste from tags
    caste_hints = []
    for t in tags:
        if t in ("sc", "st", "obc", "scheduled caste", "scheduled tribe"):
            caste_hints.append(t.replace(" ", ""))
    if caste_hints:
        eligibility_raw["caste"] = caste_hints

    if state_val:
        eligibility_raw["states"] = [state_val]

    return {
        "slug": slug,
        "name": name,
        "summary": summary,
        "description": "",
        "ministry": ministry,
        "department": fields.get("departmentName", ""),
        "state": state_val,
        "level": level_str,
        "source_url": f"https://www.myscheme.gov.in/schemes/{slug}" if slug else "",
        "application_url": "",
        "official_pdf_url": "",
        "eligibility_raw": eligibility_raw,
        "benefits_raw": {"type": tags},
        "benefit_summary": summary[:200] if summary else "",
        "documents_required": [],
        "application_process": "",
        "application_mode": "",
        "closing_date": fields.get("schemeCloseDate"),
        "helpline": "",
        "email": "",
        "faq": [],
        "source": "myscheme.gov.in",
        "extraction_confidence": 0.8,
    }


async def fetch_schemes_via_playwright(max_schemes: int = 500) -> list[dict]:
    """Use Playwright to intercept myscheme API responses and collect scheme data."""
    from playwright.async_api import async_playwright

    all_items = []
    done = asyncio.Event()

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-dev-shm-usage"],
        )
        ctx = await browser.new_context(
            user_agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"
        )
        page = await ctx.new_page()

        async def on_response(resp):
            if "v6/schemes" in resp.url and resp.status == 200:
                try:
                    body = await resp.json()
                    data_section = body.get("data", body)
                    hits = data_section.get("hits", {})

                    if isinstance(hits, dict):
                        items = hits.get("items", [])
                    elif isinstance(hits, list):
                        items = hits
                    else:
                        items = []

                    if items:
                        all_items.extend(items)
                        logger.info(f"Captured {len(items)} schemes (total so far: {len(all_items)})")
                except Exception as e:
                    logger.warning(f"Failed to parse response: {e}")

        page.on("response", on_response)

        # Load the main search page
        logger.info("Loading myscheme.gov.in/search ...")
        await page.goto("https://www.myscheme.gov.in/search", wait_until="networkidle", timeout=45000)
        await asyncio.sleep(3)

        if len(all_items) < max_schemes:
            # Scroll or paginate to load more
            for attempt in range(10):
                if len(all_items) >= max_schemes:
                    break
                try:
                    # Try to click "Load More" or next page button
                    load_more = page.locator("button:has-text('Load More'), button:has-text('Next'), [aria-label='Next page']")
                    count = await load_more.count()
                    if count > 0:
                        await load_more.first.click()
                        await asyncio.sleep(2)
                    else:
                        # Scroll to bottom to trigger lazy loading
                        await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                        await asyncio.sleep(2)
                except Exception:
                    break

        # If we have very few items, try to trigger API directly using captured cookies
        if len(all_items) < 10:
            logger.info("Trying direct API fetch with browser cookies...")
            try:
                cookies = await ctx.cookies()
                cookie_str = "; ".join(f"{c['name']}={c['value']}" for c in cookies)

                import httpx
                headers = {
                    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
                    "Referer": "https://www.myscheme.gov.in/",
                    "Cookie": cookie_str,
                }
                async with httpx.AsyncClient(timeout=30) as client:
                    for pg in range(10):
                        if len(all_items) >= max_schemes:
                            break
                        params = {
                            "lang": "en",
                            "size": 50,
                            "currentPage": pg,
                            "sort": "",
                        }
                        resp = await client.get(
                            "https://api.myscheme.gov.in/search/v6/schemes",
                            params=params,
                            headers=headers,
                        )
                        if resp.status_code == 200:
                            body = resp.json()
                            data_section = body.get("data", body)
                            hits = data_section.get("hits", {})
                            items = hits.get("items", hits) if isinstance(hits, dict) else hits
                            if items and isinstance(items, list):
                                all_items.extend(items)
                                logger.info(f"Direct API page {pg}: +{len(items)} (total {len(all_items)})")
                            else:
                                break
                        else:
                            logger.warning(f"Direct API page {pg}: HTTP {resp.status_code}")
                            break
            except Exception as e:
                logger.error(f"Direct API fetch failed: {e}")

        await browser.close()

    logger.info(f"Total schemes captured from site: {len(all_items)}")
    return all_items[:max_schemes]


async def seed_database(schemes_raw: list[dict]):
    """Parse and upsert schemes into the database."""
    from app.db.database import AsyncSessionLocal, init_db
    from scraper.pipelines.db_pipeline import SchemePipeline

    logger.info("Initializing database ...")
    await init_db()

    pipeline = SchemePipeline()
    parsed = [parse_item(item) for item in schemes_raw]
    parsed = [s for s in parsed if s["name"]]  # drop empty

    logger.info(f"Seeding {len(parsed)} schemes into database ...")
    async with AsyncSessionLocal() as db:
        stats = await pipeline.process_batch(db, parsed)

    logger.info(f"Done! Stats: {stats}")
    return stats


async def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--max", type=int, default=500, help="Max schemes to fetch")
    parser.add_argument("--skip-fetch", action="store_true", help="Use cached data if available")
    args = parser.parse_args()

    cache_file = "/tmp/myscheme_raw.json"

    if args.skip_fetch and os.path.exists(cache_file):
        logger.info(f"Using cached data from {cache_file}")
        with open(cache_file) as f:
            schemes_raw = json.load(f)
    else:
        schemes_raw = await fetch_schemes_via_playwright(args.max)
        if schemes_raw:
            with open(cache_file, "w") as f:
                json.dump(schemes_raw, f)
            logger.info(f"Saved {len(schemes_raw)} raw items to {cache_file}")

    if not schemes_raw:
        logger.error("No schemes fetched. Check Playwright / network connectivity.")
        sys.exit(1)

    stats = await seed_database(schemes_raw)
    print(f"\nSeeding complete: {stats}")


if __name__ == "__main__":
    asyncio.run(main())
