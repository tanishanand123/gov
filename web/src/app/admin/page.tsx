"use client";

import React, { useState } from "react";
import {
  Users,
  Star,
  FileCheck,
  TrendingUp,
  Bell,
  Plus,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
  Eye,
  ArrowUp,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const statsCards = [
  { label: "Daily Active Users", value: "2,847", delta: "+12%", icon: Users, color: "from-indigo-500 to-indigo-600" },
  { label: "Applications Today", value: "184", delta: "+8%", icon: FileCheck, color: "from-cyan-500 to-cyan-600" },
  { label: "Docs Uploaded Today", value: "312", delta: "+22%", icon: Star, color: "from-emerald-500 to-emerald-600" },
  { label: "Pending Verifications", value: "47", delta: "-3", icon: Bell, color: "from-amber-500 to-amber-600" },
  { label: "New Users Today", value: "93", delta: "+15%", icon: TrendingUp, color: "from-rose-500 to-rose-600" },
];

const schemes = [
  { id: 1, name: "PM Awas Yojana", category: "Housing", active: true, applications: 4820, updated: "2 days ago" },
  { id: 2, name: "PM Kisan Samman Nidhi", category: "Agriculture", active: true, applications: 12340, updated: "1 day ago" },
  { id: 3, name: "Ayushman Bharat PM-JAY", category: "Healthcare", active: true, applications: 8910, updated: "3 days ago" },
  { id: 4, name: "National Scholarship Portal", category: "Education", active: false, applications: 3200, updated: "1 week ago" },
  { id: 5, name: "PM MUDRA Yojana", category: "Business", active: true, applications: 5670, updated: "4 days ago" },
];

const pendingVerifications = [
  { id: 1, user: "Priya Sharma", docType: "Income Certificate", uploadedAt: "10 min ago", state: "UP" },
  { id: 2, user: "Mohammed Iqbal", docType: "Caste Certificate", uploadedAt: "23 min ago", state: "Bihar" },
  { id: 3, user: "Sunita Devi", docType: "Domicile Certificate", uploadedAt: "45 min ago", state: "Rajasthan" },
  { id: 4, user: "Arjun Patel", docType: "Bank Passbook", uploadedAt: "1 hr ago", state: "Gujarat" },
];

const categoryColors: Record<string, string> = {
  Housing: "bg-indigo-100 text-indigo-700",
  Agriculture: "bg-emerald-100 text-emerald-700",
  Healthcare: "bg-rose-100 text-rose-700",
  Education: "bg-amber-100 text-amber-700",
  Business: "bg-cyan-100 text-cyan-700",
};

export default function AdminPage() {
  const [schemeList, setSchemeList] = useState(schemes);
  const [rejectionReason, setRejectionReason] = useState<number | null>(null);

  const toggleScheme = (id: number) => {
    setSchemeList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl p-4 text-white relative overflow-hidden"
              style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                <Icon size={16} className="text-white" />
              </div>
              <div className="text-2xl font-extrabold text-white">{stat.value}</div>
              <div className="text-xs text-white/50 mt-0.5">{stat.label}</div>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUp size={10} className="text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-400">{stat.delta}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div
        className="rounded-2xl p-5 flex flex-wrap gap-3"
        style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <h2 className="w-full text-sm font-bold text-white/60 uppercase tracking-wider mb-1">Quick Actions</h2>
        <Button leftIcon={<Plus size={14} />} size="sm">
          Add New Scheme
        </Button>
        <Button variant="secondary" size="sm" leftIcon={<FileCheck size={14} />}
          className="bg-white/10 text-white hover:bg-white/20 border-0">
          Process Document Queue
        </Button>
        <Button variant="outline" size="sm" leftIcon={<Bell size={14} />}
          className="border-white/20 text-white/70 hover:bg-white/10 hover:text-white">
          Send Bulk Notification
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Scheme Management Table */}
        <div className="lg:col-span-2">
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <h2 className="font-bold text-white">Scheme Management</h2>
              <Button size="sm" leftIcon={<Plus size={13} />}>
                Add Scheme
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "#1E1B4B" }}>
                    {["Scheme Name", "Category", "Active", "Applications", "Updated", "Actions"].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {schemeList.map((scheme, i) => (
                    <tr
                      key={scheme.id}
                      className="border-t border-white/[0.04] hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-4 py-3.5 font-medium text-white">{scheme.name}</td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${categoryColors[scheme.category]}`}>
                          {scheme.category}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <button onClick={() => toggleScheme(scheme.id)} className="transition-transform hover:scale-110">
                          {scheme.active ? (
                            <ToggleRight size={24} className="text-emerald-400" />
                          ) : (
                            <ToggleLeft size={24} className="text-white/30" />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3.5 text-white/70">{scheme.applications.toLocaleString()}</td>
                      <td className="px-4 py-3.5 text-white/40 text-xs">{scheme.updated}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <button className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-indigo-400 transition-colors">
                            <Edit2 size={12} />
                          </button>
                          <button className="w-7 h-7 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-white/50 hover:text-red-400 transition-colors">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Document Verification Queue */}
        <div>
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <h2 className="font-bold text-white">Verification Queue</h2>
              <Badge variant="missing" className="text-xs">
                {pendingVerifications.length} pending
              </Badge>
            </div>
            <div className="p-3 space-y-2">
              {pendingVerifications.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl p-3 space-y-2"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  {/* Doc thumbnail placeholder */}
                  <div className="w-full h-16 rounded-lg flex items-center justify-center text-white/20 text-xs"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)" }}>
                    <Eye size={14} className="mr-1" /> Click to preview
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.user}</p>
                    <p className="text-xs text-white/50">{item.docType} · {item.state} · {item.uploadedAt}</p>
                  </div>
                  {rejectionReason === item.id ? (
                    <div className="space-y-2">
                      <div className="relative">
                        <select
                          className="w-full text-xs rounded-lg px-3 py-2 pr-7 appearance-none text-white/70 focus:outline-none"
                          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                        >
                          <option>Select reason...</option>
                          <option>Blurry / illegible</option>
                          <option>Incorrect document type</option>
                          <option>Expired document</option>
                          <option>Information mismatch</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-2.5 text-white/40 pointer-events-none" />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 border-0 text-xs"
                          onClick={() => setRejectionReason(null)}
                        >
                          Confirm Reject
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white/50 text-xs"
                          onClick={() => setRejectionReason(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 text-xs"
                        leftIcon={<CheckCircle2 size={12} />}
                      >
                        Approve
                      </Button>
                      <button
                        className="flex-1 text-xs flex items-center justify-center gap-1 rounded-xl font-semibold transition-colors"
                        style={{ border: "1px solid #EF4444", color: "#EF4444", padding: "6px" }}
                        onClick={() => setRejectionReason(item.id)}
                      >
                        <XCircle size={12} /> Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
