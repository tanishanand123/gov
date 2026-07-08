"use client";

import React, { useState } from "react";

interface SchemeRow {
  id: string;
  name: string;
  chip: string;
  active: boolean;
  applications: string;
  updated: string;
}

const INITIAL: SchemeRow[] = [
  { id: "1", name: "PM Scholarship Scheme for CAPF", chip: "🎓 Scholarship", active: true, applications: "1,204", updated: "Jun 20, 2026" },
  { id: "2", name: "PM Awas Yojana Gramin", chip: "🏠 Housing", active: true, applications: "8,901", updated: "Jun 15, 2026" },
  { id: "3", name: "Ayushman Bharat PM-JAY", chip: "❤️ Healthcare", active: true, applications: "24,567", updated: "Jun 25, 2026" },
  { id: "4", name: "PM-KISAN Samman Nidhi", chip: "🌾 Agriculture", active: true, applications: "1,02,304", updated: "Jun 1, 2026" },
  { id: "5", name: "Beti Bachao Beti Padhao", chip: "👩 Women", active: false, applications: "3,210", updated: "May 10, 2026" },
];

export default function AdminSchemesPage() {
  const [rows, setRows] = useState(INITIAL);

  const toggleActive = (id: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r)));
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#F1F5F9" }}>Schemes Management</h1>
          <p style={{ color: "#64748B" }}>Manage all government scheme listings</p>
        </div>
        <button className="btn btn-primary">+ Add New Scheme</button>
      </div>

      <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 12, display: "flex", alignItems: "center", padding: "0 14px", gap: 8, height: 44, marginBottom: 20, maxWidth: 400 }}>
        <span style={{ color: "#64748B" }}>🔍</span>
        <input type="text" placeholder="Search schemes..." style={{ border: "none", background: "transparent", color: "#F1F5F9", fontSize: 14, outline: "none", flex: 1, fontFamily: "inherit" }} />
      </div>

      <div style={{ background: "#1E293B", borderRadius: 16, border: "1px solid #334155", overflow: "hidden" }}>
        <table className="admin-table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Scheme Name</th>
              <th>Category</th>
              <th>Status</th>
              <th>Applications</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td style={{ color: "#F1F5F9", fontWeight: 500 }}>{r.name}</td>
                <td><span className="admin-chip">{r.chip}</span></td>
                <td><span className={`admin-badge ${r.active ? "active-badge" : "inactive-badge"}`}>● {r.active ? "Active" : "Paused"}</span></td>
                <td style={{ color: "#94A3B8" }}>{r.applications}</td>
                <td style={{ color: "#64748B" }}>{r.updated}</td>
                <td style={{ display: "flex", gap: 8, paddingTop: 14 }}>
                  <button className="btn-icon" style={{ background: "#1E1B4B", color: "#818CF8" }}>✏️</button>
                  <button className={`toggle${r.active ? " on" : ""}`} style={{ transform: "scale(0.85)" }} onClick={() => toggleActive(r.id)} />
                  <button className="btn-icon" style={{ color: "#EF4444", background: "transparent" }}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
