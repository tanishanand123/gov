"use client";

import React, { useState } from "react";

interface DocRow {
  id: string;
  icon: string;
  title: string;
  meta: string;
  note?: string;
  noteColor?: string;
  status?: "approved" | "rejected";
}

const INITIAL: DocRow[] = [
  { id: "1", icon: "🪪", title: "Rahul Kumar — Caste Certificate", meta: "Submitted 2 hours ago • PDF • 1.2 MB", note: "OBC Certificate — Uttar Pradesh", noteColor: "#818CF8" },
  { id: "2", icon: "💰", title: "Priya Singh — Income Certificate", meta: "Submitted 5 hours ago • JPG • 850 KB", note: "FY 2025–26 — Maharashtra", noteColor: "#818CF8" },
  { id: "3", icon: "🏛", title: "Arjun Mishra — Domicile Certificate", meta: "Submitted 3 days ago • PDF • 2.1 MB", note: "⚠️ Low image quality — may need re-upload", noteColor: "#F59E0B" },
];

export default function AdminVerificationsPage() {
  const [rows, setRows] = useState(INITIAL);

  const setStatus = (id: string, status: "approved" | "rejected") => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#F1F5F9" }}>Document Verification Queue</h1>
        <p style={{ color: "#64748B" }}>{rows.filter((r) => !r.status).length} documents pending review</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {rows.map((doc) => (
          <div
            key={doc.id}
            style={{
              background: "#1E293B", borderRadius: 14, padding: 20, display: "flex", alignItems: "center", gap: 16,
              border: `1px solid ${doc.status === "approved" ? "#10B981" : doc.status === "rejected" ? "#EF4444" : "#334155"}`,
              opacity: doc.status ? 0.6 : 1,
            }}
          >
            <div style={{ width: 80, height: 80, borderRadius: 10, background: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, border: "1px solid #334155", flexShrink: 0 }}>
              {doc.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#F1F5F9", marginBottom: 4 }}>{doc.title}</div>
              <div style={{ fontSize: 13, color: "#64748B" }}>{doc.meta}</div>
              {doc.note && <div style={{ fontSize: 12, color: doc.noteColor, marginTop: 4 }}>{doc.note}</div>}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-success btn-sm" disabled={!!doc.status} onClick={() => setStatus(doc.id, "approved")}>
                {doc.status === "approved" ? "✓ Approved" : "✅ Approve"}
              </button>
              <button className="btn btn-outline btn-sm" style={{ borderColor: "#EF4444", color: "#EF4444" }} disabled={!!doc.status} onClick={() => setStatus(doc.id, "rejected")}>
                {doc.status === "rejected" ? "✕ Rejected" : "✕ Reject"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
