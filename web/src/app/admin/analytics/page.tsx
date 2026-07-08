"use client";

import React from "react";

const GROWTH_BARS = [40, 55, 45, 70, 60, 80, 100];
const GROWTH_LABELS = ["Jun 18", "Jun 19", "Jun 20", "Jun 21", "Jun 22", "Jun 24", "Jun 25"];

const CATEGORIES = [
  { label: "Scholarship", pct: 38, bg: "linear-gradient(to right,#6366F1,#4338CA)" },
  { label: "Healthcare", pct: 27, bg: "linear-gradient(to right,#10B981,#059669)" },
  { label: "Housing", pct: 20, bg: "linear-gradient(to right,#F59E0B,#D97706)" },
  { label: "Agriculture", pct: 15, bg: "linear-gradient(to right,#06B6D4,#0891B2)" },
];

const TOP_STATES = [
  { rank: 1, name: "Uttar Pradesh", users: "3,210 users" },
  { rank: 2, name: "Maharashtra", users: "1,890 users" },
  { rank: 3, name: "Bihar", users: "1,203 users" },
  { rank: 4, name: "West Bengal", users: "980 users" },
  { rank: 5, name: "Tamil Nadu", users: "870 users" },
];

const KPIS = [
  { label: "Avg. profile completion", val: "68%", color: "#10B981" },
  { label: "Auto-fill success rate", val: "82%", color: "#10B981" },
  { label: "Application approval rate", val: "74%", color: "#10B981" },
  { label: "Avg. time to apply", val: "4.8 min", color: "#818CF8" },
  { label: "Document OCR accuracy", val: "91%", color: "#10B981" },
];

export default function AdminAnalyticsPage() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#F1F5F9" }}>Analytics</h1>
        <p style={{ color: "#64748B" }}>Platform performance — Last 30 days</p>
      </div>
      <div className="grid-2" style={{ gap: 20 }}>
        <div className="admin-stat-card" style={{ padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#F1F5F9", marginBottom: 16 }}>User Growth</div>
          <div style={{ height: 120, background: "linear-gradient(180deg,rgba(99,102,241,0.3) 0%,transparent 100%)", borderRadius: 10, display: "flex", alignItems: "flex-end", padding: 10, gap: 4 }}>
            {GROWTH_BARS.map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1, borderRadius: "4px 4px 0 0", height: `${h}%`,
                  background: i === GROWTH_BARS.length - 1 ? "linear-gradient(to top,#6366F1,#06B6D4)" : "rgba(99,102,241,0.7)",
                }}
              />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748B", marginTop: 6 }}>
            {GROWTH_LABELS.map((l) => <span key={l}>{l}</span>)}
          </div>
        </div>

        <div className="admin-stat-card" style={{ padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#F1F5F9", marginBottom: 16 }}>Applications by Category</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {CATEGORIES.map((c) => (
              <div key={c.label}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#94A3B8", marginBottom: 4 }}>
                  <span>{c.label}</span><span>{c.pct}%</span>
                </div>
                <div className="progress-wrap"><div style={{ height: 8, borderRadius: 4, background: c.bg, width: `${c.pct}%` }} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-stat-card" style={{ padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#F1F5F9", marginBottom: 16 }}>Top States by Usage</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {TOP_STATES.map((s) => (
              <div key={s.rank} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#94A3B8" }}>
                <span style={{ width: 20, textAlign: "center" }}>{s.rank}</span>
                <span style={{ flex: 1 }}>{s.name}</span>
                <span style={{ color: "#818CF8", fontWeight: 600 }}>{s.users}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-stat-card" style={{ padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#F1F5F9", marginBottom: 16 }}>Platform KPIs</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {KPIS.map((k) => (
              <div key={k.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: "#64748B" }}>{k.label}</span>
                <span style={{ color: k.color, fontWeight: 600 }}>{k.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
