"""
Local, offline document extraction pipeline.

No external API keys required:
  1. Pull raw text out of the uploaded file
       - images -> pytesseract (Tesseract OCR)
       - PDFs   -> pdfplumber text layer (falls back to PyMuPDF render + OCR
                   for scanned/no-text-layer PDFs)
  2. Hand that raw text to a locally running Ollama model, which returns a
     small structured JSON of the fields relevant to that document type.

If Ollama isn't reachable, we degrade gracefully: the document is still
marked verified with whatever raw text we could OCR, just without the
structured field extraction.
"""
import io
import json
import logging
import re
from typing import Optional

import httpx
from PIL import Image
import pytesseract

from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

pytesseract.pytesseract.tesseract_cmd = settings.tesseract_cmd

DOC_TYPE_HINTS = {
    "aadhaar": "an Indian Aadhaar card. Extract: Aadhaar Number, Name, DOB, Gender, Address",
    "pan": "an Indian PAN card. Extract: PAN Number, Name, Father's Name, DOB",
    "bank": "a bank passbook / statement. Extract: Account No., Bank, IFSC, Branch, Name",
    "bpl": "a BPL ration card. Extract: Card No., Category, Name, Address",
    "income": "an income certificate. Extract: Annual Income, Name, Issued By, Issue Date",
    "caste": "a caste certificate. Extract: Caste, Category, Name, Issued By",
    "land": "land records (7/12 extract). Extract: Survey No., Area, Owner Name, Village",
}


def _ocr_image(data: bytes) -> str:
    img = Image.open(io.BytesIO(data))
    return pytesseract.image_to_string(img)


def _extract_pdf_text(data: bytes) -> str:
    try:
        import pdfplumber
        text_parts = []
        with pdfplumber.open(io.BytesIO(data)) as pdf:
            for page in pdf.pages:
                text_parts.append(page.extract_text() or "")
        text = "\n".join(text_parts).strip()
        if text:
            return text
    except Exception as e:
        logger.warning(f"[extraction] pdfplumber failed: {e}")

    # Fallback: scanned PDF with no text layer — render pages and OCR them.
    try:
        import fitz  # PyMuPDF
        text_parts = []
        doc = fitz.open(stream=data, filetype="pdf")
        for page in doc:
            pix = page.get_pixmap(dpi=200)
            img_bytes = pix.tobytes("png")
            text_parts.append(_ocr_image(img_bytes))
        return "\n".join(text_parts).strip()
    except Exception as e:
        logger.warning(f"[extraction] PDF OCR fallback failed: {e}")
        return ""


def extract_raw_text(data: bytes, mime_type: str) -> str:
    if mime_type == "application/pdf":
        return _extract_pdf_text(data)
    if mime_type and mime_type.startswith("image/"):
        return _ocr_image(data)
    return ""


async def structure_with_ollama(doc_type: str, raw_text: str) -> Optional[dict]:
    """Ask the local Ollama model to turn OCR text into a small JSON object."""
    if not raw_text or len(raw_text.strip()) < 3:
        return None

    hint = DOC_TYPE_HINTS.get(doc_type, "an Indian government document. Extract the key identifying fields.")
    prompt = (
        f"The following text was OCR'd from {hint}\n\n"
        f"OCR TEXT:\n---\n{raw_text[:4000]}\n---\n\n"
        "Return ONLY a single valid JSON object mapping short field labels to their values "
        "(e.g. {\"Name\": \"...\", \"Aadhaar Number\": \"...\"}). "
        "Omit fields you can't find. No markdown, no explanation, just the JSON object."
    )

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(
                f"{settings.ollama_base_url}/api/generate",
                json={
                    "model": settings.ollama_model,
                    "prompt": prompt,
                    "stream": False,
                    "format": "json",
                },
            )
            resp.raise_for_status()
            body = resp.json()
            text = body.get("response", "").strip()
            text = re.sub(r"^```(?:json)?\s*", "", text)
            text = re.sub(r"\s*```$", "", text)
            data = json.loads(text)
            if isinstance(data, dict) and data:
                return {str(k): str(v) for k, v in data.items() if v not in (None, "")}
            return None
    except httpx.ConnectError:
        logger.warning("[extraction] Ollama not reachable at %s — skipping structured extraction", settings.ollama_base_url)
        return None
    except Exception as e:
        logger.warning(f"[extraction] Ollama structuring failed: {e}")
        return None


async def process_document(data: bytes, mime_type: str, doc_type: str) -> dict:
    """
    Full pipeline: OCR -> local LLM structuring.
    Returns {"extracted_data": dict | None, "status": str, "error": str | None}
    """
    try:
        raw_text = extract_raw_text(data, mime_type)
    except Exception as e:
        logger.error(f"[extraction] OCR failed: {e}")
        return {"extracted_data": None, "status": "failed", "error": str(e)}

    structured = await structure_with_ollama(doc_type, raw_text)

    if structured:
        return {"extracted_data": structured, "status": "verified", "error": None}

    if raw_text.strip():
        # OCR worked but structuring didn't (e.g. Ollama down) — still useful.
        snippet = raw_text.strip()[:500]
        return {
            "extracted_data": {"Extracted Text (raw)": snippet},
            "status": "verified",
            "error": None,
        }

    return {"extracted_data": None, "status": "verified", "error": "No text could be extracted from this file."}
