"use client";

import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  Eye,
  Ban,
  CheckCircle2,
  MoreHorizontal,
  User,
  MapPin,
  Calendar,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

type UserStatus = "active" | "suspended" | "pending";
type Tab = "all" | UserStatus;

interface UserRow {
  id: string;
  name: string;
  phone: string;
  state: string;
  joinedOn: string;
  schemesMatched: number;
  docsUploaded: number;
  applications: number;
  status: UserStatus;
  category: string;
}

const users: UserRow[] = [
  { id: "USR-0001", name: "Rajan Kumar", phone: "+91 98765 43210", state: "Uttar Pradesh", joinedOn: "Jan 12, 2026", schemesMatched: 12, docsUploaded: 4, applications: 2, status: "active", category: "General" },
  { id: "USR-0002", name: "Priya Sharma", phone: "+91 87654 32109", state: "Bihar", joinedOn: "Jan 15, 2026", schemesMatched: 8, docsUploaded: 6, applications: 3, status: "active", category: "OBC" },
  { id: "USR-0003", name: "Mohammed Iqbal", phone: "+91 76543 21098", state: "Rajasthan", joinedOn: "Jan 18, 2026", schemesMatched: 5, docsUploaded: 2, applications: 1, status: "pending", category: "Minority" },
  { id: "USR-0004", name: "Sunita Devi", phone: "+91 65432 10987", state: "Jharkhand", joinedOn: "Feb 2, 2026", schemesMatched: 14, docsUploaded: 7, applications: 4, status: "active", category: "SC" },
  { id: "USR-0005", name: "Arjun Patel", phone: "+91 54321 09876", state: "Gujarat", joinedOn: "Feb 10, 2026", schemesMatched: 3, docsUploaded: 1, applications: 0, status: "suspended", category: "General" },
  { id: "USR-0006", name: "Rekha Verma", phone: "+91 43210 98765", state: "Madhya Pradesh", joinedOn: "Feb 20, 2026", schemesMatched: 9, docsUploaded: 5, applications: 2, status: "active", category: "ST" },
  { id: "USR-0007", name: "Suresh Kumar", phone: "+91 32109 87654", state: "Maharashtra", joinedOn: "Mar 1, 2026", schemesMatched: 11, docsUploaded: 3, applications: 1, status: "active", category: "OBC" },
  { id: "USR-0008", name: "Lata Narayanan", phone: "+91 21098 76543", state: "Tamil Nadu", joinedOn: "Mar 5, 2026", schemesMatched: 7, docsUploaded: 4, applications: 3, status: "active", category: "General" },
];

const statusColors: Record<UserStatus, string> = {
  active: "bg-emerald-900/40 text-emerald-300 border border-emerald-700/40",
  suspended: "bg-red-900/40 text-red-300 border border-red-700/40",
  pending: "bg-amber-900/40 text-amber-300 border border-amber-700/40",
};

const categoryColors: Record<string, string> = {
  General: "bg-white/10 text-white/60",
  OBC: "bg-cyan-900/40 text-cyan-300",
  SC: "bg-indigo-900/40 text-indigo-300",
  ST: "bg-purple-900/40 text-purple-300",
  Minority: "bg-rose-900/40 text-rose-300",
};

const tabs: { key: Tab; label: string }[] = [
  { key: "all", label: "All Users" },
  { key: "active", label: "Active" },
  { key: "pending", label: "Pending KYC" },
  { key: "suspended", label: "Suspended" },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [userList, setUserList] = useState(users);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleSuspend = (id: string) => {
    setUserList((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === "suspended" ? "active" : "suspended" } : u
      )
    );
  };

  const filtered = userList.filter((u) => {
    const matchTab = tab === "all" || u.status === tab;
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase()) ||
      u.state.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white">User Management</h1>
          <p className="text-sm text-white/40 mt-0.5">{userList.length} registered users</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <CheckCircle2 size={13} className="text-emerald-400" />
          <span>{userList.filter((u) => u.status === "active").length} active</span>
          <span className="text-white/20">·</span>
          <span>{userList.filter((u) => u.status === "pending").length} pending KYC</span>
        </div>
      </div>

      {/* Filters */}
      <div
        className="rounded-2xl p-4 flex flex-col sm:flex-row gap-3"
        style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex gap-1 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                tab === t.key ? "bg-indigo-600 text-white" : "text-white/50 hover:text-white hover:bg-white/10"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID, or state..."
            className="w-full text-sm pl-9 pr-4 py-2 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#1E1B4B" }}>
                {["User", "ID", "State", "Category", "Schemes", "Docs", "Apps", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <React.Fragment key={user.id}>
                  <tr className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">{user.name}</p>
                          <p className="text-xs text-white/30">{user.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs font-mono text-indigo-400">{user.id}</td>
                    <td className="px-4 py-3.5 text-xs text-white/60">{user.state}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${categoryColors[user.category]}`}>
                        {user.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-white/70 text-center">{user.schemesMatched}</td>
                    <td className="px-4 py-3.5 text-white/70 text-center">{user.docsUploaded}</td>
                    <td className="px-4 py-3.5 text-white/70 text-center">{user.applications}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg border capitalize ${statusColors[user.status]}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setExpandedId(expandedId === user.id ? null : user.id)}
                          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-indigo-400 transition-colors"
                          title="View details"
                        >
                          <Eye size={12} />
                        </button>
                        <button
                          onClick={() => toggleSuspend(user.id)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                            user.status === "suspended"
                              ? "bg-emerald-900/40 text-emerald-400 hover:bg-emerald-900/60"
                              : "bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400"
                          }`}
                          title={user.status === "suspended" ? "Reactivate" : "Suspend"}
                        >
                          {user.status === "suspended" ? <CheckCircle2 size={12} /> : <Ban size={12} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedId === user.id && (
                    <tr className="border-t border-white/[0.04]">
                      <td colSpan={9} className="px-4 py-4">
                        <div
                          className="rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4"
                          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                        >
                          <div>
                            <p className="text-xs text-white/30 uppercase font-semibold mb-1">Joined On</p>
                            <p className="text-sm text-white">{user.joinedOn}</p>
                          </div>
                          <div>
                            <p className="text-xs text-white/30 uppercase font-semibold mb-1">Documents</p>
                            <p className="text-sm text-white">{user.docsUploaded} uploaded</p>
                          </div>
                          <div>
                            <p className="text-xs text-white/30 uppercase font-semibold mb-1">Applications</p>
                            <p className="text-sm text-white">{user.applications} submitted</p>
                          </div>
                          <div>
                            <p className="text-xs text-white/30 uppercase font-semibold mb-1">Category</p>
                            <p className="text-sm text-white">{user.category}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-white/30 text-sm">
                    No users match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
