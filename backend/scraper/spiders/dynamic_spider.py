"""
Dynamic spider using Playwright for JS-rendered government portals.

Used for:
- scholarships.gov.in (NSP)
- pmkisan.gov.in
- pmaymis.gov.in
- startupindia.gov.in
- Any portal that loads data via XHR after page render
"""
import asyncio
import logging
from typing import Optional
from .base_spider import BaseSpider, md5

logger = logging.getLogger(__name__)

# Portals that intercept XHR calls — we capture the API responses directly
XHR_INTERCEPT_PORTALS = {
    "scholarships.gov.in": {
        "url": "https://scholarships.gov.in/public/schemeGovt/getSchemeList.action",
        "method": "POST",
        "payload": {"schemeType": "C"},   # C = Central, S = State
    },
    "startupindia.gov.in": {
        "url": "https://api.startupindia.gov.in/sai/api/noauth/search/scheme/list",
        "method": "GET",
        "params": {"page": 0, "size": 100},
    },
}

# Static government pages that need a headless browser (heavy JS)
STATIC_JS_PAGES = [
    "https://www.pmkisan.gov.in",
    "https://pmaymis.gov.in",
    "https://www.kviconline.gov.in/pmegpeportal/jsp/pmegpe.jsp",
]


class DynamicSpider(BaseSpider):
    name = "dynamic"

    async def _launch_browser(self):
        from playwright.async_api import async_playwright
        self._pw = await async_playwright().start()
        self._browser = await self._pw.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
        )
        return self._browser

    async def _close_browser(self):
        if hasattr(self, "_browser"):
            await self._browser.close()
        if hasattr(self, "_pw"):
            await self._pw.stop()

    async def scrape_with_xhr_intercept(self, portal_key: str) -> list[dict]:
        """
        Load a portal page and intercept the XHR calls it makes to get scheme data.
        Returns raw JSON responses.
        """
        portal = XHR_INTERCEPT_PORTALS.get(portal_key)
        if not portal:
            return []

        captured = []
        browser = await self._launch_browser()
        try:
            ctx = await browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                ignore_https_errors=True,
            )
            page = await ctx.new_page()

            # Intercept all XHR/fetch requests
            async def handle_response(response):
                if portal["url"] in response.url:
                    try:
                        data = await response.json()
                        captured.append(data)
                        logger.info(f"[Dynamic] Intercepted XHR from {portal_key}: {len(str(data))} bytes")
                    except Exception:
                        pass

            page.on("response", handle_response)

            await page.goto(f"https://{portal_key}", wait_until="networkidle", timeout=30000)
            await asyncio.sleep(3)   # wait for XHR calls to complete

            await ctx.close()
        finally:
            await self._close_browser()

        return captured

    async def scrape_nsp_scholarships(self) -> list[dict]:
        """
        National Scholarship Portal — scholarships.gov.in
        Returns list of scholarship schemes with eligibility + docs.
        """
        schemes = []
        browser = await self._launch_browser()
        try:
            ctx = await browser.new_context(ignore_https_errors=True)
            page = await ctx.new_page()

            await page.goto("https://scholarships.gov.in", wait_until="domcontentloaded", timeout=30000)
            await page.wait_for_selector(".scheme-list, .schemeBox, table", timeout=15000)

            # Get all scheme links
            links = await page.eval_on_selector_all(
                "a[href*='scheme'], a[href*='scholarship']",
                "els => els.map(e => ({href: e.href, text: e.innerText.trim()}))"
            )

            for link in links[:50]:   # cap at 50 to be respectful
                if not link["text"] or len(link["text"]) < 5:
                    continue
                try:
                    detail_page = await ctx.new_page()
                    await detail_page.goto(link["href"], wait_until="domcontentloaded", timeout=20000)
                    await asyncio.sleep(1)

                    content = await detail_page.content()
                    await detail_page.close()

                    schemes.append({
                        "name": link["text"],
                        "source_url": link["href"],
                        "raw_html": content,
                        "source": "scholarships.gov.in",
                        "level": "central",
                    })
                except Exception as e:
                    logger.warning(f"[NSP] Failed to fetch {link['href']}: {e}")

            await ctx.close()
        finally:
            await self._close_browser()

        return schemes

    async def scrape_startup_india(self) -> list[dict]:
        """
        Startup India portal — https://startupindia.gov.in/content/sih/en/government-schemes.html
        """
        schemes = []
        try:
            # Try the API first
            data = await self.get(
                "https://api.startupindia.gov.in/sai/api/noauth/search/scheme/list",
                params={"page": 0, "size": 100, "vertical": ""},
                json_response=True,
            )
            if data and data.get("data"):
                for item in data["data"].get("content", []):
                    schemes.append({
                        "name": item.get("schemeName", ""),
                        "summary": item.get("schemeObjective", ""),
                        "ministry": item.get("ministry", ""),
                        "source_url": item.get("schemeUrl", ""),
                        "eligibility_raw": {
                            "tags": ["startup", "business"],
                            "occupation": ["entrepreneur", "startup"],
                        },
                        "benefits_raw": {
                            "description": item.get("schemeBenefit", ""),
                        },
                        "source": "startupindia.gov.in",
                        "level": "central",
                        "extraction_confidence": 0.9,
                    })
        except Exception as e:
            logger.error(f"[StartupIndia] API failed: {e}")

        return schemes

    async def scrape_state_portal(self, state: str, url: str) -> list[dict]:
        """
        Generic state portal scraper — fetches scheme list and scheme detail pages.
        Playwright renders JS, then we extract with BeautifulSoup.
        """
        schemes = []
        browser = await self._launch_browser()
        try:
            ctx = await browser.new_context(ignore_https_errors=True)
            page = await ctx.new_page()

            logger.info(f"[State:{state}] Loading {url}")
            await page.goto(url, wait_until="networkidle", timeout=30000)
            await asyncio.sleep(2)

            # Try to find scheme cards / list items / table rows
            content = await page.content()
            await ctx.close()

            # Return raw HTML — AI extractor will parse it
            schemes.append({
                "source": url,
                "state": state,
                "raw_html": content,
                "needs_ai_extraction": True,
            })
        except Exception as e:
            logger.error(f"[State:{state}] Failed: {e}")
        finally:
            await self._close_browser()

        return schemes

    async def run(self) -> list[dict]:
        results = []
        results.extend(await self.scrape_startup_india())
        return results
