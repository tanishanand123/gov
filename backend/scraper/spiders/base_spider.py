"""
Base spider — shared rate-limiting, retry, robots.txt respect, user-agent rotation.
All spiders inherit from this.
"""
import asyncio
import hashlib
import logging
import random
from typing import Optional
from urllib.parse import urlparse, urljoin

import httpx
from bs4 import BeautifulSoup
from tenacity import retry, stop_after_attempt, wait_exponential

logger = logging.getLogger(__name__)

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/119.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
]

# Domains we are allowed to scrape (government only)
ALLOWED_DOMAINS = [
    ".gov.in", ".nic.in", "india.gov.in", "myscheme.gov.in",
    "scholarships.gov.in", "pmkisan.gov.in", "pmaymis.gov.in",
    "msme.gov.in", "startupindia.gov.in", "kviconline.gov.in",
    "nabard.org", "sidbi.in", "nsdc.in",
]


def is_allowed_domain(url: str) -> bool:
    parsed = urlparse(url)
    return any(parsed.netloc.endswith(d) for d in ALLOWED_DOMAINS)


def md5(text: str) -> str:
    return hashlib.md5(text.encode()).hexdigest()


class BaseSpider:
    name = "base"
    rps: float = 1.0          # requests per second (respect govt servers)
    concurrency: int = 4

    def __init__(self, rps: float = 1.0, concurrency: int = 4):
        self.rps = rps
        self.concurrency = concurrency
        self._semaphore = asyncio.Semaphore(concurrency)
        self._last_request: dict[str, float] = {}   # domain → last request time

    def _headers(self) -> dict:
        return {
            "User-Agent": random.choice(USER_AGENTS),
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-IN,en;q=0.9,hi;q=0.8",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
        }

    async def _rate_limit(self, url: str):
        domain = urlparse(url).netloc
        now = asyncio.get_event_loop().time()
        last = self._last_request.get(domain, 0)
        wait = (1.0 / self.rps) - (now - last)
        if wait > 0:
            await asyncio.sleep(wait + random.uniform(0, 0.3))
        self._last_request[domain] = asyncio.get_event_loop().time()

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
    async def get(self, url: str, params: dict = None, json_response: bool = False) -> Optional[str | dict]:
        """Fetch a URL respecting rate limits. Returns HTML string or parsed JSON."""
        async with self._semaphore:
            await self._rate_limit(url)
            try:
                async with httpx.AsyncClient(
                    timeout=30,
                    follow_redirects=True,
                    headers=self._headers(),
                    verify=False,   # many .gov.in have cert issues
                ) as client:
                    resp = await client.get(url, params=params)
                    resp.raise_for_status()
                    if json_response:
                        return resp.json()
                    return resp.text
            except httpx.HTTPStatusError as e:
                logger.warning(f"HTTP {e.response.status_code} for {url}")
                raise
            except Exception as e:
                logger.error(f"Fetch error for {url}: {e}")
                raise

    def parse_html(self, html: str, base_url: str = "") -> BeautifulSoup:
        soup = BeautifulSoup(html, "lxml")
        # Make all relative links absolute
        if base_url:
            for tag in soup.find_all(["a", "link"], href=True):
                tag["href"] = urljoin(base_url, tag["href"])
        return soup

    def clean_text(self, text: str) -> str:
        if not text:
            return ""
        import re
        text = re.sub(r"\s+", " ", text).strip()
        text = re.sub(r"\n{3,}", "\n\n", text)
        return text

    async def run(self) -> list[dict]:
        raise NotImplementedError
