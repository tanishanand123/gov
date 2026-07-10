"use client";

import React, { useState } from "react";
import { Search, Pencil, Trash2, GraduationCap, Home as HomeIcon, HeartPulse, Wheat, Users, type LucideIcon } from "lucide-react";

interface SchemeRow {
  id: string;
  name: string;
  chipIcon: LucideIcon;
  chipLabel: string;
  active: boolean;
  applications: string;
  updated: string;
}

const INITIAL: SchemeRow[] = [
  { id: "1", name: "PM Scholarship Scheme for CAPF", chipIcon: GraduationCap, chipLabel: "Scholarship", active: true, applications: "1,204", updated: "Jun 20, 2026" },
  { id: "2", name: "PM Awas Yojana Gramin", chipIcon: HomeIcon, chipLabel: "Housing", active: true, applications: "8,901", updated: "Jun 15, 2026" },
  { id: "3", name: "Ayushman Bharat PM-JAY", chipIcon: HeartPulse, chipLabel: "Healthcare", active: true, applications: "24,567", updated: "Jun 25, 2026" },
  { id: "4", name: "PM-KISAN Samman Nidhi", chipIcon: Wheat, chipLabel: "Agriculture", active: true, applications: "1,02,304", updated: "Jun 1, 2026" },
  { id: "5", name: "Beti Bachao Beti Padhao", chipIcon: Users, chipLabel: "Women", active: false, applications: "3,210", updated: "May 10, 2026" },
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
        <Search size={16} strokeWidth={2} color="#64748B" />
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
                <td><span className="admin-chip" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><r.chipIcon size={12} strokeWidth={2} /> {r.chipLabel}</span></td>
                <td><span className={`admin-badge ${r.active ? "active-badge" : "inactive-badge"}`}>● {r.active ? "Active" : "Paused"}</span></td>
                <td style={{ color: "#94A3B8" }}>{r.applications}</td>
                <td style={{ color: "#64748B" }}>{r.updated}</td>
                <td style={{ display: "flex", gap: 8, paddingTop: 14 }}>
                  <button className="btn-icon" style={{ background: "#1E1B4B", color: "#818CF8" }}><Pencil size={14} strokeWidth={2} /></button>
                  <button className={`toggle${r.active ? " on" : ""}`} style={{ transform: "scale(0.85)" }} onClick={() => toggleActive(r.id)} />
                  <button className="btn-icon" style={{ color: "#EF4444", background: "transparent" }}><Trash2 size={14} strokeWidth={2} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
