"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ApplyPage() {
  const router = useRouter();
  const [successOpen, setSuccessOpen] = useState(false);
  const [course, setCourse] = useState("");
  const [bankAccount, setBankAccount] = useState("");

  return (
    <div>
      <div className="stepper-outer" style={{ maxWidth: "100%", marginBottom: 28 }}>
        <div className="stepper-row">
          <div className="step-col"><div className="step-circle done">✓</div><div className="step-label">Documents</div></div>
          <div className="connector-col"><div className="connector-line done" /></div>
          <div className="step-col"><div className="step-circle active">2</div><div className="step-label active">Fill Form</div></div>
          <div className="connector-col"><div className="connector-line" /></div>
          <div className="step-col"><div className="step-circle">3</div><div className="step-label">Confirm</div></div>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <h2 style={{ marginBottom: 6 }}>Review your auto-filled application</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>Fields highlighted in amber need your attention</p>

        <div style={{ background: "#EEF2FF", border: "1px solid #6366F1", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 20, fontSize: 13, color: "#4F46E5" }}>
          ✨ <strong>8 of 11 fields auto-filled</strong> from your profile and documents
        </div>

        <div style={{ display: "flex", gap: 16, marginBottom: 20, fontSize: 12, color: "var(--text-muted)" }}>
          <span>✅ Auto-filled</span>
          <span style={{ color: "#F59E0B" }}>⚠️ Please verify</span>
          <span style={{ color: "#EF4444" }}>❌ Fill required</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
          <div className="input-wrap">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <label className="input-label">Full Name</label>
              <span style={{ fontSize: 11, color: "#10B981" }}>✅ Auto-filled</span>
            </div>
            <input className="input" defaultValue="Rahul Kumar" readOnly style={{ background: "var(--surface-elevated)" }} />
          </div>
          <div className="input-wrap">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <label className="input-label">Date of Birth</label>
              <span style={{ fontSize: 11, color: "#10B981" }}>✅ Auto-filled</span>
            </div>
            <input className="input" defaultValue="01 Jan 2003" readOnly style={{ background: "var(--surface-elevated)" }} />
          </div>
          <div className="input-wrap">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <label className="input-label">Aadhaar Number</label>
              <span style={{ fontSize: 11, color: "#F59E0B" }}>⚠️ Please verify</span>
            </div>
            <input className="input" defaultValue="XXXX XXXX 1234" style={{ borderColor: "#F59E0B", boxShadow: "0 0 0 2px rgba(245,158,11,0.15)" }} />
          </div>
          <div className="input-wrap">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <label className="input-label">Annual Income</label>
              <span style={{ fontSize: 11, color: "#10B981" }}>✅ Auto-filled</span>
            </div>
            <input className="input" defaultValue="₹1,80,000" readOnly style={{ background: "var(--surface-elevated)" }} />
          </div>
          <div className="input-wrap">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <label className="input-label">Category</label>
              <span style={{ fontSize: 11, color: "#10B981" }}>✅ Auto-filled</span>
            </div>
            <input className="input" defaultValue="OBC" readOnly style={{ background: "var(--surface-elevated)" }} />
          </div>
          <div className="input-wrap">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <label className="input-label">Course / Program</label>
              <span style={{ fontSize: 11, color: "#EF4444" }}>❌ Fill required</span>
            </div>
            <input
              className="input"
              placeholder="Enter your current course name"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              style={{ borderColor: "#EF4444", boxShadow: "0 0 0 2px rgba(239,68,68,0.15)" }}
            />
          </div>
          <div className="input-wrap">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <label className="input-label">State</label>
              <span style={{ fontSize: 11, color: "#10B981" }}>✅ Auto-filled</span>
            </div>
            <input className="input" defaultValue="Uttar Pradesh" readOnly style={{ background: "var(--surface-elevated)" }} />
          </div>
          <div className="input-wrap">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <label className="input-label">Bank Account Number</label>
              <span style={{ fontSize: 11, color: "#EF4444" }}>❌ Fill required</span>
            </div>
            <input
              className="input"
              placeholder="Enter bank account number"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              style={{ borderColor: "#EF4444", boxShadow: "0 0 0 2px rgba(239,68,68,0.15)" }}
            />
          </div>
        </div>

        <div className="sticky-bottom">
          <div style={{ fontSize: 14, color: "var(--text-muted)" }}>{9 + (course ? 1 : 0) + (bankAccount ? 1 : 0) > 11 ? 11 : 9 + (course ? 1 : 0) + (bankAccount ? 1 : 0)} of 11 fields complete</div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link href="/dashboard/schemes" className="btn btn-outline">← Cancel</Link>
            <button className="btn btn-primary" onClick={() => setSuccessOpen(true)}>Submit Application →</button>
          </div>
        </div>
      </div>

      {/* Success modal */}
      <div className={`modal-overlay${successOpen ? " open" : ""}`}>
        <div className="modal" style={{ textAlign: "center", maxWidth: 440 }}>
          <div className="success-ring" style={{ background: "linear-gradient(135deg,#10B981,#059669)", marginBottom: 20 }}>
            <span style={{ fontSize: 32, position: "relative", zIndex: 1 }}>✅</span>
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: "#10B981", marginBottom: 8 }}>Application Submitted!</h2>
          <div style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 20 }}>PM Scholarship Scheme for CAPF</div>
          <div style={{ background: "var(--surface-elevated)", borderRadius: 12, padding: 16, marginBottom: 20, textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--divider)", fontSize: 13 }}>
              <span style={{ color: "var(--text-muted)" }}>Submission ID</span>
              <span style={{ fontFamily: "monospace", fontWeight: 600 }}>#SGov-2026-00124</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--divider)", fontSize: 13 }}>
              <span style={{ color: "var(--text-muted)" }}>Submitted</span>
              <span>Today</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13 }}>
              <span style={{ color: "var(--text-muted)" }}>Status</span>
              <span className="badge badge-processing">Under Review</span>
            </div>
          </div>
          <button className="btn btn-primary btn-full mb-2" style={{ marginBottom: 8 }} onClick={() => router.push("/dashboard/applications")}>
            Save to My Applications
          </button>
          <button className="btn btn-outline btn-full" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
