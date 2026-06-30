"""
State portal registry and per-state scrapers.

Every Indian state has portals for:
  - Agriculture / Horticulture
  - Women & Child Welfare
  - SC/ST/OBC Welfare
  - Education & Scholarships
  - MSME / Industries
  - Rural Development
  - Social Security / Pension
"""
import logging
from .base_spider import BaseSpider

logger = logging.getLogger(__name__)

# State → list of (department_name, url, scrape_method)
# scrape_method: "html" | "playwright" | "api"
STATE_PORTALS: dict[str, list[dict]] = {
    "Karnataka": [
        {"dept": "SC/ST Welfare", "url": "https://sw.kar.nic.in", "method": "html"},
        {"dept": "Agriculture", "url": "https://raitamitra.kar.nic.in/ENG/index.asp", "method": "html"},
        {"dept": "Women Welfare", "url": "https://dwcd.karnataka.gov.in", "method": "html"},
        {"dept": "MSME", "url": "https://msme.karnataka.gov.in", "method": "html"},
        {"dept": "Skill Development", "url": "https://kaushalkar.com", "method": "playwright"},
    ],
    "Maharashtra": [
        {"dept": "SC/OBC Welfare", "url": "https://sjsa.maharashtra.gov.in", "method": "html"},
        {"dept": "Agriculture", "url": "https://mahadbt.maharashtra.gov.in", "method": "playwright"},
        {"dept": "Women Welfare", "url": "https://womenchild.maharashtra.gov.in", "method": "html"},
        {"dept": "MSME", "url": "https://udyog.maharashtra.gov.in", "method": "html"},
    ],
    "Uttar Pradesh": [
        {"dept": "Social Welfare", "url": "https://sspy-up.gov.in", "method": "html"},
        {"dept": "SC/ST Welfare", "url": "https://upscholarship.up.gov.in", "method": "playwright"},
        {"dept": "Agriculture", "url": "https://upagriculture.com", "method": "html"},
        {"dept": "Women Welfare", "url": "https://mahilakalyan.up.nic.in", "method": "html"},
        {"dept": "MSME", "url": "https://diupmsme.upsdc.gov.in", "method": "html"},
    ],
    "Tamil Nadu": [
        {"dept": "Social Welfare", "url": "https://www.tn.gov.in/scheme/index", "method": "html"},
        {"dept": "BC/MBC Welfare", "url": "https://www.bcmbcmw.tn.gov.in", "method": "html"},
        {"dept": "Agriculture", "url": "https://www.tnau.ac.in/portal", "method": "html"},
        {"dept": "Women Welfare", "url": "https://www.tncdw.gov.in", "method": "html"},
    ],
    "Rajasthan": [
        {"dept": "Social Justice", "url": "https://sje.rajasthan.gov.in", "method": "html"},
        {"dept": "Agriculture", "url": "https://rajkisan.rajasthan.gov.in", "method": "playwright"},
        {"dept": "Women Welfare", "url": "https://wcd.rajasthan.gov.in", "method": "html"},
    ],
    "Gujarat": [
        {"dept": "Social Welfare", "url": "https://sje.gujarat.gov.in", "method": "html"},
        {"dept": "Agriculture", "url": "https://agri.gujarat.gov.in", "method": "html"},
        {"dept": "MSME", "url": "https://ic.gujarat.gov.in", "method": "html"},
    ],
    "Madhya Pradesh": [
        {"dept": "Social Justice", "url": "https://socialjustice.mp.gov.in", "method": "html"},
        {"dept": "Farmer Welfare", "url": "https://mpfsts.mp.gov.in", "method": "playwright"},
        {"dept": "Women Welfare", "url": "https://mpwcd.nic.in", "method": "html"},
    ],
    "Bihar": [
        {"dept": "Social Welfare", "url": "https://socialwelfare.bih.nic.in", "method": "html"},
        {"dept": "SC/ST Welfare", "url": "https://state.bihar.gov.in/bcebcwelfare", "method": "html"},
        {"dept": "Agriculture", "url": "https://dbtagriculture.bihar.gov.in", "method": "playwright"},
    ],
    "West Bengal": [
        {"dept": "Social Welfare", "url": "https://wbsed.gov.in", "method": "html"},
        {"dept": "BC Welfare", "url": "https://wbbcdev.gov.in", "method": "html"},
        {"dept": "Agriculture", "url": "https://wb.gov.in/portal/web/guest/agriculture", "method": "html"},
    ],
    "Andhra Pradesh": [
        {"dept": "Social Welfare", "url": "https://www.apsche.ap.gov.in", "method": "html"},
        {"dept": "Agriculture", "url": "https://www.apagrisnet.gov.in", "method": "html"},
        {"dept": "Women Welfare", "url": "https://www.wdcw.ap.nic.in", "method": "html"},
    ],
    "Telangana": [
        {"dept": "Social Welfare", "url": "https://telanganasocialwelfare.gov.in", "method": "html"},
        {"dept": "Agriculture", "url": "https://rythubandhu.telangana.gov.in", "method": "playwright"},
        {"dept": "SC Welfare", "url": "https://scbcdc.telangana.gov.in", "method": "html"},
    ],
    "Kerala": [
        {"dept": "Social Justice", "url": "https://swd.kerala.gov.in", "method": "html"},
        {"dept": "SC/ST Welfare", "url": "https://scstdd.kerala.gov.in", "method": "html"},
        {"dept": "Agriculture", "url": "https://keralaagriculture.gov.in", "method": "html"},
    ],
    "Punjab": [
        {"dept": "Social Security", "url": "https://sswepb.gov.in", "method": "html"},
        {"dept": "Agriculture", "url": "https://agripb.gov.in", "method": "html"},
        {"dept": "SC Welfare", "url": "https://punjab.gov.in/sc-welfare", "method": "html"},
    ],
    "Haryana": [
        {"dept": "Social Justice", "url": "https://socialjusticehry.gov.in", "method": "html"},
        {"dept": "Agriculture", "url": "https://agriharyana.gov.in", "method": "html"},
    ],
    "Odisha": [
        {"dept": "ST/SC Welfare", "url": "https://stscdev.odisha.gov.in", "method": "html"},
        {"dept": "Agriculture", "url": "https://agriodisha.nic.in", "method": "html"},
        {"dept": "Women Welfare", "url": "https://wcd.odisha.gov.in", "method": "html"},
    ],
}


def get_portals_for_state(state: str) -> list[dict]:
    """Return list of portal configs for a given state."""
    return STATE_PORTALS.get(state, [])


def get_all_states() -> list[str]:
    return list(STATE_PORTALS.keys())


class StatePortalSpider(BaseSpider):
    name = "state_portals"

    async def scrape_html_portal(self, state: str, dept: str, url: str) -> list[dict]:
        """
        Generic HTML scraper for state portals.
        Extracts scheme links → fetches each → returns raw HTML for AI extraction.
        """
        raw_results = []
        try:
            html = await self.get(url)
            if not html:
                return []

            soup = self.parse_html(html, base_url=url)

            # Common selectors for scheme links on govt portals
            scheme_links = set()
            for selector in [
                "a[href*='scheme']", "a[href*='yojana']", "a[href*='scheme']",
                "a[href*='welfare']", "a[href*='program']", ".scheme-link",
                "table a", ".scheme-list a", ".card a",
            ]:
                for a in soup.select(selector):
                    href = a.get("href", "")
                    text = self.clean_text(a.get_text())
                    if href and len(text) > 5 and len(text) < 300:
                        scheme_links.add((href, text))

            logger.info(f"[State:{state}/{dept}] Found {len(scheme_links)} scheme links at {url}")

            for href, name in list(scheme_links)[:30]:  # cap at 30 per portal
                try:
                    detail_html = await self.get(href)
                    if detail_html:
                        raw_results.append({
                            "name": name,
                            "source_url": href,
                            "raw_html": detail_html,
                            "state": state,
                            "department": dept,
                            "level": "state",
                            "needs_ai_extraction": True,
                            "source": url,
                        })
                except Exception as e:
                    logger.warning(f"[State:{state}] Skipping {href}: {e}")

        except Exception as e:
            logger.error(f"[State:{state}/{dept}] Portal scrape failed: {e}")

        return raw_results

    async def run(self, states: list[str] = None) -> list[dict]:
        """Scrape all portals for requested states."""
        target_states = states or get_all_states()
        all_results = []

        for state in target_states:
            portals = get_portals_for_state(state)
            for portal in portals:
                if portal["method"] == "html":
                    results = await self.scrape_html_portal(
                        state, portal["dept"], portal["url"]
                    )
                    all_results.extend(results)
                elif portal["method"] == "playwright":
                    # Dynamic spider handles playwright
                    from .dynamic_spider import DynamicSpider
                    ds = DynamicSpider(rps=self.rps)
                    results = await ds.scrape_state_portal(state, portal["url"])
                    for r in results:
                        r["department"] = portal["dept"]
                        r["state"] = state
                    all_results.extend(results)

        logger.info(f"[StatePortals] Total raw results: {len(all_results)}")
        return all_results
