"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Filter,
  ChevronDown,
  FileText,
  ArrowRight,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";

type Tab = "all" | "eligible" | "almost" | "applied";

const schemes = [
  {
    id: "pm-awas",
    name: "PM Awas Yojana (Gramin)",
    ministry: "Ministry of Housing & Urban Affairs",
    category: "Housing",
    categoryVariant: "housing" as const,
    benefit: "₹2.5 Lakh",
    match: 94,
    status: "eligible" as const,
    statusLabel: "94% Match",
    requiredDocs: ["Aadhaar", "Income Cert.", "Land Records"],
    description: "Financial assistance for construction of pucca houses for the rural poor.",
  },
  {
    id: "pm-kisan",
    name: "PM Kisan Samman Nidhi",
    ministry: "Ministry of Agriculture",
    category: "Agriculture",
    categoryVariant: "agriculture" as const,
    benefit: "₹6,000/year",
    match: 88,
    status: "eligible" as const,
    statusLabel: "88% Match",
    requiredDocs: ["Aadhaar", "Land Records", "Bank Passbook"],
    description: "Direct income support of ₹6000 per year to farmer families.",
  },
  {
    id: "ayushman",
    name: "Ayushman Bharat PM-JAY",
    ministry: "Ministry of Health & Family Welfare",
    category: "Health",
    categoryVariant: "health" as const,
    benefit: "₹5L/year",
    match: 76,
    status: "almost" as const,
    statusLabel: "76% — 1 doc missing",
    requiredDocs: ["Aadhaar", "PMJAY Card"],
    description: "Health cover of ₹5 lakh per family per year for secondary and tertiary care.",
  },
  {
    id: "nsp-scholarship",
    name: "National Scholarship Portal",
    ministry: "Ministry of Education",
    category: "Education",
    categoryVariant: "education" as const,
    benefit: "₹25,000/year",
    match: 82,
    status: "eligible" as const,
    statusLabel: "82% Match",
    requiredDocs: ["Aadhaar", "Marksheet", "Income Cert."],
    description: "Merit-cum-means scholarship for students from SC/ST/OBC/Minority communities.",
  },
  {
    id: "mudra-loan",
    name: "PM Mudra Yojana",
    ministry: "Ministry of Finance",
    category: "Finance",
    categoryVariant: "finance" as const,
    benefit: "Up to ₹10L",
    match: 65,
    status: "almost" as const,
    statusLabel: "65% — 2 docs missing",
    requiredDocs: ["Aadhaar", "Business Proof", "Bank Statement"],
    description: "Collateral-free loans for non-corporate, non-farm micro/small enterprises.",
  },
  {
    id: "mahatma-gandhi-nrega",
    name: "Mahatma Gandhi NREGA",
    ministry: "Ministry of Rural Development",
    category: "Employment",
    categoryVariant: "employment" as const,
    benefit: "100 days/year",
    match: 91,
    status: "applied" as const,
    statusLabel: "Applied",
    requiredDocs: ["Aadhaar", "Job Card"],
    description: "Guarantees 100 days of wage employment in a financial year to rural households.",
  },
  {
    id: "sukanya-samriddhi",
    name: "Sukanya Samriddhi Yojana",
    ministry: "Ministry of Finance",
    category: "Finance",
    categoryVariant: "finance" as const,
    benefit: "7.6% interest",
    match: 78,
    status: "eligible" as const,
    statusLabel: "78% Match",
    requiredDocs: ["Aadhaar", "Birth Certificate", "Guardian ID"],
    description: "Small savings scheme for girl children below 10 years with high interest rate.",
  },
  {
    id: "pradhan-mantri-fasal",
    name: "PM Fasal Bima Yojana",
    ministry: "Ministry of Agriculture",
    category: "Agriculture",
    categoryVariant: "agriculture" as const,
    benefit: "Crop insurance",
    match: 85,
    status: "eligible" as const,
    statusLabel: "85% Match",
    requiredDocs: ["Aadhaar", "Land Records", "Bank Passbook"],
    description: "Crop insurance scheme to provide financial support to farmers for crop failure.",
  },
  {
    id: "jan-aushadhi",
    name: "Pradhan Mantri Jan Aushadhi",
    ministry: "Ministry of Health",
    category: "Health",
    categoryVariant: "health" as const,
    benefit: "90% savings",
    match: 70,
    status: "almost" as const,
    statusLabel: "70% — Missing",
    requiredDocs: ["Aadhaar"],
    description: "Quality generic medicines at affordable prices through dedicated stores.",
  },
];

const tabs: { key: Tab; label: string }[] = [
  { key: "all", label: "All Schemes" },
  { key: "eligible", label: "Eligible" },
  { key: "almost", label: "Almost Eligible" },
  { key: "applied", label: "Applied" },
];

const SORT_OPTIONS = ["Best Match", "Benefit Amount", "Deadline", "Alphabetical"];

export default function SchemesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [sort, setSort] = useState("Best Match");
  const [search, setSearch] = useState("");

  const filtered = schemes.filter((s) => {
    if (activeTab !== "all" && s.status !== activeTab) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-text">Eligible Schemes</h1>
          <p className="text-muted text-sm mt-1">{schemes.length} schemes found based on your profile</p>
        </div>
      </div>

      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            placeholder="Search schemes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-base pl-9"
          />
        </div>
        <Button variant="outline" leftIcon={<Filter size={16} />}>
          Filter
        </Button>
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input-base h-10 pr-9 appearance-none"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-elevated rounded-xl p-1 w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === t.key
                ? "bg-surface shadow text-primary"
                : "text-muted hover:text-text"
            }`}
          >
            {t.label}
            <span className="ml-1.5 text-xs">
              ({t.key === "all" ? schemes.length : schemes.filter((s) => s.status === t.key).length})
            </span>
          </button>
        ))}
      </div>

      {/* Scheme cards grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((scheme) => (
          <div key={scheme.id} className="card-base p-5 flex flex-col hover:shadow-md transition-all hover:-translate-y-0.5">
            <div className="flex items-start justify-between mb-3">
              <Badge variant={scheme.categoryVariant}>{scheme.category}</Badge>
              <Badge variant={scheme.status}>{scheme.statusLabel}</Badge>
            </div>

            <h3 className="font-bold text-text mb-1">{scheme.name}</h3>
            <p className="text-xs text-muted mb-3">{scheme.ministry}</p>
            <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1">{scheme.description}</p>

            {scheme.status !== "applied" && (
              <div className="mb-4">
                <ProgressBar
                  value={scheme.match}
                  label={`${scheme.match}% eligibility`}
                  showLabel
                  size="sm"
                  variant={scheme.match >= 80 ? "primary" : "amber"}
                />
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-muted">Benefit</p>
                <p className="text-lg font-extrabold text-primary">{scheme.benefit}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted">Required Docs</p>
                <div className="flex flex-wrap gap-1 justify-end mt-1">
                  {scheme.requiredDocs.slice(0, 2).map((doc) => (
                    <span key={doc} className="text-xs bg-elevated text-slate-600 px-2 py-0.5 rounded-full">
                      {doc}
                    </span>
                  ))}
                  {scheme.requiredDocs.length > 2 && (
                    <span className="text-xs bg-elevated text-muted px-2 py-0.5 rounded-full">
                      +{scheme.requiredDocs.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Link href={`/dashboard/schemes/${scheme.id}`}>
              <Button
                variant={scheme.status === "applied" ? "ghost" : "primary"}
                fullWidth
                size="sm"
                rightIcon={<ArrowRight size={14} />}
              >
                {scheme.status === "applied" ? "View Application" : "View & Apply"}
              </Button>
            </Link>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <FileText size={48} className="text-muted mx-auto mb-4" />
          <p className="text-text font-semibold">No schemes found</p>
          <p className="text-muted text-sm mt-1">Try adjusting your filters or search term.</p>
        </div>
      )}
    </div>
  );
}
