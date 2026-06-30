"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Star,
  FileText,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Upload,
  TrendingUp,
  FolderOpen,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";

const statsCards = [
  {
    label: "Matched Schemes",
    value: "12",
    change: "+3 new this week",
    icon: Star,
    color: "bg-indigo-100 text-indigo-600",
    trend: "up",
  },
  {
    label: "Documents Uploaded",
    value: "4/7",
    change: "3 still needed",
    icon: FolderOpen,
    color: "bg-cyan-100 text-cyan-600",
    trend: "neutral",
  },
  {
    label: "Applications",
    value: "2",
    change: "1 in review",
    icon: FileText,
    color: "bg-green-100 text-green-600",
    trend: "up",
  },
  {
    label: "Alerts",
    value: "3",
    change: "Action required",
    icon: Bell,
    color: "bg-amber-100 text-amber-600",
    trend: "alert",
  },
];

const topSchemes = [
  {
    id: "pm-awas",
    name: "PM Awas Yojana",
    ministry: "Ministry of Housing",
    category: "Housing",
    match: 94,
    benefit: "₹2.5L subsidy",
    badge: "eligible" as const,
    badgeLabel: "94% Match",
  },
  {
    id: "pm-kisan",
    name: "PM Kisan Samman Nidhi",
    ministry: "Ministry of Agriculture",
    category: "Agriculture",
    match: 88,
    benefit: "₹6,000/year",
    badge: "eligible" as const,
    badgeLabel: "88% Match",
  },
  {
    id: "ayushman",
    name: "Ayushman Bharat PM-JAY",
    ministry: "Ministry of Health",
    category: "Health",
    match: 76,
    benefit: "₹5L cover",
    badge: "almost" as const,
    badgeLabel: "76% Match",
  },
  {
    id: "scholarship",
    name: "National Scholarship Portal",
    ministry: "Ministry of Education",
    category: "Education",
    match: 82,
    benefit: "₹25,000/year",
    badge: "eligible" as const,
    badgeLabel: "82% Match",
  },
];

const alerts = [
  {
    type: "warning" as const,
    title: "Income Certificate Missing",
    description: "Required for 5 of your matched schemes.",
    action: "Upload Now",
    href: "/dashboard/vault",
    icon: Upload,
    color: "border-l-amber-400 bg-amber-50",
    iconColor: "text-amber-500",
  },
  {
    type: "info" as const,
    title: "PM Kisan Application Deadline",
    description: "Last date to apply: December 31, 2025",
    action: "Apply Now",
    href: "/dashboard/schemes/pm-kisan",
    icon: Clock,
    color: "border-l-primary bg-indigo-50",
    iconColor: "text-primary",
  },
  {
    type: "success" as const,
    title: "Aadhaar Verified Successfully",
    description: "Your Aadhaar has been linked and verified.",
    action: "View Profile",
    href: "/dashboard/profile",
    icon: CheckCircle2,
    color: "border-l-success bg-green-50",
    iconColor: "text-success",
  },
];

const missingDocs = ["Income Certificate", "Caste Certificate", "Bank Passbook"];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 60%, #06B6D4 100%)" }}
      >
        <div className="absolute inset-0 bg-white/5 rounded-2xl" />
        <div className="relative">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-extrabold">Good morning, Rajan! 👋</h1>
              <p className="mt-1 text-indigo-200">
                You have <span className="text-white font-bold">3 action items</span> waiting for you today.
              </p>
            </div>
            <div className="hidden sm:block text-right">
              <div className="text-3xl font-extrabold">12</div>
              <div className="text-indigo-200 text-sm">Schemes Matched</div>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <Link href="/dashboard/schemes">
              <Button variant="secondary" size="sm" pill rightIcon={<ArrowRight size={14} />}>
                View Schemes
              </Button>
            </Link>
            <Link href="/dashboard/vault">
              <Button size="sm" pill className="bg-white/20 text-white hover:bg-white/30 border-0">
                Upload Docs
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Icon size={18} />
                </div>
                {stat.trend === "up" && <TrendingUp size={14} className="text-success" />}
                {stat.trend === "alert" && <AlertTriangle size={14} className="text-amber-500" />}
              </div>
              <div className="text-2xl font-extrabold text-text">{stat.value}</div>
              <div className="text-sm text-muted mt-0.5">{stat.label}</div>
              <div className="text-xs text-muted mt-1">{stat.change}</div>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile completion */}
        <Card className="lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-text">Profile Completion</h2>
            <span className="text-sm font-bold text-primary">72%</span>
          </div>
          <ProgressBar value={72} showLabel />
          <p className="text-xs text-muted mt-3 mb-4">
            Complete your profile to unlock more scheme matches.
          </p>
          <div className="space-y-2">
            {missingDocs.map((doc) => (
              <div key={doc} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted">
                  <div className="w-4 h-4 rounded border-2 border-dashed border-muted" />
                  {doc}
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-xs">Add</Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Top scheme matches */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-text">Top Matches</h2>
            <Link href="/dashboard/schemes" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {topSchemes.map((scheme) => (
              <Link key={scheme.id} href={`/dashboard/schemes/${scheme.id}`} className="block shrink-0 w-64">
                <div className="card-base p-5 hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant={scheme.badge}>{scheme.badgeLabel}</Badge>
                    <ProgressBar value={scheme.match} size="sm" className="w-16 mt-1.5" />
                  </div>
                  <h3 className="font-bold text-sm text-text mb-1">{scheme.name}</h3>
                  <p className="text-xs text-muted mb-3">{scheme.ministry}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-primary">{scheme.benefit}</span>
                    <Badge variant="default" className="text-xs">{scheme.category}</Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div>
        <h2 className="font-bold text-text mb-4">Action Required</h2>
        <div className="space-y-3">
          {alerts.map((alert) => {
            const Icon = alert.icon;
            return (
              <div
                key={alert.title}
                className={`border-l-4 rounded-xl p-4 flex items-start justify-between gap-4 ${alert.color}`}
              >
                <div className="flex items-start gap-3">
                  <Icon size={18} className={`shrink-0 mt-0.5 ${alert.iconColor}`} />
                  <div>
                    <p className="text-sm font-semibold text-text">{alert.title}</p>
                    <p className="text-xs text-muted mt-0.5">{alert.description}</p>
                  </div>
                </div>
                <Link href={alert.href}>
                  <Button variant="outline" size="sm">{alert.action}</Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
