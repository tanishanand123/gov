"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  return (
    <div className="app-shell locked">
      <Sidebar visible={sidebarVisible} />
      <div className="app-main">
        <Topbar onToggleSidebar={() => setSidebarVisible((v) => !v)} />
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
