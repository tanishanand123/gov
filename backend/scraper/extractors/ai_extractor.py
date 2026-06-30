"""
AI Extractor — uses Claude (primary) to convert raw HTML / PDF text into
the structured scheme JSON that the database and eligibility engine expect.

For raw HTML from dynamic/state portals where the schema is unknown,
we can't rely on CSS selectors — the LLM reads the content and returns
a structured JSON regardless of the source site's layout.

For MyScheme API responses (already structured), extraction_confidence = 0.95
and this module is skipped. It's only called for:
  - State portal HTML (extraction_confidence = 0.7–0.85)
  - PDF text (extraction_confidence = 0.6–0.8)
  - Unknown/legacy govt pages
"""
import json
import logging
import re
from typing import Optional
import anthropic
from bs4 import BeautifulSoup
from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

EXTRACTION_PROMPT = """You are an expert at extracting structured information from Indian government scheme pages.

Extract ALL available information from the following content and return it as a single valid JSON object.
Be thorough — extract every field you can find. If a field is not present, omit it from the JSON.

Required JSON schema:
{
  "scheme_name": "Full official scheme name",
  "summary": "2-sentence plain-English summary of what the scheme is and who it helps",
  "description": "Full description of the scheme (paragraph)",
  "ministry": "Ministry or department name",
  "department": "Sub-department if mentioned",
  "state": "State name if state-specific, null if pan-India",
  "level": "central or state",
  "eligibility": {
    "age": {"min": null, "max": null},
    "gender": [],         // ["male"] or ["female"] or ["male","female"] for all
    "caste": [],          // ["sc"] ["st"] ["obc"] ["general"] — lowercase
    "income_max": null,   // annual income ceiling in rupees (number)
    "occupation": [],     // ["farmer","student","entrepreneur","salaried","unemployed","daily-wage"]
    "states": [],         // list of eligible states, empty means all
    "area_type": null,    // "rural" or "urban" or null for both
    "education": [],      // ["10th","12th","diploma","graduate","postgraduate"]
    "land_max_acres": null,
    "disability": false,
    "minority": false,
    "tags": []            // keyword tags: ["farmer","woman","sc","startup","msme","shg","disability"]
  },
  "benefits": {
    "type": [],           // ["loan","subsidy","grant","scholarship","insurance","training","equipment","pension"]
    "loan_amount": null,
    "subsidy_percent": null,
    "grant_amount": null,
    "interest_rate": null,
    "scholarship_amount": null,
    "insurance_cover": null,
    "pension_amount": null,
    "description": "Human-readable benefit summary e.g. '35% capital subsidy up to ₹5 lakhs'"
  },
  "documents_required": [
    // Use these standard slugs: aadhaar, pan, income_certificate, caste_certificate,
    // bank_passbook, photo, birth_certificate, domicile_certificate, disability_certificate,
    // land_records, ration_card, marksheet, bonafide_certificate, gst_certificate,
    // udyam_certificate, business_registration, it_returns, driving_license, passport
  ],
  "application_process": "Step-by-step how to apply",
  "application_mode": "online or offline or both",
  "application_url": "Direct application URL if found",
  "opening_date": "YYYY-MM-DD or null",
  "closing_date": "YYYY-MM-DD or null",
  "financial_year": "e.g. 2025-26 or null",
  "helpline": "Helpline number if found",
  "email": "Contact email if found",
  "faq": [
    {"question": "...", "answer": "..."}
  ],
  "who_should_apply": "1-2 sentences: who is the ideal applicant",
  "common_rejection_reasons": ["reason1", "reason2"],
  "important_notes": "Any caveats, warnings, or special conditions",
  "official_pdf_url": "URL to scheme PDF/guidelines if found",
  "source_url": "Primary official URL"
}

CONTENT TO EXTRACT FROM:
---
{content}
---

Return ONLY the JSON object. No explanation, no markdown code blocks, just raw JSON."""


def truncate_content(content: str, max_chars: int = 12000) -> str:
    """Truncate content to fit within token limits while preserving key sections."""
    if len(content) <= max_chars:
        return content

    # Keep the first 60% and last 40% (header + conclusion usually have key info)
    half = max_chars // 2
    return content[:int(max_chars * 0.6)] + "\n...[content truncated]...\n" + content[-int(max_chars * 0.4):]


def html_to_text(html: str) -> str:
    """Strip HTML tags and clean up whitespace."""
    soup = BeautifulSoup(html, "lxml")

    # Remove navigation, header, footer, scripts, styles
    for tag in soup.find_all(["nav", "header", "footer", "script", "style",
                               "aside", "advertisement", "noscript"]):
        tag.decompose()

    text = soup.get_text(separator="\n")
    # Clean up excess whitespace
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[ \t]{2,}", " ", text)
    return text.strip()


class AIExtractor:

    def __init__(self):
        self.client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
        self.model = "claude-haiku-4-5-20251001"   # fast + cheap for extraction tasks

    async def extract_scheme(self, raw: dict) -> Optional[dict]:
        """
        Extract structured scheme data from a raw scrape result.

        raw must have either:
          - raw_html: str  — HTML from a webpage
          - raw_text: str  — plain text from a PDF
        """
        if not settings.anthropic_api_key:
            logger.warning("[AIExtractor] No ANTHROPIC_API_KEY — skipping AI extraction")
            return raw   # return as-is, needs manual review

        # Prepare content
        if raw.get("raw_html"):
            content = html_to_text(raw["raw_html"])
        elif raw.get("raw_text"):
            content = raw["raw_text"]
        else:
            logger.warning("[AIExtractor] No content to extract from")
            return None

        content = truncate_content(content)
        if len(content) < 50:
            return None

        prompt = EXTRACTION_PROMPT.format(content=content)

        try:
            logger.info(f"[AIExtractor] Extracting: {raw.get('name', raw.get('source_url', 'unknown'))}")

            # Run synchronously (convert to async if needed with asyncio.to_thread)
            import asyncio
            response = await asyncio.to_thread(
                self.client.messages.create,
                model=self.model,
                max_tokens=4096,
                messages=[{"role": "user", "content": prompt}],
            )

            text = response.content[0].text.strip()

            # Strip markdown code fences if present
            text = re.sub(r"^```(?:json)?\s*", "", text)
            text = re.sub(r"\s*```$", "", text)

            extracted = json.loads(text)

            # Merge with known metadata from scraper
            result = {
                "slug": "",   # will be generated from name
                "state": raw.get("state"),
                "level": raw.get("level", "central"),
                "source": raw.get("source", ""),
                "source_url": raw.get("source_url", ""),
                "needs_human_review": False,
                "extraction_confidence": self._estimate_confidence(extracted, content),
                **self._normalize_extracted(extracted),
            }

            # Flag for human review if confidence is low
            if result["extraction_confidence"] < 0.6:
                result["needs_human_review"] = True

            return result

        except json.JSONDecodeError as e:
            logger.error(f"[AIExtractor] JSON parse failed: {e}")
            return {**raw, "needs_human_review": True, "extraction_confidence": 0.0}
        except anthropic.APIError as e:
            logger.error(f"[AIExtractor] API error: {e}")
            raise

    def _normalize_extracted(self, data: dict) -> dict:
        """Normalize and clean extracted data."""
        # Flatten eligibility and benefits into DB fields
        eligibility = data.get("eligibility", {})
        benefits = data.get("benefits", {})

        return {
            "name": data.get("scheme_name", ""),
            "summary": data.get("summary", ""),
            "description": data.get("description", ""),
            "ministry": data.get("ministry", ""),
            "department": data.get("department", ""),
            "state": data.get("state"),
            "level": data.get("level", "central"),
            "source_url": data.get("source_url", ""),
            "application_url": data.get("application_url", ""),
            "official_pdf_url": data.get("official_pdf_url", ""),
            "eligibility_raw": eligibility,
            "eligibility_summary": self._summarize_eligibility(eligibility),
            "benefits_raw": benefits,
            "benefit_summary": benefits.get("description", ""),
            "documents_required": data.get("documents_required", []),
            "application_process": data.get("application_process", ""),
            "application_mode": data.get("application_mode", ""),
            "closing_date": data.get("closing_date"),
            "opening_date": data.get("opening_date"),
            "financial_year": data.get("financial_year"),
            "helpline": data.get("helpline", ""),
            "email": data.get("email", ""),
            "faq": data.get("faq", []),
            "who_should_apply": data.get("who_should_apply", ""),
            "common_rejection_reasons": data.get("common_rejection_reasons", []),
            "important_notes": data.get("important_notes", ""),
        }

    def _summarize_eligibility(self, eligibility: dict) -> str:
        """Generate a human-readable eligibility summary from structured data."""
        parts = []
        if eligibility.get("gender"):
            g = eligibility["gender"]
            if g and "female" in g and "male" not in g:
                parts.append("Women only")
        if eligibility.get("caste"):
                parts.append(f"Caste: {', '.join(c.upper() for c in eligibility['caste'])}")
        if eligibility.get("age"):
            age = eligibility["age"]
            mn, mx = age.get("min"), age.get("max")
            if mn and mx:
                parts.append(f"Age {mn}–{mx} years")
            elif mn:
                parts.append(f"Age {mn}+ years")
            elif mx:
                parts.append(f"Age up to {mx} years")
        if eligibility.get("income_max"):
            inc = eligibility["income_max"]
            parts.append(f"Income below ₹{inc:,.0f}/year")
        if eligibility.get("occupation"):
            parts.append(f"Occupation: {', '.join(eligibility['occupation'])}")
        if eligibility.get("states"):
            states = eligibility["states"]
            if len(states) <= 3:
                parts.append(f"State: {', '.join(states)}")
        return ". ".join(parts) + "." if parts else "Open to eligible citizens."

    def _estimate_confidence(self, extracted: dict, source_content: str) -> float:
        """Estimate extraction confidence based on field completeness."""
        required_fields = ["scheme_name", "eligibility", "benefits", "documents_required"]
        present = sum(1 for f in required_fields if extracted.get(f))
        base_score = present / len(required_fields)

        # Boost if key eligibility fields are present
        elig = extracted.get("eligibility", {})
        if elig.get("income_max") or elig.get("age"):
            base_score += 0.1
        if extracted.get("benefits", {}).get("description"):
            base_score += 0.05
        if extracted.get("application_url"):
            base_score += 0.05

        return min(base_score, 0.95)

    async def generate_summary(self, scheme_name: str, description: str) -> str:
        """Generate a crisp 2-line summary for a scheme using Claude."""
        try:
            import asyncio
            response = await asyncio.to_thread(
                self.client.messages.create,
                model=self.model,
                max_tokens=150,
                messages=[{
                    "role": "user",
                    "content": f"Summarize this Indian government scheme in exactly 2 sentences. "
                               f"First sentence: what the scheme is. Second sentence: who benefits and how.\n\n"
                               f"Scheme: {scheme_name}\n\nDescription: {description[:2000]}"
                }],
            )
            return response.content[0].text.strip()
        except Exception as e:
            logger.error(f"[AIExtractor] Summary generation failed: {e}")
            return description[:200] + "..." if description else ""
