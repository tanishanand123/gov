"use client";

import React, { useState } from "react";
import { Eye, ExternalLink, Clock, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type AppStatus = "pending" | "approved" | "rejected" | "processing";
type Tab = "all" | AppStatus;

interface Application {
  id: string;
  scheme: string;
  ministry: string;
  appliedOn: string;
  lastUpdated: string;
  status: AppStatus;
  referenceNo: string;
  benefit: string;
  notes?: string;
}

const applications: Application[] = [
  {
    id: "1",
    scheme: "PM Kisan Samman Nidhi",
    ministry: "Ministry of Agriculture",
    appliedOn: "15 Nov 2025",
    lastUpdated: "20 Nov 2025",
    status: "approved",
    referenceNo: "PMKISAN-2025-87654",
    benefit: "₹6,000/year",
    notes: "First instalment of ₹2,000 disbursed on 20 Nov 2025",
  },
  {
    id: "2",
    scheme: "Mahatma Gandhi NREGA",
    ministry: "Ministry of Rural Development",
    appliedOn: "1 Dec 2025",
    lastUpdated: "5 Dec 2025",
    status: "processing",
    referenceNo: "NREGA-2025-44321",
    benefit: "₹250/day",
    notes: "Application under review at Block level",
  },
  {
    id: "3",
    scheme: "PM Awas Yojana (Gramin)",
    ministry: "Ministry of Housing",
    appliedOn: "10 Oct 2025",
    lastUpdated: "12 Oct 2025",
    status: "pending",
    referenceNo: "PMAY-2025-11223",
    benefit: "₹2.5 Lakh",
    notes: "Awaiting Gram Sabha verification",
  },
  {
    id: "4",
    scheme: "National Scholarship Portal",
    ministry: "Ministry of Education",
    appliedOn: "5 Sep 2025",
    lastUpdated: "20 Oct 2025",
    status: "rejected",
    referenceNo: "NSP-2025-99001",
    benefit: "₹25,000/year",
    notes: "Rejected: Income certificate expired. Please re-upload and reapply.",
  },
];

const statusConfig = {
  approved: {
    border: "border-l-success",
    icon: <CheckCircle2 size={16} className="text-success" />,
    badge: "eligible" as const,
    label: "Approved",
    bg: "bg-green-50",
  },
  rejected: {
    border: "border-l-danger",
    icon: <XCircle size={16} className="text-danger" />,
    badge: "missing" as const,
    label: "Rejected",
    bg: "bg-red-50",
  },
  pending: {
    border: "border-l-amber-400",
    icon: <Clock size={16} className="text-amber-500" />,
    badge: "almost" as const,
    label: "Pending",
    bg: "bg-amber-50",
  },
  processing: {
    border: "border-l-primary",
    icon: <RefreshCw size={16} className="text-primary animate-spin" />,
    badge: "processing" as const,
    label: "Processing",
    bg: "bg-indigo-50",
  },
};

const tabs: { key: Tab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "processing", label: "Processing" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

export default function ApplicationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("all");

  const filtered = applications.filter((a) => activeTab === "all" || a.status === activeTab);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-text">My Applications</h1>
        <p className="text-muted text-sm mt-1">{applications.length} total applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(["pending", "processing", "approved", "rejected"] as AppStatus[]).map((s) => {
          const count = applications.filter((a) => a.status === s).length;
          const config = statusConfig[s];
          return (
            <Card key={s} className={`text-center cursor-pointer ${activeTab === s ? "ring-2 ring-primary" : ""}`} onClick={() => setActiveTab(s)}>
              <div className="text-2xl font-extrabold text-text">{count}</div>
              <div className="text-xs text-muted mt-1 capitalize">{s}</div>
            </Card>
          );
        })}
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

      {/* Applications list */}
      <div className="space-y-4">
        {filtered.map((app) => {
          const config = statusConfig[app.status];
          return (
            <div
              key={app.id}
              className={`card-base border-l-4 ${config.border} p-5 flex flex-col sm:flex-row sm:items-center gap-4`}
            >
              <div className="flex-1">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {config.icon}
                      <h3 className="font-bold text-text">{app.scheme}</h3>
                    </div>
                    <p className="text-xs text-muted">{app.ministry}</p>
                  </div>
                  <Badge variant={config.badge}>{config.label}</Badge>
                </div>

                <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted">
                  <span>Ref: <span className="font-mono font-semibold text-text">{app.referenceNo}</span></span>
                  <span>Applied: <span className="text-text">{app.appliedOn}</span></span>
                  <span>Updated: <span className="text-text">{app.lastUpdated}</span></span>
                  <span>Benefit: <span className="font-semibold text-primary">{app.benefit}</span></span>
                </div>

                {app.notes && (
                  <div className={`mt-3 p-3 rounded-xl text-xs text-slate-700 ${config.bg}`}>
                    {app.notes}
                  </div>
                )}
              </div>

              <div className="flex gap-2 shrink-0">
                <Button variant="ghost" size="sm" leftIcon={<Eye size={14} />}>
                  View
                </Button>
                {app.status === "rejected" && (
                  <Button variant="primary" size="sm" leftIcon={<RefreshCw size={14} />}>
                    Reapply
                  </Button>
                )}
                {app.status !== "rejected" && (
                  <Button variant="outline" size="sm" leftIcon={<ExternalLink size={14} />}>
                    Track
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 card-base">
          <RefreshCw size={48} className="text-muted mx-auto mb-4" />
          <p className="font-semibold text-text">No applications found</p>
          <p className="text-muted text-sm mt-1">Applications in this category will appear here.</p>
        </div>
      )}
    </div>
  );
}
