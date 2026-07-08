"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", icon: "📊", label: "Dashboard" },
  { href: "/admin/schemes", icon: "📋", label: "Schemes Management" },
  { href: "/admin/users", icon: "👥", label: "User Management" },
  { href: "/admin/verifications", icon: "📄", label: "Document Queue" },
  { href: "/admin/analytics", icon: "📈", label: "Analytics" },
  { href: "/admin/settings", icon: "🔔", label: "Notifications" },
];

export function AdminSidebar({ visible }: { visible: boolean }) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <aside className="sidebar admin-sidebar" style={{ background: "#111827", borderRight: "1px solid #1E293B", display: visible ? "flex" : "none" }}>
      <div className="sidebar-logo" style={{ borderBottom: "1px solid #1E293B" }}>
        <span style={{ fontSize: 22 }}>🏛</span>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>SmartGov</div>
          <div style={{ fontSize: 10, color: "#94A3B8" }}>Admin Panel</div>
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#fff", padding: "2px 8px", borderRadius: 6, marginLeft: "auto" }}>ADMIN</span>
      </div>

      <nav className="nav-section">
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} className={`nav-item${isActive(item.href) ? " active" : ""}`} style={{ color: "#94A3B8" }}>
            <span className="nav-icon">{item.icon}</span> {item.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-user" style={{ borderTop: "1px solid #1E293B" }}>
        <div className="sidebar-user-card" style={{ background: "#1E293B" }}>
          <div className="avatar-circle">AD</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Admin User</div>
            <div style={{ fontSize: 11, color: "#10B981" }}>● Super Admin</div>
          </div>
        </div>
        <Link href="/" style={{ display: "block", textAlign: "center", marginTop: 10, fontSize: 13, color: "#EF4444", textDecoration: "none", fontWeight: 500 }}>Logout</Link>
      </div>
    </aside>
  );
}
