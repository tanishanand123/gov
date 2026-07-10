"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { toggleTheme } from "@/lib/theme";
import { Menu, Search, Bell, Moon } from "lucide-react";

const BREADCRUMBS: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/schemes": "Eligible Schemes",
  "/dashboard/vault": "Document Vault",
  "/dashboard/applications": "My Applications",
  "/dashboard/notifications": "Notifications",
  "/dashboard/profile": "My Profile",
  "/dashboard/settings": "Settings",
  "/dashboard/apply": "Apply Now",
};

export function Topbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- avoids SSR/client initials mismatch
  useEffect(() => setMounted(true), []);

  const name = session?.user?.name || "User";
  const initials = name.split(" ").filter(Boolean).map((p) => p[0]).join("").slice(0, 2).toUpperCase() || "U";

  const crumb =
    BREADCRUMBS[pathname] ||
    (pathname.startsWith("/dashboard/schemes/") ? "Scheme Detail" : pathname.startsWith("/dashboard/apply") ? "Apply Now" : "Dashboard");

  return (
    <header className="topbar">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button className="btn-icon" onClick={onToggleSidebar}><Menu size={18} strokeWidth={2} /></button>
        <span style={{ fontSize: 14, color: "var(--text-muted)" }}>SmartGov / {crumb}</span>
      </div>
      <div className="topbar-search">
        <Search size={16} strokeWidth={2} />
        <input type="text" placeholder="Search schemes, documents..." />
      </div>
      <div className="topbar-actions">
        <Link href="/dashboard/notifications" className="btn-icon notif-badge" title="Notifications" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
          <Bell size={18} strokeWidth={2} />
        </Link>
        <button className="btn-icon" onClick={toggleTheme} title="Toggle theme"><Moon size={18} strokeWidth={2} /></button>
        <Link href="/dashboard/profile" className="avatar-circle" style={{ cursor: "pointer", textDecoration: "none" }}>
          {mounted ? initials : ""}
        </Link>
      </div>
    </header>
  );
}
