"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LayoutDashboard, ClipboardList, FolderArchive, FileEdit, Bell, User, Settings, Landmark, LogOut } from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/schemes", icon: ClipboardList, label: "Eligible Schemes" },
  { href: "/dashboard/vault", icon: FolderArchive, label: "Document Vault" },
  { href: "/dashboard/applications", icon: FileEdit, label: "My Applications" },
  { href: "/dashboard/notifications", icon: Bell, label: "Notifications" },
  { href: "/dashboard/profile", icon: User, label: "My Profile" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function Sidebar({ visible }: { visible: boolean }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const name = session?.user?.name || "User";
  const initials = name.split(" ").filter(Boolean).map((p) => p[0]).join("").slice(0, 2).toUpperCase() || "U";

  const isActive = (href: string) => (href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href));

  return (
    <aside className="sidebar" style={{ display: visible ? "flex" : "none" }}>
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon"><Landmark size={20} strokeWidth={2} /></span>
        <div>
          <div className="sidebar-logo-text gradient-text-cyan">SmartGov</div>
          <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Assist</div>
        </div>
        <div className="sidebar-version">v1.0</div>
      </div>

      <nav className="nav-section">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={`nav-item${isActive(item.href) ? " active" : ""}`}>
              <span className="nav-icon"><Icon size={18} strokeWidth={2} /></span> {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-user">
        <div className="sidebar-user-card">
          <div className="avatar-circle">{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{name}</div>
            <div style={{ fontSize: 11, color: "#10B981", display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", display: "inline-block" }} />Active
            </div>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", textAlign: "center", marginTop: 10, fontSize: 13, color: "#EF4444", background: "none", border: "none", fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}
        >
          <LogOut size={14} strokeWidth={2} /> Logout
        </button>
      </div>
    </aside>
  );
}
