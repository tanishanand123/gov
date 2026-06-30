"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Star, FolderOpen, Bell, User } from "lucide-react";
import { twMerge } from "tailwind-merge";

const tabs = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard/schemes", label: "Schemes", icon: Star },
  { href: "/dashboard/vault", label: "Vault", icon: FolderOpen },
  { href: "/dashboard/notifications", label: "Alerts", icon: Bell, badge: 3 },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t"
      style={{
        background: "var(--color-surface, #ffffff)",
        borderColor: "var(--color-border, #E2E8F0)",
        height: "64px",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {tabs.map((tab) => {
        const active = isActive(tab.href);
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={twMerge(
              "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors relative",
              active ? "text-primary" : "text-slate-400"
            )}
          >
            <div className="relative">
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              {tab.badge && !active && (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className={twMerge("text-[10px] font-medium", active ? "font-bold text-primary" : "text-slate-400")}>
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
