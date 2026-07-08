"use client";

import React, { useState } from "react";

interface AppRow {
  id: string;
  status: "approved" | "review" | "rejected";
  title: string;
  ministry: string;
  appliedOn: string;
  submissionId: string;
  badgeLabel: string;
  cta: string;
}

const APPS: AppRow[] = [
  { id: "1", status: "approved", title: "Ayushman Bharat PM-JAY", ministry: "Ministry of Health", appliedOn: "15 Jan 2026", submissionId: "#SGov-2026-00089", badgeLabel: "Approved ✓", cta: "View Details" },
  { id: "2", status: "review", title: "PM Scholarship for CAPF", ministry: "Ministry of Home Affairs", appliedOn: "20 Feb 2026", submissionId: "#SGov-2026-00123", badgeLabel: "Under Review", cta: "Track Status" },
  { id: "3", status: "approved", title: "PM-KISAN Samman Nidhi", ministry: "Ministry of Agriculture", appliedOn: "10 Dec 2025", submissionId: "#SGov-2025-00456", badgeLabel: "Approved ✓", cta: "View Details" },
  { id: "4", status: "rejected", title: "Beti Bachao Beti Padhao", ministry: "WCD Ministry", appliedOn: "5 Nov 2025", submissionId: "#SGov-2025-00312", badgeLabel: "Rejected ✗", cta: "Re-apply" },
];

const TABS = ["All (4)", "Pending (1)", "Approved (2)", "Rejected (1)"];

const BADGE_CLASS: Record<AppRow["status"], string> = {
  approved: "badge-eligible",
  review: "badge-processing",
  rejected: "badge-missing",
};

export default function ApplicationsPage() {
  const [tab, setTab] = useState(0);

  return (
    <div>
      <div className="page-header">
        <h1>My Applications</h1>
        <p>Track all your scheme applications</p>
      </div>
      <div className="tabs">
        {TABS.map((t, i) => (
          <button key={t} className={`tab${tab === i ? " active" : ""}`} onClick={() => setTab(i)}>{t}</button>
        ))}
      </div>
      <div>
        {APPS.map((a) => (
          <div key={a.id} className={`app-card ${a.status}`}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{a.title}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{a.ministry} • Applied {a.appliedOn}</div>
              <div style={{ fontSize: 12, marginTop: 4, background: "var(--surface-elevated)", padding: "3px 8px", borderRadius: 6, display: "inline-block", fontFamily: "monospace" }}>{a.submissionId}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <span className={`badge ${BADGE_CLASS[a.status]}`} style={{ fontSize: 12, marginBottom: 8, display: "block" }}>{a.badgeLabel}</span>
              <button className="btn btn-outline btn-sm">{a.cta}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
