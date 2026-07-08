"use client";

import React, { useState } from "react";

const CHANNELS = ["📱 In-App", "💬 SMS", "📧 Email", "🟢 WhatsApp"];

export default function AdminNotificationsPage() {
  const [channel, setChannel] = useState(0);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#F1F5F9" }}>Send Bulk Notification</h1>
        <p style={{ color: "#64748B" }}>Broadcast updates to citizen users</p>
      </div>
      <div style={{ background: "#1E293B", borderRadius: 16, border: "1px solid #334155", padding: 28, maxWidth: 600 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="input-wrap">
            <label className="input-label">Target Audience</label>
            <select className="input" style={{ background: "#0F172A", borderColor: "#334155", color: "#F1F5F9" }}>
              <option>All Users (10,482)</option>
              <option>Eligible for Scholarship</option>
              <option>Documents Expiring Soon</option>
              <option>Incomplete Profiles</option>
              <option>Specific State...</option>
            </select>
          </div>
          <div className="input-wrap">
            <label className="input-label">Channel</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {CHANNELS.map((c, i) => (
                <div key={c} className={`pill-option${channel === i ? " selected" : ""}`} style={{ fontSize: 13 }} onClick={() => setChannel(i)}>{c}</div>
              ))}
            </div>
          </div>
          <div className="input-wrap">
            <label className="input-label">Notification Title</label>
            <input className="input" style={{ background: "#0F172A", borderColor: "#334155", color: "#F1F5F9" }} placeholder="e.g. New scheme available for you!" />
          </div>
          <div className="input-wrap">
            <label className="input-label">Message Body</label>
            <textarea className="input" rows={4} style={{ background: "#0F172A", borderColor: "#334155", color: "#F1F5F9", height: "auto", resize: "vertical", paddingTop: 12 }} placeholder="Enter notification message..." />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-primary">📢 Send Now</button>
            <button className="btn btn-secondary" style={{ background: "#1E293B", color: "#818CF8", border: "1px solid #334155" }}>Schedule for Later</button>
          </div>
        </div>
      </div>
    </div>
  );
}
