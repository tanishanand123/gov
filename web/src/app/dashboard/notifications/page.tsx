"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Clock, FileText, CheckCircle2, Info, type LucideIcon } from "lucide-react";

interface Notif {
  id: string;
  unread: boolean;
  bg: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  time: string;
  cta?: { label: string; href?: string; style?: React.CSSProperties };
}

const NOTIFS: Notif[] = [
  { id: "1", unread: true, bg: "linear-gradient(135deg,#6366F1,#4338CA)", icon: Sparkles, title: "3 new schemes matched your profile!", desc: "Digital Skill India, MNREGA & Sukanya Samriddhi added to your eligible list.", time: "Just now", cta: { label: "Apply Now", href: "/dashboard/schemes" } },
  { id: "2", unread: true, bg: "linear-gradient(135deg,#F87171,#EF4444)", icon: Clock, title: "PM Scholarship deadline in 6 days", desc: "Submit your PM Scholarship application before Dec 31, 2026.", time: "2 hrs ago", cta: { label: "Apply" } },
  { id: "3", unread: true, bg: "linear-gradient(135deg,#F59E0B,#D97706)", icon: FileText, title: "Document expiring: Domicile Certificate", desc: "Your domicile certificate is outdated. Re-upload to avoid losing eligibility.", time: "Yesterday", cta: { label: "Upload", href: "/dashboard/vault", style: { background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#fff" } } },
  { id: "4", unread: false, bg: "linear-gradient(135deg,#10B981,#059669)", icon: CheckCircle2, title: "Application Approved — PM-KISAN", desc: "Your PM-KISAN application has been approved. First installment of ₹2,000 will be credited.", time: "3 days ago" },
  { id: "5", unread: false, bg: "linear-gradient(135deg,#94A3B8,#64748B)", icon: Info, title: "Profile completion tip", desc: "Adding your Caste Certificate will unlock 4 more schemes worth ₹45,000+.", time: "1 week ago" },
];

const TABS = ["All", "Action Required", "Informational", "Archived"];

export default function NotificationsPage() {
  const [tab, setTab] = useState(0);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h1>Notifications</h1>
        <a className="link" style={{ fontSize: 13 }}>Mark all as read</a>
      </div>
      <div className="tabs">
        {TABS.map((t, i) => (
          <button key={t} className={`tab${tab === i ? " active" : ""}`} onClick={() => setTab(i)}>{t}</button>
        ))}
      </div>
      <div style={{ background: "var(--bg-card)", borderRadius: 16, border: "1px solid var(--border)", overflow: "hidden" }}>
        {NOTIFS.map((n) => (
          <div key={n.id} className={`notif-item${n.unread ? " unread" : ""}`}>
            {n.unread ? <div className="notif-dot" /> : <div style={{ width: 8 }} />}
            <div style={{ width: 44, height: 44, borderRadius: 12, background: n.bg, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}><n.icon size={18} strokeWidth={2} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: n.unread ? 700 : 600 }}>{n.title}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{n.desc}</div>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{n.time}</div>
            {n.cta && (
              n.cta.href ? (
                <Link href={n.cta.href} className="btn btn-primary btn-sm" style={n.cta.style}>{n.cta.label}</Link>
              ) : (
                <button className="btn btn-primary btn-sm" style={n.cta.style}>{n.cta.label}</button>
              )
            )}
            {!n.cta && <a className="link" style={{ fontSize: 13, whiteSpace: "nowrap" }}>View</a>}
          </div>
        ))}
      </div>
    </div>
  );
}
