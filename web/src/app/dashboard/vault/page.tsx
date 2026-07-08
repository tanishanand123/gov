"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { api, documentFileUrl, type BackendDocument } from "@/lib/api";

type UiStatus = "verified" | "missing" | "processing" | "failed";

interface DocCard {
  id: string;
  name: string;
  icon: string;
  status: UiStatus;
  backendId?: number;
  uploadedOn?: string;
  fileSize?: string;
  extractedData?: Record<string, string> | null;
  mimeType?: string | null;
  needsReview?: boolean;
}

const DOC_CATALOG: { id: string; name: string; icon: string }[] = [
  { id: "aadhaar", name: "Aadhaar Card", icon: "🪪" },
  { id: "pan", name: "PAN Card", icon: "🪪" },
  { id: "bank", name: "Bank Passbook", icon: "💰" },
  { id: "bpl", name: "BPL Ration Card", icon: "🍚" },
  { id: "income", name: "Income Certificate", icon: "💰" },
  { id: "caste", name: "Caste Certificate", icon: "🏛" },
  { id: "land", name: "Land Records (7/12)", icon: "🌾" },
];

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function mergeDocs(backendDocs: BackendDocument[]): DocCard[] {
  return DOC_CATALOG.map((catalogDoc) => {
    const match = backendDocs.find((d) => d.doc_type === catalogDoc.id);
    if (!match) {
      return { id: catalogDoc.id, name: catalogDoc.name, icon: catalogDoc.icon, status: "missing" as UiStatus };
    }
    return {
      id: catalogDoc.id,
      name: catalogDoc.name,
      icon: catalogDoc.icon,
      status: match.status as UiStatus,
      backendId: match.id,
      uploadedOn: formatDate(match.uploaded_at),
      fileSize: match.size_bytes ? formatBytes(match.size_bytes) : undefined,
      extractedData: match.extracted_data,
      mimeType: match.mime_type,
      needsReview: match.needs_review,
    };
  });
}

export default function VaultPage() {
  const { data: session } = useSession();
  const authId = session?.user?.email || "";

  const [documents, setDocuments] = useState<DocCard[]>(
    DOC_CATALOG.map((d) => ({ id: d.id, name: d.name, icon: d.icon, status: "missing" as UiStatus }))
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [ocrOpen, setOcrOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [pickedFile, setPickedFile] = useState<File | null>(null);
  const [docTypeId, setDocTypeId] = useState("");
  const [uploading, setUploading] = useState(false);

  const refresh = useCallback(async () => {
    if (!authId) return;
    try {
      const backendDocs = await api.listDocuments(authId);
      setDocuments(mergeDocs(backendDocs));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load documents");
    } finally {
      setLoading(false);
    }
  }, [authId]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional fetch-on-mount
  useEffect(() => { refresh(); }, [refresh]);

  const uploadedCount = documents.filter((d) => d.status !== "missing").length;
  const selectedDoc = documents.find((d) => d.id === selectedDocId) || null;
  const pendingTargets = documents.filter((d) => d.status === "missing" || d.status === "failed");

  const openUpload = (docId?: string) => {
    setDocTypeId(docId ?? "");
    setPickedFile(null);
    setUploadOpen(true);
  };

  const handleFile = (file: File | null) => { if (file) setPickedFile(file); };

  const handleUpload = async () => {
    if (!docTypeId || !pickedFile || !authId) return;
    setUploading(true);
    try {
      await api.uploadDocument(authId, docTypeId, pickedFile);
      await refresh();
      setUploadOpen(false);
      setSelectedDocId(docTypeId);
      setOcrOpen(true);
      setPickedFile(null);
      setDocTypeId("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (doc: DocCard) => {
    if (!doc.backendId) return;
    try {
      await api.deleteDocument(doc.backendId);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  };

  if (!authId) {
    return <div className="card" style={{ textAlign: "center", color: "var(--text-muted)" }}>Sign in to view your document vault.</div>;
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1>Document Vault</h1>
          <div style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 4 }}>{uploadedCount} of {documents.length} documents uploaded</div>
          <div className="progress-wrap mt-2" style={{ width: 200, marginTop: 8 }}>
            <div className="progress-bar" style={{ width: `${(uploadedCount / documents.length) * 100}%` }} />
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => openUpload()}>+ Upload Document</button>
      </div>

      {error && (
        <div style={{ background: "#FEE2E2", color: "#DC2626", borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 16 }}>{error}</div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-muted)" }}>Loading documents…</div>
      ) : (
        <div className="grid-3">
          {documents.map((doc) => {
            if (doc.status === "missing") {
              return (
                <div key={doc.id} className="doc-card missing" style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 48, color: "var(--text-muted)", marginBottom: 8 }}>☁️</div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{doc.name}</div>
                  <div style={{ fontSize: 13, color: "#EF4444", marginBottom: 14 }}>Required for eligible schemes</div>
                  <button className="btn btn-outline btn-sm btn-full" onClick={() => openUpload(doc.id)}>Upload</button>
                </div>
              );
            }
            if (doc.status === "failed") {
              return (
                <div key={doc.id} className="doc-card expired">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#F59E0B,#D97706)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16 }}>{doc.icon}</div>
                    <span className="badge badge-expired">Needs Review ⚠️</span>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{doc.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 14 }}>Uploaded {doc.uploadedOn}</div>
                  <button className="btn btn-amber btn-sm btn-full" onClick={() => openUpload(doc.id)}>Re-upload</button>
                </div>
              );
            }
            return (
              <div key={doc.id} className="doc-card verified">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#10B981,#059669)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16 }}>{doc.icon}</div>
                  <span className="badge badge-verified">Verified ✓</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{doc.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Uploaded {doc.uploadedOn}</div>
                <span style={{ fontSize: 11, background: "#DCFCE7", color: "#16A34A", padding: "3px 8px", borderRadius: 6, display: "inline-block", margin: "6px 0" }}>OCR Complete ✓</span>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 14 }}>{doc.fileSize}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn-icon" title="View" onClick={() => { setSelectedDocId(doc.id); setOcrOpen(true); }}>👁</button>
                  <button className="btn-icon" title="Re-upload" onClick={() => openUpload(doc.id)}>🔄</button>
                  <button className="btn-icon" style={{ color: "#EF4444" }} title="Delete" onClick={() => handleDelete(doc)}>🗑</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      <div className={`modal-overlay${uploadOpen ? " open" : ""}`}>
        <div className="modal">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h3 style={{ fontSize: 20, fontWeight: 600 }}>Upload Document</h3>
            <button className="btn-icon" onClick={() => setUploadOpen(false)}>✕</button>
          </div>

          <div className="input-wrap" style={{ marginBottom: 14 }}>
            <label className="input-label">Document Type</label>
            <select className="input" value={docTypeId} onChange={(e) => setDocTypeId(e.target.value)}>
              <option value="">Select document type</option>
              {pendingTargets.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>

          <label
            className={`dropzone${dragging ? " dragover" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files?.[0] ?? null); }}
          >
            <input type="file" style={{ display: "none" }} accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
            <div style={{ fontSize: 40 }}>☁️</div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{pickedFile ? pickedFile.name : "Drag & drop or click to browse"}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{pickedFile ? formatBytes(pickedFile.size) : "Supports PDF, JPG, PNG up to 10MB"}</div>
          </label>

          <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
            <span style={{ fontSize: 11, border: "1px solid var(--border)", borderRadius: 6, padding: "3px 8px" }}>PDF</span>
            <span style={{ fontSize: 11, border: "1px solid var(--border)", borderRadius: 6, padding: "3px 8px" }}>JPG</span>
            <span style={{ fontSize: 11, border: "1px solid var(--border)", borderRadius: 6, padding: "3px 8px" }}>PNG</span>
          </div>

          <div style={{ background: "var(--surface-elevated)", borderRadius: 10, padding: 12, marginTop: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>For best OCR accuracy, ensure:</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>• Clear and not blurry</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>• All 4 corners visible</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>• Right-side up, well lit</div>
          </div>

          <button
            className="btn btn-primary btn-full mt-4"
            style={{ marginTop: 16 }}
            disabled={!docTypeId || !pickedFile || uploading}
            onClick={handleUpload}
          >
            {uploading ? "Uploading & running OCR…" : "Upload & Extract Data"}
          </button>
        </div>
      </div>

      {/* OCR Results Modal */}
      <div className={`modal-overlay${ocrOpen ? " open" : ""}`}>
        <div className="modal">
          <div style={{ background: "#DCFCE7", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, marginBottom: 20, fontSize: 14, color: "#16A34A", fontWeight: 600 }}>
            ✅ Data extracted successfully!
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 14 }}>{selectedDoc?.name}</h3>

          {selectedDoc?.backendId && selectedDoc.mimeType?.startsWith("image/") && (
            <img
              src={documentFileUrl(selectedDoc.backendId)}
              alt={selectedDoc.name}
              style={{ width: "100%", maxHeight: 200, objectFit: "contain", borderRadius: 10, marginBottom: 14, background: "var(--surface-elevated)" }}
            />
          )}

          {selectedDoc?.extractedData && Object.keys(selectedDoc.extractedData).length > 0 ? (
            <table className="ocr-table">
              <thead><tr><th>Field</th><th>Extracted Value</th></tr></thead>
              <tbody>
                {Object.entries(selectedDoc.extractedData).map(([key, value]) => (
                  <tr key={key}><td>{key}</td><td style={{ fontWeight: 600 }}>{value}</td></tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ fontSize: 14, color: "var(--text-muted)" }}>No structured data could be extracted from this file.</p>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button className="btn btn-primary btn-full" onClick={() => setOcrOpen(false)}>Done</button>
          </div>
        </div>
      </div>
    </div>
  );
}
