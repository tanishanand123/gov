"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { api, documentFileUrl, type BackendDocument } from "@/lib/api";
import {
  IdCard, CreditCard, Wallet, ShoppingBasket, IndianRupee, Landmark, LandPlot,
  File as FileIcon, UploadCloud, X, AlertTriangle,
  Eye, Pencil, Trash2, Plus, Link2, CheckCircle2,
} from "lucide-react";

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
  custom?: boolean;
}

interface CustomType { id: string; name: string; icon: string; }

const CATALOG_ICONS: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  aadhaar: IdCard, pan: CreditCard, bank: Wallet, bpl: ShoppingBasket, income: IndianRupee, caste: Landmark, land: LandPlot,
};

function loadCustomTypes(authId: string): CustomType[] {
  if (!authId || typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(`vault-custom-types:${authId}`) || "[]");
  } catch {
    return [];
  }
}

function saveCustomTypes(authId: string, types: CustomType[]) {
  if (!authId || typeof window === "undefined") return;
  localStorage.setItem(`vault-custom-types:${authId}`, JSON.stringify(types));
}

const DOC_CATALOG: { id: string; name: string; icon: string }[] = [
  { id: "aadhaar", name: "Aadhaar Card", icon: "aadhaar" },
  { id: "pan", name: "PAN Card", icon: "pan" },
  { id: "bank", name: "Bank Passbook", icon: "bank" },
  { id: "bpl", name: "BPL Ration Card", icon: "bpl" },
  { id: "income", name: "Income Certificate", icon: "income" },
  { id: "caste", name: "Caste Certificate", icon: "caste" },
  { id: "land", name: "Land Records (7/12)", icon: "land" },
];

function DocIcon({ doc, size = 16 }: { doc: DocCard; size?: number }) {
  if (!doc.custom) {
    const Icon = CATALOG_ICONS[doc.icon] || FileIcon;
    return <Icon size={size} strokeWidth={2} />;
  }
  return <span style={{ fontSize: size }}>{doc.icon}</span>;
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function toCard(catalogDoc: { id: string; name: string; icon: string }, match: BackendDocument | undefined, custom: boolean): DocCard {
  if (!match) {
    return { id: catalogDoc.id, name: catalogDoc.name, icon: catalogDoc.icon, status: "missing" as UiStatus, custom };
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
    custom,
  };
}

function mergeDocs(backendDocs: BackendDocument[], customTypes: CustomType[]): DocCard[] {
  const catalogCards = DOC_CATALOG.map((catalogDoc) =>
    toCard(catalogDoc, backendDocs.find((d) => d.doc_type === catalogDoc.id), false)
  );
  const catalogIds = new Set(DOC_CATALOG.map((d) => d.id));

  // Custom types the user explicitly added (shown even before a file is uploaded)
  const definedCustomCards = customTypes.map((ct) =>
    toCard(ct, backendDocs.find((d) => d.doc_type === ct.id), true)
  );
  const definedIds = new Set(customTypes.map((c) => c.id));

  // Any backend doc that isn't in the fixed catalog or the user's saved custom types
  // (e.g. uploaded before this browser had the type saved locally) — show it too so nothing is ever lost.
  const orphanCards = backendDocs
    .filter((d) => !catalogIds.has(d.doc_type) && !definedIds.has(d.doc_type))
    .map((d) => toCard({ id: d.doc_type, name: d.doc_type, icon: "📄" }, d, true));

  return [...catalogCards, ...definedCustomCards, ...orphanCards];
}

export default function VaultPage() {
  const { data: session } = useSession();
  const authId = session?.user?.email || "";

  const [documents, setDocuments] = useState<DocCard[]>(
    DOC_CATALOG.map((d) => ({ id: d.id, name: d.name, icon: d.icon, status: "missing" as UiStatus }))
  );
  const [customTypes, setCustomTypes] = useState<CustomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [ocrOpen, setOcrOpen] = useState(false);
  const [addTypeOpen, setAddTypeOpen] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [newTypeIcon, setNewTypeIcon] = useState("📄");
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [pickedFile, setPickedFile] = useState<File | null>(null);
  const [docTypeId, setDocTypeId] = useState("");
  const [uploading, setUploading] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- load per-user custom types on auth change
  useEffect(() => { setCustomTypes(loadCustomTypes(authId)); }, [authId]);

  const refresh = useCallback(async () => {
    if (!authId) return;
    try {
      const backendDocs = await api.listDocuments(authId);
      setDocuments(mergeDocs(backendDocs, loadCustomTypes(authId)));
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

  const addCustomType = () => {
    const name = newTypeName.trim();
    if (!name) return;
    const id = `custom:${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${Date.now().toString(36)}`;
    const updated = [...customTypes, { id, name, icon: newTypeIcon.trim() || "📄" }];
    setCustomTypes(updated);
    saveCustomTypes(authId, updated);
    setDocuments((prev) => [...prev, { id, name, icon: newTypeIcon.trim() || "📄", status: "missing", custom: true }]);
    setAddTypeOpen(false);
    setNewTypeName("");
    setNewTypeIcon("📄");
  };

  const removeCustomType = async (doc: DocCard) => {
    if (doc.backendId) {
      try { await api.deleteDocument(doc.backendId); } catch { /* fall through to local cleanup */ }
    }
    const updated = customTypes.filter((c) => c.id !== doc.id);
    setCustomTypes(updated);
    saveCustomTypes(authId, updated);
    setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
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
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-outline" onClick={() => setAddTypeOpen(true)}>+ Add Custom Type</button>
          <button className="btn btn-primary" onClick={() => openUpload()}>+ Upload Document</button>
        </div>
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
                <div key={doc.id} className="doc-card missing" style={{ textAlign: "center", position: "relative" }}>
                  {doc.custom && (
                    <button
                      className="btn-icon"
                      style={{ position: "absolute", top: 8, right: 8, color: "#EF4444" }}
                      title="Remove this custom document type"
                      onClick={() => removeCustomType(doc)}
                    >
                      <X size={14} strokeWidth={2} />
                    </button>
                  )}
                  <div style={{ display: "flex", justifyContent: "center", color: "var(--text-muted)", marginBottom: 8 }}>
                    {doc.custom ? <DocIcon doc={doc} size={40} /> : <UploadCloud size={40} strokeWidth={1.5} />}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{doc.name}</div>
                  <div style={{ fontSize: 13, color: "#EF4444", marginBottom: 14 }}>{doc.custom ? "Not uploaded yet" : "Required for eligible schemes"}</div>
                  <button className="btn btn-outline btn-sm btn-full" onClick={() => openUpload(doc.id)}>Upload</button>
                </div>
              );
            }
            if (doc.status === "failed") {
              return (
                <div key={doc.id} className="doc-card expired" style={{ position: "relative" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#F59E0B,#D97706)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><DocIcon doc={doc} /></div>
                    <span className="badge badge-expired" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><AlertTriangle size={12} strokeWidth={2} /> Needs Review</span>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{doc.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 14 }}>Uploaded {doc.uploadedOn}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-amber btn-sm btn-full" onClick={() => openUpload(doc.id)}>Re-upload</button>
                    {doc.custom && (
                      <button className="btn-icon" style={{ color: "#EF4444" }} title="Remove" onClick={() => removeCustomType(doc)}><Trash2 size={16} strokeWidth={2} /></button>
                    )}
                  </div>
                </div>
              );
            }
            return (
              <div key={doc.id} className="doc-card verified">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#10B981,#059669)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><DocIcon doc={doc} /></div>
                  <span className="badge badge-verified">Verified ✓</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{doc.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Uploaded {doc.uploadedOn}</div>
                <span style={{ fontSize: 11, background: "#DCFCE7", color: "#16A34A", padding: "3px 8px", borderRadius: 6, display: "inline-block", margin: "6px 0" }}>OCR Complete ✓</span>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 14 }}>{doc.fileSize}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn-icon" title="View" onClick={() => { setSelectedDocId(doc.id); setOcrOpen(true); }}><Eye size={16} strokeWidth={2} /></button>
                  <button className="btn-icon" title="Edit / Replace" onClick={() => openUpload(doc.id)}><Pencil size={16} strokeWidth={2} /></button>
                  <button className="btn-icon" style={{ color: "#EF4444" }} title={doc.custom ? "Delete document & remove type" : "Delete document"} onClick={() => (doc.custom ? removeCustomType(doc) : handleDelete(doc))}><Trash2 size={16} strokeWidth={2} /></button>
                </div>
              </div>
            );
          })}

          <div
            className="doc-card missing"
            style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", borderStyle: "dashed" }}
            onClick={() => setAddTypeOpen(true)}
          >
            <div style={{ display: "flex", justifyContent: "center", color: "var(--text-muted)", marginBottom: 8 }}><Plus size={36} strokeWidth={1.5} /></div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Add Document Type</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>e.g. Ration Card, Marksheet, Voter ID</div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      <div className={`modal-overlay${uploadOpen ? " open" : ""}`}>
        <div className="modal">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h3 style={{ fontSize: 20, fontWeight: 600 }}>Upload Document</h3>
            <button className="btn-icon" onClick={() => setUploadOpen(false)}><X size={16} strokeWidth={2} /></button>
          </div>

          <div className="input-wrap" style={{ marginBottom: 14 }}>
            <label className="input-label">Document Type</label>
            <select className="input" value={docTypeId} onChange={(e) => setDocTypeId(e.target.value)}>
              <option value="">Select document type</option>
              {pendingTargets.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            {pendingTargets.length === 0 && (
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>
                All document types have files. Use &quot;+ Add Custom Type&quot; to add a new one.
              </div>
            )}
          </div>

          <label
            className={`dropzone${dragging ? " dragover" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files?.[0] ?? null); }}
          >
            <input type="file" style={{ display: "none" }} accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
            <div style={{ display: "flex", justifyContent: "center", color: "var(--text-muted)" }}><UploadCloud size={36} strokeWidth={1.5} /></div>
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

      {/* Add Custom Type Modal */}
      <div className={`modal-overlay${addTypeOpen ? " open" : ""}`}>
        <div className="modal">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h3 style={{ fontSize: 20, fontWeight: 600 }}>Add Document Type</h3>
            <button className="btn-icon" onClick={() => setAddTypeOpen(false)}><X size={16} strokeWidth={2} /></button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="input-wrap">
              <label className="input-label">Document Name</label>
              <input
                className="input"
                type="text"
                placeholder="e.g. Electricity Bill, Ration Card, Voter ID"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
              />
            </div>
            <div className="input-wrap">
              <label className="input-label">Icon (optional emoji)</label>
              <input
                className="input"
                type="text"
                maxLength={2}
                style={{ width: 80 }}
                value={newTypeIcon}
                onChange={(e) => setNewTypeIcon(e.target.value)}
              />
            </div>
            <button className="btn btn-primary btn-full" disabled={!newTypeName.trim()} onClick={addCustomType}>
              Add Document Type
            </button>
          </div>
        </div>
      </div>

      {/* OCR Results Modal */}
      <div className={`modal-overlay${ocrOpen ? " open" : ""}`}>
        <div className="modal">
          <div style={{ background: "#DCFCE7", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, marginBottom: 20, fontSize: 14, color: "#16A34A", fontWeight: 600 }}>
            <CheckCircle2 size={16} strokeWidth={2} /> Data extracted successfully!
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 14 }}>{selectedDoc?.name}</h3>

          {selectedDoc?.backendId && selectedDoc.mimeType?.startsWith("image/") && (
            <img
              src={documentFileUrl(selectedDoc.backendId)}
              alt={selectedDoc.name}
              style={{ width: "100%", maxHeight: 200, objectFit: "contain", borderRadius: 10, marginBottom: 14, background: "var(--surface-elevated)" }}
            />
          )}
          {selectedDoc?.backendId && (
            <a
              href={documentFileUrl(selectedDoc.backendId)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 14, textDecoration: "none" }}
            >
              <Link2 size={14} strokeWidth={2} /> Open Original File
            </a>
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
