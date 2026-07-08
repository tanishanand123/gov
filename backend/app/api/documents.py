"""
POST   /v1/documents                — upload a file, run local OCR + Ollama extraction
GET    /v1/documents?auth_id=...    — list a user's documents
DELETE /v1/documents/{id}           — remove a document
GET    /v1/documents/{id}/file      — download/preview the stored file
"""
import os
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.db.database import get_db
from app.models.document import Document
from app.services.extraction import process_document

router = APIRouter()
settings = get_settings()


class DocumentOut(BaseModel):
    id: int
    doc_type: str
    original_name: str
    mime_type: str | None
    size_bytes: int | None
    status: str
    extracted_data: dict | None
    needs_review: bool
    uploaded_at: str

    @staticmethod
    def from_orm_obj(d: Document) -> "DocumentOut":
        return DocumentOut(
            id=d.id,
            doc_type=d.doc_type,
            original_name=d.original_name,
            mime_type=d.mime_type,
            size_bytes=d.size_bytes,
            status=d.status,
            extracted_data=d.extracted_data,
            needs_review=d.needs_review,
            uploaded_at=d.uploaded_at.isoformat() if d.uploaded_at else "",
        )


def _user_dir(auth_id: str) -> Path:
    safe = "".join(c for c in auth_id if c.isalnum() or c in "._-@") or "anon"
    d = Path(settings.storage_dir) / safe
    d.mkdir(parents=True, exist_ok=True)
    return d


@router.post("/documents", response_model=DocumentOut)
async def upload_document(
    auth_id: str = Form(...),
    doc_type: str = Form(...),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    data = await file.read()
    if len(data) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File exceeds 10 MB limit")

    ext = Path(file.filename or "").suffix
    stored_name = f"{uuid.uuid4().hex}{ext}"
    stored_path = _user_dir(auth_id) / stored_name
    stored_path.write_bytes(data)

    result = await process_document(data, file.content_type or "", doc_type)

    # Replace any existing document of this type for this user (re-upload).
    existing = await db.execute(
        select(Document).where(Document.auth_id == auth_id, Document.doc_type == doc_type)
    )
    for old in existing.scalars().all():
        old_path = Path(old.stored_path)
        if old_path.exists():
            old_path.unlink(missing_ok=True)
        await db.delete(old)
    await db.flush()

    doc = Document(
        auth_id=auth_id,
        doc_type=doc_type,
        original_name=file.filename or stored_name,
        stored_path=str(stored_path),
        mime_type=file.content_type,
        size_bytes=len(data),
        status=result["status"],
        extracted_data=result["extracted_data"],
        extraction_error=result["error"],
        needs_review=result["status"] == "failed",
    )
    db.add(doc)
    await db.flush()
    await db.refresh(doc)
    return DocumentOut.from_orm_obj(doc)


@router.get("/documents", response_model=list[DocumentOut])
async def list_documents(auth_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Document).where(Document.auth_id == auth_id).order_by(Document.uploaded_at.desc())
    )
    return [DocumentOut.from_orm_obj(d) for d in result.scalars().all()]


@router.delete("/documents/{doc_id}")
async def delete_document(doc_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Document).where(Document.id == doc_id))
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    path = Path(doc.stored_path)
    if path.exists():
        path.unlink(missing_ok=True)
    await db.delete(doc)
    return {"deleted": True}


@router.get("/documents/{doc_id}/file")
async def get_document_file(doc_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Document).where(Document.id == doc_id))
    doc = result.scalar_one_or_none()
    if not doc or not os.path.exists(doc.stored_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(doc.stored_path, media_type=doc.mime_type or "application/octet-stream", filename=doc.original_name)
