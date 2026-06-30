"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Star,
  FolderOpen,
  FileText,
  Bell,
  User,
  Settings,
  Shield,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { twMerge } from "tailwind-merge";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/schemes", label: "Eligible Schemes", icon: Star },
  { href: "/dashboard/vault", label: "Document Vault", icon: FolderOpen },
  { href: "/dashboard/applications", label: "My Applications", icon: FileText },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell, badge: 3 },
  { href: "/dashboard/profile", label: "My Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-surface border-r border-border flex-col z-20">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Shield size={16} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-sm text-text">SmartGov</span>
            <span className="font-bold text-sm text-primary"> Assist</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={twMerge(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative",
                  active
                    ? "bg-indigo-50 text-primary border-l-[3px] border-primary ml-0 pl-[calc(0.75rem-3px)]"
                    : "text-slate-600 hover:bg-elevated hover:text-text"
                )}
              >
                <Icon
                  size={18}
                  className={active ? "text-primary" : "text-slate-400 group-hover:text-slate-600"}
                />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
                {active && <ChevronRight size={14} className="text-primary" />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User card */}
      <div className="border-t border-border p-3 shrink-0">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-elevated cursor-pointer transition-colors">
          <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
            RK
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text truncate">Rajan Kumar</p>
            <p className="text-xs text-muted truncate">rajan@example.com</p>
          </div>
          <LogOut size={16} className="text-muted hover:text-danger cursor-pointer shrink-0" />
        </div>
      </div>
    </aside>
  );
}
