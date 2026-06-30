"""
MyScheme.gov.in spider.

MyScheme is the Government of India's official scheme aggregator (700+ schemes).
It exposes an internal search API that returns structured JSON — no HTML scraping needed.

API endpoints (reverse-engineered from the portal's network calls):
  Search: GET https://api.myscheme.gov.in/search/v4/schemes
  Detail: GET https://api.myscheme.gov.in/search/v4/schemes/{slug}
"""
import logging
from typing import Optional
from .base_spider import BaseSpider

logger = logging.getLogger(__name__)

MYSCHEME_SEARCH_URL = "https://api.myscheme.gov.in/search/v6/schemes"
MYSCHEME_DETAIL_URL = "https://api.myscheme.gov.in/search/v6/scheme"

# Profile tag → MyScheme filter mapping
TAG_TO_FILTER = {
    "farmer":           {"occupation": "farmer"},
    "student":          {"target_beneficiary": "students"},
    "woman":            {"gender": "female"},
    "sc":               {"category": "sc"},
    "st":               {"category": "st"},
    "obc":              {"category": "obc"},
    "msme":             {"target_beneficiary": "msme"},
    "startup":          {"target_beneficiary": "startups"},
    "disability":       {"target_beneficiary": "persons-with-disabilities"},
    "minority":         {"target_beneficiary": "minorities"},
    "ex-serviceman":    {"target_beneficiary": "ex-servicemen"},
}


class MySchemeSpider(BaseSpider):
    name = "myscheme"

    def _parse_scheme_search_item(self, item: dict) -> dict:
        """Normalize a search result item (with 'fields' wrapper) into our standard scheme dict."""
        fields = item.get("fields", item)  # API wraps fields in 'fields' key
        return self._parse_scheme(fields)

    def _parse_scheme(self, raw: dict) -> dict:
        """Normalize a MyScheme API response into our standard scheme dict."""

        # Eligibility block
        eligibility_raw = {}
        elig = raw.get("eligibility", {})

        age_range = elig.get("age_range", {})
        if age_range:
            eligibility_raw["age"] = {
                "min": age_range.get("min"),
                "max": age_range.get("max"),
            }

        if elig.get("gender"):
            eligibility_raw["gender"] = [g.lower() for g in elig["gender"]]

        if elig.get("caste"):
            eligibility_raw["caste"] = [c.lower() for c in elig["caste"]]

        if elig.get("income_max"):
            eligibility_raw["income_max"] = elig["income_max"]

        if elig.get("occupation"):
            eligibility_raw["occupation"] = [o.lower() for o in elig["occupation"]]

        if elig.get("state"):
            states = elig["state"]
            if isinstance(states, list):
                eligibility_raw["states"] = states
            elif isinstance(states, str) and states.lower() not in ("all", "any", "pan india"):
                eligibility_raw["states"] = [states]

        if elig.get("residence"):
            eligibility_raw["area_type"] = elig["residence"].lower()   # urban/rural

        if elig.get("education"):
            eligibility_raw["education"] = [e.lower() for e in elig["education"]]

        # Tags for fast matching (union of all eligibility dimensions)
        tags = []
        for g in eligibility_raw.get("gender", []):
            tags.append(g)
        for c in eligibility_raw.get("caste", []):
            tags.append(c)
        for o in eligibility_raw.get("occupation", []):
            tags.append(o)
        income_max = eligibility_raw.get("income_max")
        if income_max:
            if income_max <= 100000:
                tags.append("below-poverty")
            elif income_max <= 200000:
                tags.append("low-income")
            elif income_max <= 500000:
                tags.append("middle-income")
        for target in raw.get("target_beneficiaries", []):
            tags.append(target.lower().replace(" ", "-"))

        eligibility_raw["tags"] = list(set(tags))

        # Benefits block
        benefits_raw = {}
        benefits = raw.get("benefits", {})
        benefit_types = []
        for bt in raw.get("benefit_types", []):
            benefit_types.append(bt.lower())
        benefits_raw["type"] = benefit_types
        if benefits.get("loan_amount"):
            benefits_raw["loan_amount"] = benefits["loan_amount"]
        if benefits.get("subsidy_percent"):
            benefits_raw["subsidy_percent"] = benefits["subsidy_percent"]
        if benefits.get("grant_amount"):
            benefits_raw["grant_amount"] = benefits["grant_amount"]
        if benefits.get("interest_rate"):
            benefits_raw["interest_rate"] = benefits["interest_rate"]
        if benefits.get("scholarship_amount"):
            benefits_raw["scholarship_amount"] = benefits["scholarship_amount"]
        if benefits.get("description"):
            benefits_raw["description"] = benefits["description"]

        # Documents
        docs = []
        for doc in raw.get("documents_required", []):
            doc_name = doc.get("document_name", doc) if isinstance(doc, dict) else doc
            docs.append(self._normalize_doc_name(str(doc_name)))

        # Handle both camelCase (search API) and snake_case (detail API) field names
        slug = raw.get("slug", "")
        name = raw.get("schemeName", raw.get("scheme_name", raw.get("name", "")))
        summary = raw.get("briefDescription", raw.get("brief_description", raw.get("summary", "")))
        ministry = raw.get("nodalMinistryName", raw.get("ministry_name", raw.get("ministry", "")))
        department = raw.get("departmentName", raw.get("department_name", raw.get("department", "")))

        # State: "All" means pan-India (state=None)
        beneficiary_states = raw.get("beneficiaryState", raw.get("state", None))
        if isinstance(beneficiary_states, list):
            state_val = None if "All" in beneficiary_states else ", ".join(beneficiary_states)
        elif isinstance(beneficiary_states, str):
            state_val = None if beneficiary_states.lower() in ("all", "any", "pan india") else beneficiary_states
        else:
            state_val = None

        level_str = raw.get("level", "Central").lower()

        # Enrich eligibility_raw with search-result tags if present
        if raw.get("tags"):
            eligibility_raw["search_tags"] = [t.lower() for t in raw["tags"]]

        return {
            "slug": slug,
            "name": name,
            "summary": summary,
            "description": raw.get("description", ""),
            "ministry": ministry,
            "department": department,
            "state": state_val,
            "level": level_str if level_str in ("central", "state", "district") else "central",
            "source_url": f"https://www.myscheme.gov.in/schemes/{slug}" if slug else "",
            "application_url": raw.get("applicationUrl", raw.get("application_url", raw.get("apply_online_link", ""))),
            "official_pdf_url": raw.get("guidelines_pdf", ""),
            "eligibility_raw": eligibility_raw,
            "benefits_raw": benefits_raw,
            "benefit_summary": benefits_raw.get("description", ""),
            "documents_required": docs,
            "application_process": raw.get("application_process", ""),
            "application_mode": raw.get("applicationMode", raw.get("application_mode", "")),
            "closing_date": raw.get("schemeCloseDate", raw.get("last_date", raw.get("closing_date"))),
            "helpline": raw.get("helpline_number", ""),
            "email": raw.get("helpline_email", ""),
            "faq": raw.get("faqs", []),
            "source": "myscheme.gov.in",
            "extraction_confidence": 0.95,
        }

    def _normalize_doc_name(self, name: str) -> str:
        """Convert free-text doc name to a standard slug."""
        name = name.lower().strip()
        mapping = {
            "aadhaar": "aadhaar", "aadhar": "aadhaar", "uid": "aadhaar",
            "pan": "pan", "pan card": "pan",
            "income certificate": "income_certificate",
            "income proof": "income_certificate",
            "caste certificate": "caste_certificate",
            "bank passbook": "bank_passbook",
            "bank account": "bank_passbook",
            "photo": "photo", "photograph": "photo",
            "birth certificate": "birth_certificate",
            "domicile": "domicile_certificate",
            "residence proof": "domicile_certificate",
            "disability certificate": "disability_certificate",
            "land record": "land_records",
            "ration card": "ration_card",
            "marksheet": "marksheet",
            "bonafide": "bonafide_certificate",
            "gst": "gst_certificate",
            "udyam": "udyam_certificate",
        }
        for k, v in mapping.items():
            if k in name:
                return v
        return name.replace(" ", "_")

    async def fetch_all_schemes(
        self,
        tags: list[str] = None,
        state: Optional[str] = None,
        page_size: int = 50,
    ) -> list[dict]:
        """
        Fetch schemes filtered by profile tags and state.
        Paginates through all results.
        """
        all_schemes = []
        page = 0

        params = {
            "lang": "en",
            "size": page_size,
            "currentPage": page,
            "sort": "",
        }
        if state:
            params["states"] = state

        # Build keyword from tags
        if tags:
            params["keyword"] = " ".join(tags[:5])   # top 5 most specific tags

        while True:
            params["currentPage"] = page
            logger.info(f"[MyScheme] Fetching page {page}, tags={tags}, state={state}")
            try:
                data = await self.get(MYSCHEME_SEARCH_URL, params=params, json_response=True)
                if not data:
                    break

                data_section = data.get("data", data)
                hits = data_section.get("hits", {})
                if isinstance(hits, dict):
                    items = hits.get("items", [])
                    total = hits.get("page", {}).get("totalPages", 1) * page_size
                elif isinstance(hits, list):
                    items = hits
                    total = data_section.get("summary", {}).get("total", len(items))
                else:
                    items = []
                    total = 0

                if not items:
                    break

                for item in items:
                    parsed = self._parse_scheme_search_item(item)
                    if parsed["name"]:
                        all_schemes.append(parsed)

                total = total
                fetched = (page + 1) * page_size
                if fetched >= total:
                    break
                page += 1

            except Exception as e:
                logger.error(f"[MyScheme] Page {page} failed: {e}")
                break

        logger.info(f"[MyScheme] Total schemes fetched: {len(all_schemes)}")
        return all_schemes

    async def fetch_scheme_detail(self, slug: str) -> Optional[dict]:
        """Fetch full detail for a single scheme by slug."""
        try:
            url = f"{MYSCHEME_DETAIL_URL}/{slug}"
            data = await self.get(url, json_response=True)
            if data:
                raw = data.get("data", data)
                return self._parse_scheme(raw)
        except Exception as e:
            logger.error(f"[MyScheme] Detail fetch failed for {slug}: {e}")
        return None

    async def run(self, profile_tags: list[str] = None, state: str = None) -> list[dict]:
        return await self.fetch_all_schemes(tags=profile_tags, state=state)
