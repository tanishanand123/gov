"use client";

import React, { useState } from "react";
import {
  Eye,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Search,
  Filter,
  Clock,
  FileText,
  CreditCard,
  Home,
  Briefcase,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

type DocStatus = "pending" | "approved" | "rejected";
type Tab = "pending" | "all";

interface VerificationItem {
  id: number;
  user: string;
  userId: string;
  docType: string;
  docIcon: React.ElementType;
  uploadedAt: string;
  state: string;
  status: DocStatus;
  preview?: string;
}

const docs: VerificationItem[] = [
  { id: 1, user: "Priya Sharma", userId: "USR-0041", docType: "Income Certificate", docIcon: FileText, uploadedAt: "10 min ago", state: "UP", status: "pending" },
  { id: 2, user: "Mohammed Iqbal", userId: "USR-0082", docType: "Caste Certificate", docIcon: FileText, uploadedAt: "23 min ago", state: "Bihar", status: "pending" },
  { id: 3, user: "Sunita Devi", userId: "USR-0117", docType: "Domicile Certificate", docIcon: Home, uploadedAt: "45 min ago", state: "Rajasthan", status: "pending" },
  { id: 4, user: "Arjun Patel", userId: "USR-0203", docType: "Bank Passbook", docIcon: CreditCard, uploadedAt: "1 hr ago", state: "Gujarat", status: "pending" },
  { id: 5, user: "Rekha Verma", userId: "USR-0055", docType: "Aadhaar Card", docIcon: CreditCard, uploadedAt: "2 hr ago", state: "Delhi", status: "approved" },
  { id: 6, user: "Suresh Kumar", userId: "USR-0099", docType: "Employment Certificate", docIcon: Briefcase, uploadedAt: "3 hr ago", state: "Maharashtra", status: "rejected" },
  { id: 7, user: "Lata Narayanan", userId: "USR-0134", docType: "Income Certificate", docIcon: FileText, uploadedAt: "4 hr ago", state: "Tamil Nadu", status: "approved" },
];

const rejectionReasons = [
  "Blurry / illegible",
  "Incorrect document type",
  "Expired document",
  "Information mismatch",
  "Tampered document",
];

const statusColors: Record<DocStatus, string> = {
  pending: "bg-amber-900/40 text-amber-300 border-amber-700/40",
  approved: "bg-emerald-900/40 text-emerald-300 border-emerald-700/40",
  rejected: "bg-red-900/40 text-red-300 border-red-700/40",
};

export default function AdminVerificationsPage() {
  const [items, setItems] = useState(docs);
  const [tab, setTab] = useState<Tab>("pending");
  const [search, setSearch] = useState("");
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [previewId, setPreviewId] = useState<number | null>(null);

  const approve = (id: number) => {
    setItems((prev) => prev.map((d) => (d.id === id ? { ...d, status: "approved" } : d)));
  };

  const reject = (id: number) => {
    setItems((prev) => prev.map((d) => (d.id === id ? { ...d, status: "rejected" } : d)));
    setRejectingId(null);
  };

  const filtered = items.filter((d) => {
    const matchTab = tab === "all" || d.status === "pending";
    const matchSearch = d.user.toLowerCase().includes(search.toLowerCase()) || d.docType.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const pendingCount = items.filter((d) => d.status === "pending").length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white">Document Verification Queue</h1>
          <p className="text-sm text-white/40 mt-0.5">{pendingCount} pending verifications</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/40">
          <Clock size={14} />
          <span>Avg response time: 4.2 hrs</span>
        </div>
      </div>

      {/* Tabs + Search */}
      <div
        className="rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center"
        style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex gap-1">
          {(["pending", "all"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                tab === t ? "bg-indigo-600 text-white" : "text-white/50 hover:text-white hover:bg-white/10"
              }`}
            >
              {t === "pending" ? `Pending (${pendingCount})` : "All Documents"}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user or document type..."
            className="w-full text-sm pl-9 pr-4 py-2 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          />
        </div>
      </div>

      {/* Verification cards grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((item) => {
          const Icon = item.docIcon;
          const isRejecting = rejectingId === item.id;
          const isPreviewing = previewId === item.id;

          return (
            <div
              key={item.id}
              className="rounded-2xl overflow-hidden"
              style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {/* Doc preview area */}
              <div
                className="h-28 flex flex-col items-center justify-center gap-2 cursor-pointer relative"
                style={{ background: isPreviewing ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                onClick={() => setPreviewId(isPreviewing ? null : item.id)}
              >
                <Icon size={28} className={isPreviewing ? "text-indigo-400" : "text-white/20"} />
                <span className="text-xs text-white/30">{isPreviewing ? "Document preview" : "Click to preview"}</span>
                <button className="absolute top-2 right-2 w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
                  <Eye size={11} />
                </button>
              </div>

              <div className="p-3 space-y-3">
                {/* Info */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-white leading-tight">{item.user}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg border ${statusColors[item.status]} capitalize`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-white/40 mt-1">{item.docType}</p>
                  <p className="text-xs text-white/30">{item.state} · {item.uploadedAt}</p>
                  <p className="text-xs text-indigo-400/70 mt-0.5">{item.userId}</p>
                </div>

                {/* Actions */}
                {item.status === "pending" && (
                  isRejecting ? (
                    <div className="space-y-2">
                      <div className="relative">
                        <select
                          className="w-full text-xs rounded-lg px-2.5 py-2 pr-7 appearance-none text-white/70 focus:outline-none focus:ring-1 focus:ring-red-500"
                          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(239,68,68,0.3)" }}
                        >
                          <option value="">Select reason...</option>
                          {rejectionReasons.map((r) => <option key={r}>{r}</option>)}
                        </select>
                        <ChevronDown size={10} className="absolute right-2 top-2.5 text-white/40 pointer-events-none" />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => reject(item.id)}
                          className="flex-1 text-xs py-1.5 rounded-lg font-semibold transition-colors"
                          style={{ background: "rgba(239,68,68,0.2)", color: "#F87171", border: "1px solid rgba(239,68,68,0.3)" }}
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setRejectingId(null)}
                          className="flex-1 text-xs py-1.5 rounded-lg font-semibold text-white/40 hover:text-white/70 transition-colors"
                          style={{ background: "rgba(255,255,255,0.05)" }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => approve(item.id)}
                        className="flex-1 text-xs py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1 transition-colors"
                        style={{ background: "rgba(16,185,129,0.2)", color: "#34D399", border: "1px solid rgba(16,185,129,0.3)" }}
                      >
                        <CheckCircle2 size={11} /> Approve
                      </button>
                      <button
                        onClick={() => setRejectingId(item.id)}
                        className="flex-1 text-xs py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1 transition-colors"
                        style={{ background: "rgba(239,68,68,0.15)", color: "#F87171", border: "1px solid rgba(239,68,68,0.3)" }}
                      >
                        <XCircle size={11} /> Reject
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center text-white/30">
            <CheckCircle2 size={40} className="mx-auto mb-3 text-white/10" />
            <p className="text-sm">No pending verifications. You&apos;re all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}
