"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileCheck,
  Star,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  BarChart2,
  Map,
} from "lucide-react";

type Range = "7d" | "30d" | "90d";

const ranges: { key: Range; label: string }[] = [
  { key: "7d", label: "Last 7 days" },
  { key: "30d", label: "Last 30 days" },
  { key: "90d", label: "Last 90 days" },
];

const metrics = {
  "7d": {
    dau: { value: "2,847", delta: "+12%", up: true },
    applicationsTotal: { value: "1,284", delta: "+8%", up: true },
    docsUploaded: { value: "2,184", delta: "+22%", up: true },
    newUsers: { value: "651", delta: "+15%", up: true },
    conversionRate: { value: "38%", delta: "-2%", up: false },
    avgMatchScore: { value: "76%", delta: "+1%", up: true },
  },
  "30d": {
    dau: { value: "3,120", delta: "+18%", up: true },
    applicationsTotal: { value: "5,632", delta: "+14%", up: true },
    docsUploaded: { value: "9,200", delta: "+30%", up: true },
    newUsers: { value: "2,812", delta: "+21%", up: true },
    conversionRate: { value: "42%", delta: "+4%", up: true },
    avgMatchScore: { value: "74%", delta: "+3%", up: true },
  },
  "90d": {
    dau: { value: "2,910", delta: "+9%", up: true },
    applicationsTotal: { value: "16,400", delta: "+6%", up: true },
    docsUploaded: { value: "28,000", delta: "+19%", up: true },
    newUsers: { value: "8,940", delta: "+35%", up: true },
    conversionRate: { value: "40%", delta: "+2%", up: true },
    avgMatchScore: { value: "73%", delta: "+5%", up: true },
  },
};

const topSchemes = [
  { name: "PM Kisan Samman Nidhi", applications: 12340, share: 78 },
  { name: "Ayushman Bharat PM-JAY", applications: 8910, share: 56 },
  { name: "PM Awas Yojana", applications: 4820, share: 30 },
  { name: "PM MUDRA Yojana", applications: 5670, share: 36 },
  { name: "National Scholarship Portal", applications: 3200, share: 20 },
];

const stateStats = [
  { state: "Uttar Pradesh", users: 3420, share: 85 },
  { state: "Bihar", users: 2810, share: 70 },
  { state: "Maharashtra", users: 2340, share: 58 },
  { state: "Rajasthan", users: 1980, share: 49 },
  { state: "Gujarat", users: 1650, share: 41 },
  { state: "Madhya Pradesh", users: 1420, share: 35 },
];

const categoryBreakdown = [
  { label: "Housing", value: 24, color: "#6366F1" },
  { label: "Agriculture", value: 38, color: "#10B981" },
  { label: "Healthcare", value: 18, color: "#F59E0B" },
  { label: "Education", value: 12, color: "#EC4899" },
  { label: "Business", value: 8, color: "#06B6D4" },
];

const statCards = [
  { key: "dau", label: "Avg Daily Active Users", icon: Users, color: "from-indigo-500 to-indigo-600" },
  { key: "applicationsTotal", label: "Applications Filed", icon: FileCheck, color: "from-emerald-500 to-emerald-600" },
  { key: "docsUploaded", label: "Documents Uploaded", icon: Star, color: "from-cyan-500 to-cyan-600" },
  { key: "newUsers", label: "New Registrations", icon: Bell, color: "from-rose-500 to-rose-600" },
  { key: "conversionRate", label: "Onboarding → Apply Rate", icon: TrendingUp, color: "from-amber-500 to-amber-600" },
  { key: "avgMatchScore", label: "Avg Scheme Match Score", icon: BarChart2, color: "from-purple-500 to-purple-600" },
];

const barHeights = [30, 45, 60, 40, 55, 70, 50, 65, 80, 60, 75, 90, 70, 55];

export default function AdminAnalyticsPage() {
  const [range, setRange] = useState<Range>("30d");
  const data = metrics[range];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white">Analytics Overview</h1>
          <p className="text-sm text-white/40 mt-0.5">Platform performance and usage metrics</p>
        </div>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {ranges.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                range === r.key ? "bg-indigo-600 text-white" : "text-white/50 hover:text-white"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          const metric = data[card.key as keyof typeof data];
          return (
            <div
              key={card.key}
              className="rounded-2xl p-4"
              style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                  <Icon size={16} className="text-white" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold ${metric.up ? "text-emerald-400" : "text-red-400"}`}>
                  {metric.up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  {metric.delta}
                </div>
              </div>
              <div className="text-2xl font-extrabold text-white">{metric.value}</div>
              <div className="text-xs text-white/40 mt-1">{card.label}</div>
            </div>
          );
        })}
      </div>

      {/* Activity bar chart placeholder */}
      <div
        className="rounded-2xl p-5"
        style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-white">Application Activity</h2>
          <span className="text-xs text-white/30">Daily applications filed</span>
        </div>
        <div className="flex items-end gap-2 h-32">
          {barHeights.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-md transition-all"
                style={{
                  height: `${h}%`,
                  background: i === barHeights.length - 1
                    ? "linear-gradient(to top, #4F46E5, #6366F1)"
                    : "rgba(99,102,241,0.3)",
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-white/20">
          <span>14 days ago</span>
          <span>Today</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Top Schemes */}
        <div className="rounded-2xl p-5" style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.06)" }}>
          <h2 className="font-bold text-white mb-4">Top Schemes by Applications</h2>
          <div className="space-y-4">
            {topSchemes.map((s, i) => (
              <div key={s.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white/30 w-4">{i + 1}</span>
                    <span className="text-sm font-medium text-white">{s.name}</span>
                  </div>
                  <span className="text-xs text-white/50">{s.applications.toLocaleString()}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${s.share}%`, background: "linear-gradient(to right, #4F46E5, #6366F1)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* State breakdown */}
        <div className="rounded-2xl p-5" style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.06)" }}>
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <Map size={16} className="text-indigo-400" /> Users by State
          </h2>
          <div className="space-y-4">
            {stateStats.map((s) => (
              <div key={s.state}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-white">{s.state}</span>
                  <span className="text-xs text-white/50">{s.users.toLocaleString()} users</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${s.share}%`, background: "linear-gradient(to right, #06B6D4, #0891B2)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="rounded-2xl p-5" style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.06)" }}>
        <h2 className="font-bold text-white mb-4">Applications by Category</h2>
        <div className="flex flex-wrap gap-6">
          {categoryBreakdown.map((c) => (
            <div key={c.label} className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-sm" style={{ background: c.color }} />
              <span className="text-sm text-white/70">{c.label}</span>
              <span className="text-sm font-bold text-white">{c.value}%</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex h-4 rounded-full overflow-hidden gap-0.5">
          {categoryBreakdown.map((c) => (
            <div key={c.label} style={{ width: `${c.value}%`, background: c.color }} />
          ))}
        </div>
      </div>
    </div>
  );
}
