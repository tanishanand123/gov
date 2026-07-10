"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Menu, Search, Bell } from "lucide-react";

const BREADCRUMBS: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/schemes": "Schemes Management",
  "/admin/users": "User Management",
  "/admin/verifications": "Document Queue",
  "/admin/analytics": "Analytics",
  "/admin/settings": "Send Notification",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const pathname = usePathname();
  const crumb = BREADCRUMBS[pathname] || "Dashboard";

  return (
    <div data-theme="dark" className="app-shell locked">
      <AdminSidebar visible={sidebarVisible} />
      <div className="app-main">
        <header className="admin-topbar">
          <button className="btn-icon" style={{ color: "#fff", background: "#1E293B" }} onClick={() => setSidebarVisible((v) => !v)}><Menu size={18} strokeWidth={2} /></button>
          <div style={{ color: "#94A3B8", fontSize: 14 }}>Admin / {crumb}</div>
          <div className="topbar-search" style={{ background: "#1E293B", borderColor: "#334155", maxWidth: 360 }}>
            <Search size={16} strokeWidth={2} color="#64748B" />
            <input type="text" placeholder="Search users, schemes..." style={{ color: "#fff" }} />
          </div>
          <div className="topbar-actions" style={{ marginLeft: "auto" }}>
            <button className="btn-icon" style={{ color: "#94A3B8", background: "#1E293B" }}><Bell size={18} strokeWidth={2} /></button>
            <div className="avatar-circle">AD</div>
          </div>
        </header>
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
