"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Star,
  FileCheck,
  Users,
  Settings,
  Shield,
  LogOut,
  BarChart2,
  ChevronRight,
} from "lucide-react";
import { twMerge } from "tailwind-merge";

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/schemes", label: "Schemes", icon: Star },
  { href: "/admin/verifications", label: "Verifications", icon: FileCheck },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col z-20" style={{ background: "#111827" }}>
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Shield size={16} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-sm text-white">SmartGov</span>
            <span className="font-bold text-sm text-primary-light"> Admin</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <p className="px-3 mb-2 text-xs font-semibold text-white/30 uppercase tracking-wider">
          Administration
        </p>
        <div className="space-y-0.5">
          {adminNavItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={twMerge(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-white/10 text-white border-l-[3px] border-indigo-400 pl-[calc(0.75rem-3px)]"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon size={18} className={active ? "text-indigo-400" : "text-white/40"} />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight size={14} className="text-indigo-400" />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Admin card */}
      <div className="border-t border-white/10 p-3 shrink-0">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors">
          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">Admin User</p>
            <p className="text-xs text-white/50 truncate">admin@gov.in</p>
          </div>
          <LogOut size={16} className="text-white/40 hover:text-red-400 cursor-pointer shrink-0" />
        </div>
      </div>
    </aside>
  );
}
