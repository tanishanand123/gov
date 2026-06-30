"use client";

import React, { useState } from "react";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Eye,
  RefreshCw,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Modal } from "@/components/ui/Modal";

type DocStatus = "verified" | "expired" | "missing" | "pending";

interface DocCard {
  id: string;
  name: string;
  status: DocStatus;
  uploadedOn?: string;
  expiresOn?: string;
  fileSize?: string;
  extractedData?: Record<string, string>;
}

const documents: DocCard[] = [
  {
    id: "aadhaar",
    name: "Aadhaar Card",
    status: "verified",
    uploadedOn: "15 Oct 2025",
    expiresOn: "N/A",
    fileSize: "1.2 MB",
    extractedData: { "Aadhaar Number": "XXXX XXXX 4521", "Name": "Rajan Kumar", "DOB": "15/04/1991", "Address": "Nashik, Maharashtra" },
  },
  {
    id: "pan",
    name: "PAN Card",
    status: "verified",
    uploadedOn: "15 Oct 2025",
    fileSize: "0.8 MB",
    extractedData: { "PAN Number": "ABCDE1234F", "Name": "RAJAN KUMAR" },
  },
  {
    id: "bank",
    name: "Bank Passbook",
    status: "verified",
    uploadedOn: "20 Oct 2025",
    fileSize: "2.1 MB",
    extractedData: { "Account No.": "XXXXXXXXX1234", "Bank": "State Bank of India", "IFSC": "SBIN0001234" },
  },
  {
    id: "bpl",
    name: "BPL Ration Card",
    status: "verified",
    uploadedOn: "12 Oct 2025",
    fileSize: "1.5 MB",
    extractedData: { "Card No.": "MH-12345-BPL", "Category": "Below Poverty Line" },
  },
  {
    id: "income",
    name: "Income Certificate",
    status: "missing",
  },
  {
    id: "caste",
    name: "Caste Certificate",
    status: "missing",
  },
  {
    id: "land",
    name: "Land Records (7/12)",
    status: "expired",
    uploadedOn: "5 Jan 2025",
    expiresOn: "5 Jan 2026",
    fileSize: "3.2 MB",
  },
];

const statusConfig = {
  verified: {
    border: "border-success",
    bg: "bg-green-50",
    icon: <CheckCircle2 size={16} className="text-success" />,
    badge: "verified" as const,
    badgeLabel: "Verified",
  },
  expired: {
    border: "border-amber-400",
    bg: "bg-amber-50",
    icon: <AlertTriangle size={16} className="text-amber-500" />,
    badge: "expired" as const,
    badgeLabel: "Expired",
  },
  missing: {
    border: "border-dashed border-slate-300",
    bg: "bg-slate-50",
    icon: <Plus size={16} className="text-muted" />,
    badge: "missing" as const,
    badgeLabel: "Not Uploaded",
  },
  pending: {
    border: "border-primary",
    bg: "bg-indigo-50",
    icon: <RefreshCw size={16} className="text-primary animate-spin" />,
    badge: "processing" as const,
    badgeLabel: "Processing",
  },
};

const uploadedCount = documents.filter((d) => d.status !== "missing").length;

export default function VaultPage() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [ocrOpen, setOcrOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocCard | null>(null);
  const [dragging, setDragging] = useState(false);

  const openOcr = (doc: DocCard) => {
    setSelectedDoc(doc);
    setOcrOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-text">Document Vault</h1>
          <p className="text-muted text-sm mt-1">Securely store all your government documents</p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Upload size={16} />}
          onClick={() => setUploadOpen(true)}
        >
          Upload Document
        </Button>
      </div>

      {/* Progress */}
      <div className="card-base p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-text">Documents Uploaded</span>
          <span className="text-sm font-bold text-primary">{uploadedCount}/{documents.length}</span>
        </div>
        <ProgressBar value={uploadedCount} max={documents.length} showLabel size="md" />
        <p className="text-xs text-muted mt-2">
          {documents.length - uploadedCount} documents still needed to unlock all schemes.
        </p>
      </div>

      {/* Document grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {documents.map((doc) => {
          const config = statusConfig[doc.status];
          return (
            <div
              key={doc.id}
              className={`border-2 rounded-2xl p-5 ${config.border} ${config.bg} flex flex-col gap-3`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-white rounded-xl shadow-sm flex items-center justify-center">
                    <FileText size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text">{doc.name}</p>
                    {doc.uploadedOn && (
                      <p className="text-xs text-muted">Uploaded {doc.uploadedOn}</p>
                    )}
                  </div>
                </div>
                <Badge variant={config.badge}>{config.badgeLabel}</Badge>
              </div>

              {doc.fileSize && (
                <p className="text-xs text-muted">{doc.fileSize}</p>
              )}

              {doc.expiresOn && doc.expiresOn !== "N/A" && (
                <p className="text-xs text-amber-600 font-medium">Expires: {doc.expiresOn}</p>
              )}

              {doc.status === "missing" ? (
                <Button
                  variant="outline"
                  fullWidth
                  size="sm"
                  leftIcon={<Upload size={14} />}
                  onClick={() => setUploadOpen(true)}
                >
                  Upload Now
                </Button>
              ) : (
                <div className="flex gap-2">
                  {doc.extractedData && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      leftIcon={<Eye size={14} />}
                      onClick={() => openOcr(doc)}
                    >
                      View Data
                    </Button>
                  )}
                  {doc.status === "expired" && (
                    <Button
                      variant="amber"
                      size="sm"
                      className="flex-1"
                      leftIcon={<RefreshCw size={14} />}
                      onClick={() => setUploadOpen(true)}
                    >
                      Re-upload
                    </Button>
                  )}
                  <button className="w-8 h-8 flex items-center justify-center text-muted hover:text-danger transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Upload Modal */}
      <Modal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Upload Document"
        description="Supported formats: PDF, JPG, PNG (max 10 MB)"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-text mb-1.5 block">Document Type</label>
            <select className="input-base">
              <option value="">Select document type</option>
              {documents.filter((d) => d.status === "missing" || d.status === "expired").map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Drag & drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); }}
            className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
              dragging ? "border-primary bg-indigo-50" : "border-border hover:border-primary/50 hover:bg-bg"
            }`}
          >
            <Upload size={32} className="text-muted mx-auto mb-3" />
            <p className="font-semibold text-text mb-1">Drag & drop your file here</p>
            <p className="text-sm text-muted mb-4">or click to browse</p>
            <label className="cursor-pointer">
              <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
              <span className="px-4 py-2 bg-elevated rounded-xl text-sm font-medium text-text hover:bg-border transition-colors">
                Browse Files
              </span>
            </label>
          </div>

          <Button variant="primary" fullWidth leftIcon={<Upload size={16} />}>
            Upload & Extract Data
          </Button>
        </div>
      </Modal>

      {/* OCR Results Modal */}
      <Modal
        open={ocrOpen}
        onClose={() => setOcrOpen(false)}
        title={selectedDoc?.name || "Document Data"}
        description="Data auto-extracted via OCR from your document"
        size="md"
      >
        {selectedDoc?.extractedData && (
          <div className="space-y-2">
            {Object.entries(selectedDoc.extractedData).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <span className="text-sm text-muted">{key}</span>
                <span className="text-sm font-semibold text-text">{value}</span>
              </div>
            ))}
            <Button variant="primary" fullWidth className="mt-4">
              Use This Data for Applications
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
