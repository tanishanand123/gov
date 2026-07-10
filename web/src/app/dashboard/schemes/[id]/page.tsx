"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Bookmark, Share2, GraduationCap, Clock, ExternalLink,
  CheckCircle2, XCircle, FileText, Wallet, Landmark, Camera, Zap,
} from "lucide-react";

const TABS = ["About", "Eligibility", "Documents", "How to Apply"];

export default function SchemeDetailPage() {
  const [tab, setTab] = useState(0);

  return (
    <div>
      <div className="scheme-hero">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <Link href="/dashboard/schemes" className="btn btn-outline btn-sm"><ArrowLeft size={14} strokeWidth={2} /> Back to Schemes</Link>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-icon"><Bookmark size={16} strokeWidth={2} /></button>
            <button className="btn-icon"><Share2 size={16} strokeWidth={2} /></button>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 8, lineHeight: 1.2 }}>PM Scholarship Scheme for Central Armed Police Forces</div>
            <span className="category-chip cat-scholarship" style={{ marginBottom: 12, display: "inline-flex" }}><GraduationCap size={12} strokeWidth={2} /> Scholarship</span>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
              <span className="badge badge-eligible" style={{ fontSize: 13, padding: "6px 14px" }}>ELIGIBLE ✓</span>
              <span style={{ fontSize: 12, background: "#FEE2E2", color: "#DC2626", padding: "4px 10px", borderRadius: 8, display: "inline-flex", alignItems: "center", gap: 4 }}>
                <Clock size={12} strokeWidth={2} /> Apply by: Dec 31, 2026
              </span>
            </div>
            <div style={{ marginTop: 12, fontSize: 13, color: "var(--text-muted)" }}>
              <a href="#" className="link" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><ExternalLink size={13} strokeWidth={2} /> scholarship.gov.in</a>
            </div>
          </div>
          <div style={{ background: "rgba(99,102,241,0.1)", border: "1px solid #6366F1", borderRadius: 14, padding: "20px 24px", textAlign: "center", minWidth: 180 }}>
            <div style={{ fontSize: 28, fontWeight: 700 }} className="gradient-text">₹25,000</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>per year</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Annual Scholarship</div>
          </div>
        </div>
      </div>

      <div className="tabs">
        {TABS.map((t, i) => (
          <button key={t} className={`tab${tab === i ? " active" : ""}`} onClick={() => setTab(i)}>{t}</button>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ borderLeft: "3px solid #6366F1", paddingLeft: 10, marginBottom: 12 }}>About this Scheme</h3>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)" }}>
          The PM Scholarship Scheme for Central Armed Police Forces (CAPF) and Assam Rifles provides financial support to children and widows of CAPF personnel. The scholarship is awarded to meritorious students pursuing professional degree courses at recognised universities and institutions.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ borderLeft: "3px solid #10B981", paddingLeft: 10, marginBottom: 14 }}>Eligibility Criteria</h3>
        <div className="criteria-row match">
          <span className="criteria-label">Annual family income below ₹2,00,000</span>
          <span className="criteria-val" style={{ background: "#DCFCE7", color: "#16A34A" }}>Your: ₹1,80,000</span>
          <span style={{ display: "flex", color: "#16A34A" }}><CheckCircle2 size={16} strokeWidth={2} /></span>
        </div>
        <div className="criteria-row match">
          <span className="criteria-label">Age between 18–25 years</span>
          <span className="criteria-val" style={{ background: "#DCFCE7", color: "#16A34A" }}>Your: 21 years</span>
          <span style={{ display: "flex", color: "#16A34A" }}><CheckCircle2 size={16} strokeWidth={2} /></span>
        </div>
        <div className="criteria-row match">
          <span className="criteria-label">Must be enrolled in graduation or above</span>
          <span className="criteria-val" style={{ background: "#DCFCE7", color: "#16A34A" }}>B.Tech enrolled</span>
          <span style={{ display: "flex", color: "#16A34A" }}><CheckCircle2 size={16} strokeWidth={2} /></span>
        </div>
        <div className="criteria-row no-match">
          <span className="criteria-label">Caste Certificate required (SC/ST/OBC)</span>
          <span className="criteria-val" style={{ background: "#FEE2E2", color: "#DC2626" }}>Not uploaded</span>
          <span style={{ display: "flex", color: "#DC2626" }}><XCircle size={16} strokeWidth={2} /></span>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ borderLeft: "3px solid #06B6D4", paddingLeft: 10, marginBottom: 14 }}>Required Documents</h3>
        <div className="doc-check-row">
          <span style={{ display: "flex", color: "var(--text-muted)" }}><FileText size={16} strokeWidth={2} /></span>
          <span style={{ flex: 1, fontSize: 14 }}>Aadhaar Card</span>
          <span className="badge badge-verified">Uploaded ✓</span>
        </div>
        <div className="doc-check-row">
          <span style={{ display: "flex", color: "var(--text-muted)" }}><Wallet size={16} strokeWidth={2} /></span>
          <span style={{ flex: 1, fontSize: 14 }}>Income Certificate</span>
          <span className="badge badge-verified">Uploaded ✓</span>
        </div>
        <div className="doc-check-row">
          <span style={{ display: "flex", color: "var(--text-muted)" }}><Landmark size={16} strokeWidth={2} /></span>
          <span style={{ flex: 1, fontSize: 14 }}>Caste Certificate</span>
          <span className="badge badge-missing">Missing ✗</span>
          <Link href="/dashboard/vault" className="btn btn-outline btn-sm">Upload</Link>
        </div>
        <div className="doc-check-row">
          <span style={{ display: "flex", color: "var(--text-muted)" }}><Camera size={16} strokeWidth={2} /></span>
          <span style={{ flex: 1, fontSize: 14 }}>Passport Photo</span>
          <span className="badge badge-verified">Uploaded ✓</span>
        </div>
      </div>

      <div className="sticky-bottom">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="score-ring">92%</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>92% Match</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>1 document missing</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-outline">Apply on Govt Site →</button>
          <Link href="/dashboard/apply/pm-scholarship-capf" className="btn btn-primary">Apply via SmartGov <Zap size={14} strokeWidth={2} /></Link>
        </div>
      </div>
    </div>
  );
}
