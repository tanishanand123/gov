"use client";

import React, { useState } from "react";
import Link from "next/link";
import { photoUrl } from "@/lib/constants";
import {
  GraduationCap, Home as HomeIcon, HeartPulse, Wheat, Users, Laptop,
  Zap, SlidersHorizontal, LayoutGrid, Upload, Clock, CheckCircle2,
  type LucideIcon,
} from "lucide-react";

type SchemeStatus = "eligible" | "almost" | "not-eligible";

interface SchemeCard {
  id: string;
  cat: string; catIcon: LucideIcon; catLabel: string;
  status: SchemeStatus;
  applied?: boolean;
  title: string;
  ministry: string;
  image: string;
  benefit: string;
  match: number;
  docs?: { label: string; ok: boolean }[];
  unlockNote?: string;
  deadline: string; deadlineOk?: boolean;
}

const STATUS_LABEL: Record<SchemeStatus, string> = {
  eligible: "Eligible",
  almost: "Almost Eligible",
  "not-eligible": "Not Eligible",
};

function eligibilityTier(match: number): "high" | "mid" | "low" {
  if (match >= 80) return "high";
  if (match >= 45) return "mid";
  return "low";
}

const SCHEMES: SchemeCard[] = [
  {
    id: "pm-scholarship-capf", cat: "cat-scholarship", catIcon: GraduationCap, catLabel: "Scholarship", status: "eligible", applied: true,
    title: "PM Scholarship for CAPF", ministry: "Ministry of Home Affairs",
    image: "https://images.unsplash.com/photo-1617009762269-c062aaf6b3a0",
    benefit: "₹25,000 annual scholarship", match: 92,
    docs: [{ label: "Aadhaar", ok: true }, { label: "Income", ok: true }, { label: "Caste", ok: false }],
    deadline: "Closes: Dec 31, 2026",
  },
  {
    id: "pm-awas-gramin", cat: "cat-housing", catIcon: HomeIcon, catLabel: "Housing", status: "almost",
    title: "PM Awas Yojana Gramin", ministry: "Ministry of Rural Development",
    image: "https://images.unsplash.com/photo-1638379478172-7e6bb011ab05",
    benefit: "₹1,20,000 housing grant", match: 78,
    unlockNote: "Upload Caste Certificate to qualify",
    deadline: "",
  },
  {
    id: "ayushman-bharat", cat: "cat-health", catIcon: HeartPulse, catLabel: "Healthcare", status: "eligible", applied: true,
    title: "Ayushman Bharat PM-JAY", ministry: "Ministry of Health & Family Welfare",
    image: "https://images.unsplash.com/photo-1698465281093-9f09159733b9",
    benefit: "₹5,00,000/year health cover", match: 85,
    docs: [{ label: "Aadhaar", ok: true }, { label: "Income", ok: true }],
    deadline: "Always Open", deadlineOk: true,
  },
  {
    id: "pm-kisan", cat: "cat-agri", catIcon: Wheat, catLabel: "Agriculture", status: "eligible", applied: true,
    title: "PM-KISAN Samman Nidhi", ministry: "Ministry of Agriculture",
    image: "https://images.unsplash.com/photo-1623211269755-569fec0536d2",
    benefit: "₹6,000/year (3 installments)", match: 88,
    deadline: "",
  },
  {
    id: "beti-bachao", cat: "cat-women", catIcon: Users, catLabel: "Women", status: "almost", applied: true,
    title: "Beti Bachao Beti Padhao", ministry: "WCD Ministry",
    image: "https://images.unsplash.com/photo-1550780740-828b14c1925a",
    benefit: "Educational support grant", match: 65,
    deadline: "",
  },
  {
    id: "digital-skill-india", cat: "cat-skills", catIcon: Laptop, catLabel: "Skills", status: "eligible",
    title: "PM Digital Skill India", ministry: "Ministry of Skill Development",
    image: "https://images.unsplash.com/photo-1770627016447-cb9d29ed0398",
    benefit: "Free certification + ₹8,000 stipend", match: 91,
    deadline: "",
  },
  {
    id: "sukanya-samriddhi", cat: "cat-women", catIcon: Users, catLabel: "Women", status: "not-eligible",
    title: "Sukanya Samriddhi Yojana", ministry: "Ministry of Finance",
    image: "https://images.unsplash.com/photo-1674278882093-3870ef98e826",
    benefit: "High-interest savings for girl child", match: 20,
    unlockNote: "Only available for girl children under 10 years",
    deadline: "",
  },
];

const FILTERS: { key: "all" | SchemeStatus | "applied"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "eligible", label: "Eligible" },
  { key: "almost", label: "Almost" },
  { key: "not-eligible", label: "Not Eligible" },
  { key: "applied", label: "Applied" },
];

export default function SchemesPage() {
  const [activeTab, setActiveTab] = useState(0);
  const activeKey = FILTERS[activeTab].key;
  const visibleSchemes = SCHEMES.filter((s) => {
    if (activeKey === "all") return true;
    if (activeKey === "applied") return !!s.applied;
    return s.status === activeKey;
  });

  return (
    <div>
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1>Eligible Schemes</h1>
            <p><span style={{ color: "#10B981" }}>●</span> {SCHEMES.length} schemes matched to your profile</p>
          </div>
          <Link href="/dashboard/apply" className="btn btn-primary"><Zap size={14} strokeWidth={2} /> Quick Apply</Link>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div className="tabs" style={{ margin: 0, border: "none" }}>
          {FILTERS.map((f, i) => {
            const count = f.key === "all" ? SCHEMES.length : f.key === "applied" ? SCHEMES.filter((s) => s.applied).length : SCHEMES.filter((s) => s.status === f.key).length;
            return (
              <button key={f.key} className={`tab${activeTab === i ? " active" : ""}`} onClick={() => setActiveTab(i)}>
                {f.label} ({count})
              </button>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-secondary btn-sm"><SlidersHorizontal size={14} strokeWidth={2} /> Filter</button>
          <select className="input" style={{ height: 36, width: "auto", fontSize: 13 }}>
            <option>Sort: Best Match</option>
            <option>Sort: Highest Benefit</option>
            <option>Sort: Deadline</option>
          </select>
          <button className="btn btn-secondary btn-sm"><LayoutGrid size={14} strokeWidth={2} /></button>
        </div>
      </div>

      {visibleSchemes.length === 0 && (
        <div className="card" style={{ textAlign: "center", color: "var(--text-muted)", padding: "32px 0" }}>
          No {FILTERS[activeTab].label.toLowerCase()} schemes.
        </div>
      )}

      <div className="grid-3">
        {visibleSchemes.map((s) => {
          const tier = eligibilityTier(s.match);
          return (
            <div key={s.id} className={`scheme-card ${s.status}`}>
              <div className="scheme-card-eligibility-bar">
                <div className={`scheme-card-eligibility-fill ${tier}`} style={{ width: `${s.match}%` }} />
              </div>
              <div className="scheme-card-img-wrap">
                <img className="scheme-card-img" src={photoUrl(s.image, 500)} alt="" />
              </div>
              <div className="scheme-card-body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, gap: 8 }}>
                  <span className={`category-chip ${s.cat}`}><s.catIcon size={12} strokeWidth={2} /> {s.catLabel}</span>
                  <span className={`status-badge ${s.status}`}>{STATUS_LABEL[s.status]}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>{s.ministry}</div>
                <div style={{ fontSize: 14, color: "var(--text-primary)", fontWeight: 700, marginBottom: 4 }}>{s.benefit}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>{s.match}% eligibility match</div>

                {s.docs && (
                  <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                    {s.docs.map((d) => (
                      <span key={d.label} className={`badge ${d.ok ? "badge-eligible" : "badge-missing"}`} style={{ fontSize: 11 }}>
                        {d.label} {d.ok ? "✓" : "✗"}
                      </span>
                    ))}
                  </div>
                )}
                {s.unlockNote && (
                  <div className="badge badge-almost" style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 12, fontWeight: 500 }}>
                    <Upload size={12} strokeWidth={2} /> {s.unlockNote}
                  </div>
                )}
                {s.deadline && (
                  <div className={`badge ${s.deadlineOk ? "badge-eligible" : "badge-missing"}`} style={{ marginBottom: 12, display: "inline-flex", alignItems: "center", gap: 4 }}>
                    {s.deadlineOk ? <CheckCircle2 size={12} strokeWidth={2} /> : <Clock size={12} strokeWidth={2} />} {s.deadline}
                  </div>
                )}

                <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                  <Link href={`/dashboard/schemes/${s.id}`} className="btn btn-outline btn-sm btn-full">View Details</Link>
                  {s.status === "eligible" && (
                    <Link href={`/dashboard/apply/${s.id}`} className="btn btn-primary btn-sm btn-full">Apply Now</Link>
                  )}
                  {s.status === "almost" && (
                    <Link href="/dashboard/vault" className="btn btn-sm btn-full" style={{ background: "var(--text-primary)", color: "var(--bg-secondary)" }}>Upload to Unlock</Link>
                  )}
                  {s.status === "not-eligible" && (
                    <button className="btn btn-outline btn-sm btn-full" disabled>Not Eligible</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
