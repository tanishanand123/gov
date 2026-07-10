"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Landmark, GraduationCap, Home as HomeIcon, HeartPulse, Wheat,
  Target, FileText, CheckCircle2, AlertTriangle, Sparkles, ChevronRight,
} from "lucide-react";

const MATCHES = [
  {
    id: "pm-scholarship-capf",
    cat: "cat-scholarship", catIcon: GraduationCap, catLabel: "Scholarship",
    match: 92, matchColor: "green",
    title: "PM Scholarship Scheme for Central Armed Police Forces",
    amount: "₹25,000 / year", amountColor: "#10B981",
    ministry: "Ministry of Home Affairs",
    tag: "Closes Dec 31", tagBg: "#FEE2E2", tagColor: "#DC2626",
    cta: "Apply →", ctaStyle: "primary",
  },
  {
    id: "pm-awas-gramin",
    cat: "cat-housing", catIcon: HomeIcon, catLabel: "Housing",
    match: 78, matchColor: "amber",
    title: "PM Awas Yojana — Gramin",
    amount: "₹1,20,000 housing grant", amountColor: "#F59E0B",
    ministry: "Ministry of Rural Development",
    tag: "Upload to Unlock", tagBg: "#FEF9C3", tagColor: "#CA8A04",
    cta: "Unlock →", ctaStyle: "amber",
  },
  {
    id: "ayushman-bharat",
    cat: "cat-health", catIcon: HeartPulse, catLabel: "Healthcare",
    match: 85, matchColor: "green",
    title: "Ayushman Bharat PM-JAY Health Cover",
    amount: "₹5,00,000 / year health cover", amountColor: "#10B981",
    ministry: "Ministry of Health",
    tag: "Open", tagBg: "#FEE2E2", tagColor: "#DC2626",
    cta: "Apply →", ctaStyle: "primary",
  },
  {
    id: "pm-kisan",
    cat: "cat-agri", catIcon: Wheat, catLabel: "Agriculture",
    match: 88, matchColor: "green",
    title: "PM-KISAN Samman Nidhi",
    amount: "₹6,000 / year (3 installments)", amountColor: "#10B981",
    ministry: "Ministry of Agriculture",
    tag: "Open", tagBg: "#FEE2E2", tagColor: "#DC2626",
    cta: "Apply →", ctaStyle: "primary",
  },
];

export default function DashboardHome() {
  const { data: session } = useSession();
  const firstName = (session?.user?.name || "there").split(" ")[0];

  return (
    <div>
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div>
          <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 6 }}>Good morning, {firstName}!</div>
          <div style={{ opacity: 0.9, fontSize: 14 }}>You have <strong>3 new eligible schemes</strong> and <strong>1 document expiring soon</strong>.</div>
        </div>
        <div style={{ opacity: 0.2, position: "absolute", right: 32, top: 10 }}><Landmark size={80} strokeWidth={1.2} /></div>
      </div>

      {/* Profile Completion */}
      <div className="card card-sm flex items-center justify-between" style={{ marginBottom: 20 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Complete your profile</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 10 }}>72% complete — add Caste Certificate to unlock 3 more schemes</div>
          <div className="progress-wrap"><div className="progress-bar" style={{ width: "72%" }} /></div>
        </div>
        <Link href="/dashboard/profile" className="btn btn-outline btn-sm" style={{ marginLeft: 20, whiteSpace: "nowrap" }}>Complete Now →</Link>
      </div>

      {/* Stats Row */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "linear-gradient(135deg,#6366F1,#4338CA)" }}><Target size={18} strokeWidth={2} color="#fff" /></div>
          <div className="stat-value gradient-text">12</div>
          <div className="stat-label">Eligible Schemes</div>
          <div className="stat-delta" style={{ color: "#10B981" }}>+3 new this week</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "linear-gradient(135deg,#06B6D4,#0891B2)" }}><FileText size={18} strokeWidth={2} color="#fff" /></div>
          <div className="stat-value" style={{ color: "#06B6D4" }}>4/7</div>
          <div className="stat-label">Documents Uploaded</div>
          <div className="stat-delta" style={{ color: "#F59E0B" }}>3 missing</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "linear-gradient(135deg,#10B981,#059669)" }}><CheckCircle2 size={18} strokeWidth={2} color="#fff" /></div>
          <div className="stat-value" style={{ color: "#10B981" }}>2</div>
          <div className="stat-label">Applications Submitted</div>
          <div className="stat-delta" style={{ color: "var(--text-muted)" }}>1 in review</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "linear-gradient(135deg,#F87171,#EF4444)" }}><AlertTriangle size={18} strokeWidth={2} color="#fff" /></div>
          <div className="stat-value" style={{ color: "#EF4444" }}>3</div>
          <div className="stat-label">Action Required</div>
          <div className="stat-delta"><Link className="link" href="/dashboard/notifications">View alerts →</Link></div>
        </div>
      </div>

      {/* Top Matches */}
      <div className="section-header">
        <div className="section-title">Your Top Matches</div>
        <Link className="link" style={{ fontSize: 13 }} href="/dashboard/schemes">View All →</Link>
      </div>
      <div className="hscroll" style={{ marginBottom: 24 }}>
        {MATCHES.map((m) => (
          <div key={m.id} className={`match-card ${m.matchColor === "green" ? "eligible" : "almost"}`}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span className={`category-chip ${m.cat}`}><m.catIcon size={12} strokeWidth={2} /> {m.catLabel}</span>
              <span className="badge" style={{ background: m.matchColor === "green" ? "linear-gradient(135deg,#10B981,#059669)" : "linear-gradient(135deg,#F59E0B,#D97706)", color: "#fff", borderRadius: 50, fontSize: 11 }}>{m.match}% match</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>{m.title}</div>
            <div style={{ fontSize: 14, color: m.amountColor, fontWeight: 600, marginBottom: 4 }}>{m.amount}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>{m.ministry}</div>
            <div className="progress-wrap" style={{ marginBottom: 10 }}><div className={`progress-bar ${m.matchColor}`} style={{ width: `${m.match}%`, height: 6 }} /></div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, background: m.tagBg, color: m.tagColor, padding: "3px 8px", borderRadius: 6 }}>{m.tag}</span>
              <Link href={`/dashboard/schemes/${m.id}`} className={`btn btn-sm ${m.ctaStyle === "primary" ? "btn-primary" : ""}`} style={m.ctaStyle === "amber" ? { background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#fff" } : undefined}>
                {m.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div className="section-title" style={{ marginBottom: 16 }}>Action Required</div>
      <div className="alert-item warn">
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center", color: "#B45309" }}><AlertTriangle size={16} strokeWidth={2} /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Aadhaar Card expiring soon</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Valid until Jan 2027 — renew to keep 4 schemes active</div>
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>2 days ago</div>
        <span style={{ color: "var(--text-muted)", display: "flex" }}><ChevronRight size={16} strokeWidth={2} /></span>
      </div>
      <div className="alert-item danger">
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center", color: "#DC2626" }}><FileText size={16} strokeWidth={2} /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Caste Certificate missing</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Required for PM Scholarship — blocks ₹25,000 benefit</div>
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>1 week ago</div>
        <span style={{ color: "var(--text-muted)", display: "flex" }}><ChevronRight size={16} strokeWidth={2} /></span>
      </div>
      <div className="alert-item info">
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", color: "#4F46E5" }}><Sparkles size={16} strokeWidth={2} /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>3 new schemes matched your profile</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Digital Skill India, MNREGA, and 1 more added</div>
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Today</div>
        <span style={{ color: "var(--text-muted)", display: "flex" }}><ChevronRight size={16} strokeWidth={2} /></span>
      </div>
    </div>
  );
}
