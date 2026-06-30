"""
PDF scraper — downloads government scheme PDFs, extracts text via OCR,
and returns structured content for AI extraction.

Government PDFs include:
- Scheme guidelines (most detailed)
- Government Gazette notifications
- Ministry circulars / OM (Office Memorandums)
- Budget scheme announcements
"""
import asyncio
import io
import logging
import os
import tempfile
from pathlib import Path
from typing import Optional
from .base_spider import BaseSpider, md5

logger = logging.getLogger(__name__)

# Well-known scheme PDF directories — crawled periodically
PDF_SOURCES = [
    "https://www.india.gov.in/sites/upload_files/npi/files/",
    "https://socialjustice.gov.in/writereaddata/UploadFile/",
    "https://tribal.nic.in/schemes/",
    "https://wcd.nic.in/schemes-guidelines",
    "https://labour.gov.in/sites/default/files/",
    "https://msme.gov.in/sites/default/files/",
]


class PDFSpider(BaseSpider):
    name = "pdf"

    async def download_pdf(self, url: str) -> Optional[bytes]:
        """Download a PDF file and return raw bytes."""
        try:
            import httpx
            async with httpx.AsyncClient(
                timeout=60, follow_redirects=True, verify=False
            ) as client:
                resp = await client.get(url, headers=self._headers())
                if resp.status_code == 200 and "pdf" in resp.headers.get("content-type", "").lower():
                    return resp.content
        except Exception as e:
            logger.error(f"[PDF] Download failed {url}: {e}")
        return None

    def extract_text_pymupdf(self, pdf_bytes: bytes) -> str:
        """Extract text from PDF using PyMuPDF (fast, best for digital PDFs)."""
        try:
            import fitz  # PyMuPDF
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            text_parts = []
            for page in doc:
                text_parts.append(page.get_text("text"))
            return "\n".join(text_parts)
        except Exception as e:
            logger.warning(f"[PDF] PyMuPDF extraction failed: {e}")
            return ""

    def extract_text_pdfplumber(self, pdf_bytes: bytes) -> str:
        """Extract text using pdfplumber (better for tables)."""
        try:
            import pdfplumber
            with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
                parts = []
                for page in pdf.pages:
                    text = page.extract_text()
                    if text:
                        parts.append(text)
                    # Also extract tables as text
                    for table in page.extract_tables():
                        for row in table:
                            parts.append(" | ".join(str(c or "") for c in row))
            return "\n".join(parts)
        except Exception as e:
            logger.warning(f"[PDF] pdfplumber extraction failed: {e}")
            return ""

    def extract_text_ocr(self, pdf_bytes: bytes) -> str:
        """
        OCR fallback for scanned PDFs.
        Converts each page to image → runs Tesseract → combines text.
        """
        try:
            import fitz
            import pytesseract
            from PIL import Image

            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            all_text = []
            for page in doc:
                # Render at 2x resolution for better OCR accuracy
                mat = fitz.Matrix(2.0, 2.0)
                pix = page.get_pixmap(matrix=mat)
                img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                text = pytesseract.image_to_string(img, lang="eng+hin")
                all_text.append(text)
            return "\n".join(all_text)
        except Exception as e:
            logger.warning(f"[PDF] OCR failed: {e}")
            return ""

    def extract_text(self, pdf_bytes: bytes) -> str:
        """
        Extract text from PDF — tries digital extraction first, falls back to OCR.
        """
        # Try digital extraction
        text = self.extract_text_pymupdf(pdf_bytes)
        if len(text.strip()) < 100:
            # Likely a scanned PDF — try pdfplumber
            text = self.extract_text_pdfplumber(pdf_bytes)
        if len(text.strip()) < 100:
            # Last resort — OCR
            logger.info("[PDF] Falling back to OCR")
            text = self.extract_text_ocr(pdf_bytes)
        return text

    async def process_pdf_url(self, url: str, metadata: dict = None) -> Optional[dict]:
        """Download + extract text from a PDF URL, return structured raw data."""
        logger.info(f"[PDF] Processing {url}")
        pdf_bytes = await self.download_pdf(url)
        if not pdf_bytes:
            return None

        text = self.extract_text(pdf_bytes)
        if not text or len(text) < 50:
            logger.warning(f"[PDF] No text extracted from {url}")
            return None

        return {
            "source_url": url,
            "source_hash": md5(text),
            "raw_text": text,
            "file_size_kb": len(pdf_bytes) // 1024,
            "needs_ai_extraction": True,
            "source": "pdf",
            **(metadata or {}),
        }

    async def discover_pdfs_from_page(self, url: str) -> list[str]:
        """Find all PDF links on a government page."""
        try:
            html = await self.get(url)
            if not html:
                return []
            soup = self.parse_html(html, base_url=url)
            pdf_urls = []
            for a in soup.find_all("a", href=True):
                href = a["href"]
                if href.lower().endswith(".pdf"):
                    pdf_urls.append(href)
            return pdf_urls
        except Exception as e:
            logger.error(f"[PDF] Discovery failed at {url}: {e}")
            return []

    async def run(self, pdf_urls: list[str] = None) -> list[dict]:
        """Process a list of PDF URLs or discover PDFs from known sources."""
        results = []

        if not pdf_urls:
            # Discover PDFs from known source directories
            all_pdf_urls = []
            for source in PDF_SOURCES:
                discovered = await self.discover_pdfs_from_page(source)
                all_pdf_urls.extend(discovered[:10])  # max 10 per source
            pdf_urls = all_pdf_urls

        tasks = [self.process_pdf_url(url) for url in pdf_urls]
        processed = await asyncio.gather(*tasks, return_exceptions=True)

        for result in processed:
            if isinstance(result, dict) and result:
                results.append(result)

        logger.info(f"[PDF] Processed {len(results)} PDFs successfully")
        return results
