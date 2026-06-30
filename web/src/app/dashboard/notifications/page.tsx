"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Info,
  Archive,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

type NotifType = "action" | "info" | "success" | "warning";
type Tab = "all" | "action" | "info" | "archived";

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  archived?: boolean;
  action?: { label: string; href: string };
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "warning",
    title: "Income Certificate Required",
    body: "You need to upload your Income Certificate to complete eligibility for 5 matched schemes.",
    time: "2 hours ago",
    read: false,
    action: { label: "Upload Now", href: "/dashboard/vault" },
  },
  {
    id: "2",
    type: "action",
    title: "PM Kisan Application Deadline Approaching",
    body: "The last date to apply for PM Kisan Samman Nidhi is December 31, 2025. You have 6 days left.",
    time: "5 hours ago",
    read: false,
    action: { label: "Apply Now", href: "/dashboard/schemes/pm-kisan" },
  },
  {
    id: "3",
    type: "success",
    title: "Aadhaar Successfully Verified",
    body: "Your Aadhaar card has been verified and linked to your SmartGov profile.",
    time: "Yesterday",
    read: true,
  },
  {
    id: "4",
    type: "info",
    title: "3 New Schemes Matched",
    body: "Based on your updated profile, 3 new schemes are now eligible for you including Sukanya Samriddhi Yojana.",
    time: "2 days ago",
    read: true,
    action: { label: "View Schemes", href: "/dashboard/schemes" },
  },
  {
    id: "5",
    type: "success",
    title: "PM Kisan Instalment Received",
    body: "₹2,000 has been credited to your bank account for PM Kisan Samman Nidhi Q3 instalment.",
    time: "1 week ago",
    read: true,
  },
  {
    id: "6",
    type: "warning",
    title: "Land Records Expiring Soon",
    body: "Your uploaded Land Records (7/12) will expire on January 5, 2026. Please renew and re-upload.",
    time: "1 week ago",
    read: true,
    archived: true,
    action: { label: "Re-upload", href: "/dashboard/vault" },
  },
  {
    id: "7",
    type: "action",
    title: "Application Status Update",
    body: "Your PM Awas Yojana application is pending Gram Sabha verification. Action needed.",
    time: "2 weeks ago",
    read: true,
    action: { label: "View", href: "/dashboard/applications" },
  },
];

const typeConfig = {
  action: { icon: Bell, bg: "bg-primary/10", color: "text-primary" },
  info: { icon: Info, bg: "bg-cyan-100", color: "text-cyan-600" },
  success: { icon: CheckCircle2, bg: "bg-green-100", color: "text-green-600" },
  warning: { icon: AlertTriangle, bg: "bg-amber-100", color: "text-amber-600" },
};

const tabs: { key: Tab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "action", label: "Action Required" },
  { key: "info", label: "Informational" },
  { key: "archived", label: "Archived" },
];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [readIds, setReadIds] = useState<Set<string>>(
    new Set(notifications.filter((n) => n.read).map((n) => n.id))
  );

  const markAllRead = () => {
    setReadIds(new Set(notifications.map((n) => n.id)));
  };

  const markRead = (id: string) => {
    setReadIds((prev) => new Set([...prev, id]));
  };

  const filtered = notifications.filter((n) => {
    if (activeTab === "archived") return n.archived;
    if (activeTab === "action") return n.type === "action" || n.type === "warning";
    if (activeTab === "info") return n.type === "info" || n.type === "success";
    return !n.archived;
  });

  const unreadCount = notifications.filter((n) => !readIds.has(n.id) && !n.archived).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-text">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-muted text-sm mt-1">
              <span className="text-primary font-semibold">{unreadCount} unread</span> notifications
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" leftIcon={<Check size={14} />} onClick={markAllRead}>
            Mark all read
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-elevated rounded-xl p-1 w-fit overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === t.key ? "bg-surface shadow text-primary" : "text-muted hover:text-text"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div className="space-y-2">
        {filtered.map((notif) => {
          const config = typeConfig[notif.type];
          const Icon = config.icon;
          const isRead = readIds.has(notif.id);

          return (
            <div
              key={notif.id}
              className={`card-base p-4 flex items-start gap-4 transition-all cursor-pointer ${!isRead ? "border-primary/30 bg-indigo-50/30" : ""}`}
              onClick={() => markRead(notif.id)}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${config.bg}`}>
                <Icon size={18} className={config.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm font-semibold ${!isRead ? "text-text" : "text-slate-600"}`}>
                      {notif.title}
                    </h3>
                    {!isRead && (
                      <span className="w-2 h-2 bg-primary rounded-full shrink-0" />
                    )}
                  </div>
                  <span className="text-xs text-muted whitespace-nowrap shrink-0">{notif.time}</span>
                </div>
                <p className="text-sm text-muted mt-1 leading-relaxed">{notif.body}</p>
                {notif.action && (
                  <div className="mt-3 flex gap-2">
                    <Link href={notif.action.href} onClick={(e) => e.stopPropagation()}>
                      <Button variant="primary" size="sm">{notif.action.label}</Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Archive size={13} />}
                    >
                      Archive
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Bell size={48} className="text-muted mx-auto mb-4" />
          <p className="font-semibold text-text">No notifications</p>
          <p className="text-muted text-sm mt-1">You&apos;re all caught up!</p>
        </div>
      )}
    </div>
  );
}
