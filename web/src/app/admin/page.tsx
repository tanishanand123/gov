"use client";

import React from "react";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#F1F5F9" }}>Admin Dashboard</h1>
        <p style={{ color: "#64748B" }}>Real-time platform overview — Jul 8, 2026</p>
      </div>

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="admin-stat-card">
          <div className="stat-icon" style={{ background: "linear-gradient(135deg,#6366F1,#4338CA)" }}>👥</div>
          <div className="admin-stat-val gradient-text">10,482</div>
          <div className="admin-stat-label">Daily Active Users</div>
          <div className="sparkline" />
          <div style={{ fontSize: 12, color: "#10B981", marginTop: 6 }}>↑ +12% from yesterday</div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon" style={{ background: "linear-gradient(135deg,#10B981,#059669)" }}>✅</div>
          <div className="admin-stat-val" style={{ color: "#10B981" }}>342</div>
          <div className="admin-stat-label">Applications Today</div>
          <div className="sparkline" style={{ background: "linear-gradient(180deg,rgba(16,185,129,0.2) 0%,transparent 100%)" }} />
          <div style={{ fontSize: 12, color: "#10B981", marginTop: 6 }}>↑ +8% from yesterday</div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon" style={{ background: "linear-gradient(135deg,#06B6D4,#0891B2)" }}>📄</div>
          <div className="admin-stat-val" style={{ color: "#06B6D4" }}>218</div>
          <div className="admin-stat-label">Documents Uploaded</div>
          <div className="sparkline" style={{ background: "linear-gradient(180deg,rgba(6,182,212,0.2) 0%,transparent 100%)" }} />
          <div style={{ fontSize: 12, color: "#F59E0B", marginTop: 6 }}>47 pending verification</div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon" style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}>⏳</div>
          <div className="admin-stat-val" style={{ color: "#F59E0B" }}>47</div>
          <div className="admin-stat-label">Pending Verifications</div>
          <div className="sparkline" style={{ background: "linear-gradient(180deg,rgba(245,158,11,0.2) 0%,transparent 100%)" }} />
          <div style={{ fontSize: 12, color: "#EF4444", marginTop: 6 }}>Oldest: 3 days ago</div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon" style={{ background: "linear-gradient(135deg,#EC4899,#DB2777)" }}>🆕</div>
          <div className="admin-stat-val" style={{ color: "#EC4899" }}>138</div>
          <div className="admin-stat-label">New Users Today</div>
          <div className="sparkline" style={{ background: "linear-gradient(180deg,rgba(236,72,153,0.2) 0%,transparent 100%)" }} />
          <div style={{ fontSize: 12, color: "#10B981", marginTop: 6 }}>↑ +23% from last week</div>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: "#F1F5F9", marginBottom: 12 }}>Quick Actions</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/admin/schemes" className="btn btn-primary">+ Add New Scheme</Link>
          <Link href="/admin/verifications" className="btn btn-secondary" style={{ background: "#1E293B", color: "#818CF8", border: "1px solid #334155" }}>Process Document Queue (47)</Link>
          <Link href="/admin/settings" className="btn btn-outline" style={{ borderColor: "#334155", color: "#94A3B8" }}>📢 Send Bulk Notification</Link>
        </div>
      </div>

      <div style={{ background: "#1E293B", borderRadius: 16, border: "1px solid #334155", padding: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: "#F1F5F9", marginBottom: 16 }}>Recent Activity</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 10, borderRadius: 10, background: "rgba(99,102,241,0.06)" }}>
            <span style={{ fontSize: 18 }}>📄</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: "#F1F5F9", fontWeight: 500 }}>New document submitted — Rahul Kumar (Caste Cert)</div>
              <div style={{ fontSize: 11, color: "#64748B" }}>2 mins ago</div>
            </div>
            <button className="btn btn-sm" style={{ background: "#10B981", color: "#fff", borderRadius: 8 }}>Approve</button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 10, borderRadius: 10 }}>
            <span style={{ fontSize: 18 }}>✅</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: "#F1F5F9", fontWeight: 500 }}>Application approved — Priya Singh, Ayushman Bharat</div>
              <div style={{ fontSize: 11, color: "#64748B" }}>14 mins ago</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 10, borderRadius: 10 }}>
            <span style={{ fontSize: 18 }}>🆕</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: "#F1F5F9", fontWeight: 500 }}>New scheme added — Digital India Digital Skill Programme</div>
              <div style={{ fontSize: 11, color: "#64748B" }}>1 hour ago</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 10, borderRadius: 10 }}>
            <span style={{ fontSize: 18 }}>👤</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: "#F1F5F9", fontWeight: 500 }}>138 new users registered today</div>
              <div style={{ fontSize: 11, color: "#64748B" }}>Rolling total</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
