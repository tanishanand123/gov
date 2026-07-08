"use client";

import React, { useState } from "react";
import Link from "next/link";

interface SchemeCard {
  id: string;
  cat: string; catIcon: string; catLabel: string;
  status: "eligible" | "almost";
  title: string;
  ministry: string;
  benefit: string; benefitColor: string;
  match: number; matchColor: "green" | "amber";
  docs?: { label: string; ok: boolean }[];
  unlockNote?: string;
  deadline: string; deadlineOk?: boolean;
}

const SCHEMES: SchemeCard[] = [
  {
    id: "pm-scholarship-capf", cat: "cat-scholarship", catIcon: "🎓", catLabel: "Scholarship", status: "eligible",
    title: "PM Scholarship for CAPF", ministry: "Ministry of Home Affairs",
    benefit: "₹25,000 annual scholarship", benefitColor: "#10B981", match: 92, matchColor: "green",
    docs: [{ label: "Aadhaar", ok: true }, { label: "Income", ok: true }, { label: "Caste", ok: false }],
    deadline: "Closes: Dec 31, 2026",
  },
  {
    id: "pm-awas-gramin", cat: "cat-housing", catIcon: "🏠", catLabel: "Housing", status: "almost",
    title: "PM Awas Yojana Gramin", ministry: "Ministry of Rural Development",
    benefit: "₹1,20,000 housing grant", benefitColor: "#F59E0B", match: 78, matchColor: "amber",
    unlockNote: "📤 Upload Caste Certificate to qualify",
    deadline: "",
  },
  {
    id: "ayushman-bharat", cat: "cat-health", catIcon: "❤️", catLabel: "Healthcare", status: "eligible",
    title: "Ayushman Bharat PM-JAY", ministry: "Ministry of Health & Family Welfare",
    benefit: "₹5,00,000/year health cover", benefitColor: "#10B981", match: 85, matchColor: "green",
    docs: [{ label: "Aadhaar", ok: true }, { label: "Income", ok: true }],
    deadline: "✅ Always Open", deadlineOk: true,
  },
  {
    id: "pm-kisan", cat: "cat-agri", catIcon: "🌾", catLabel: "Agriculture", status: "eligible",
    title: "PM-KISAN Samman Nidhi", ministry: "Ministry of Agriculture",
    benefit: "₹6,000/year (3 installments)", benefitColor: "#10B981", match: 88, matchColor: "green",
    deadline: "",
  },
  {
    id: "beti-bachao", cat: "cat-women", catIcon: "👩", catLabel: "Women", status: "almost",
    title: "Beti Bachao Beti Padhao", ministry: "WCD Ministry",
    benefit: "Educational support grant", benefitColor: "#F59E0B", match: 65, matchColor: "amber",
    deadline: "",
  },
  {
    id: "digital-skill-india", cat: "cat-scholarship", catIcon: "💻", catLabel: "Skills", status: "eligible",
    title: "PM Digital Skill India", ministry: "Ministry of Skill Development",
    benefit: "Free certification + ₹8,000 stipend", benefitColor: "#10B981", match: 91, matchColor: "green",
    deadline: "",
  },
];

const TABS = ["All (12)", "Eligible (8)", "Almost (4)", "Applied (2)"];

export default function SchemesPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1>Eligible Schemes</h1>
            <p><span style={{ color: "#10B981" }}>●</span> 12 schemes matched to your profile</p>
          </div>
          <Link href="/dashboard/apply" className="btn btn-primary">⚡ Quick Apply</Link>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div className="tabs" style={{ margin: 0, border: "none" }}>
          {TABS.map((t, i) => (
            <button key={t} className={`tab${activeTab === i ? " active" : ""}`} onClick={() => setActiveTab(i)}>{t}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-secondary btn-sm">⚙ Filter</button>
          <select className="input" style={{ height: 36, width: "auto", fontSize: 13 }}>
            <option>Sort: Best Match</option>
            <option>Sort: Highest Benefit</option>
            <option>Sort: Deadline</option>
          </select>
          <button className="btn btn-secondary btn-sm">⊞</button>
        </div>
      </div>

      <div className="grid-3">
        {SCHEMES.map((s) => (
          <div key={s.id} className="card" style={{ borderLeft: `4px solid ${s.status === "eligible" ? "#10B981" : "#F59E0B"}`, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span className={`category-chip ${s.cat}`}>{s.catIcon} {s.catLabel}</span>
              <span>🔖</span>
            </div>
            <span className={`badge ${s.status === "eligible" ? "badge-eligible" : "badge-almost"}`} style={{ marginBottom: 8 }}>
              {s.status === "eligible" ? "ELIGIBLE ✓" : "ALMOST ELIGIBLE"}
            </span>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{s.title}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic", marginBottom: 6 }}>{s.ministry}</div>
            <div style={{ fontSize: 14, color: s.benefitColor, fontWeight: 600, marginBottom: 10 }}>{s.benefit}</div>
            <div className="progress-wrap" style={{ marginBottom: 10 }}><div className={`progress-bar ${s.matchColor}`} style={{ width: `${s.match}%` }} /></div>
            <div style={{ fontSize: 12, textAlign: "right", color: s.matchColor === "green" ? "#10B981" : "#F59E0B", marginTop: -8, marginBottom: 10 }}>{s.match}%</div>

            {s.docs && (
              <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                {s.docs.map((d) => (
                  <span key={d.label} style={{ fontSize: 11, background: d.ok ? "#DCFCE7" : "#FEE2E2", color: d.ok ? "#16A34A" : "#DC2626", padding: "2px 8px", borderRadius: 6 }}>
                    {d.label} {d.ok ? "✓" : "✗"}
                  </span>
                ))}
              </div>
            )}
            {s.unlockNote && (
              <div style={{ fontSize: 12, background: "#FEF9C3", color: "#CA8A04", padding: "6px 10px", borderRadius: 8, marginBottom: 12 }}>{s.unlockNote}</div>
            )}
            {s.deadline && (
              <div style={{ fontSize: 11, color: s.deadlineOk ? "#16A34A" : "#DC2626", background: s.deadlineOk ? "#DCFCE7" : "#FEE2E2", padding: "4px 8px", borderRadius: 6, marginBottom: 12, display: "inline-block" }}>
                {s.deadlineOk ? "" : "⏰ "}{s.deadline}
              </div>
            )}

            <div style={{ display: "flex", gap: 8 }}>
              <Link href={`/dashboard/schemes/${s.id}`} className="btn btn-outline btn-sm btn-full">View Details</Link>
              {s.status === "eligible" ? (
                <Link href={`/dashboard/apply/${s.id}`} className="btn btn-primary btn-sm btn-full">Apply Now</Link>
              ) : (
                <Link href="/dashboard/vault" className="btn btn-sm btn-full" style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#fff" }}>Upload to Unlock</Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
