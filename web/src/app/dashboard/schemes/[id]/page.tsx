"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  FileText,
  Info,
  ListChecks,
  Clipboard,
  ExternalLink,
  IndianRupee,
  Calendar,
  Building2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Card } from "@/components/ui/Card";

const schemeData: Record<string, {
  name: string;
  ministry: string;
  category: string;
  benefit: string;
  amount: string;
  deadline: string;
  matchScore: number;
  description: string;
  fullDescription: string;
  eligibility: Array<{ criterion: string; required: string; yours: string; met: boolean }>;
  requiredDocs: Array<{ name: string; uploaded: boolean; description: string }>;
  howToApply: string[];
}> = {
  "pm-awas": {
    name: "PM Awas Yojana (Gramin)",
    ministry: "Ministry of Housing & Urban Affairs",
    category: "Housing",
    benefit: "₹2.5 Lakh",
    amount: "₹2,50,000",
    deadline: "March 31, 2026",
    matchScore: 94,
    description: "Financial assistance for construction of pucca houses for the rural poor.",
    fullDescription: "Pradhan Mantri Awas Yojana (Gramin) aims at providing housing for all in rural areas by 2024. Under this scheme, financial assistance of ₹1.20 lakh in plain areas and ₹1.30 lakh in hilly states/difficult areas/Integrated Action Plan (IAP) districts is provided to Beneficiaries for construction of a pucca house.",
    eligibility: [
      { criterion: "Income Category", required: "EWS/LIG", yours: "EWS", met: true },
      { criterion: "Age", required: "18-65 years", yours: "34 years", met: true },
      { criterion: "Residential Status", required: "Indian Citizen", yours: "Indian Citizen", met: true },
      { criterion: "House Ownership", required: "No pucca house", yours: "Kutcha house", met: true },
      { criterion: "BPL Card", required: "Yes", yours: "Yes", met: true },
      { criterion: "Aadhaar Linked", required: "Mandatory", yours: "Linked", met: true },
    ],
    requiredDocs: [
      { name: "Aadhaar Card", uploaded: true, description: "Valid Aadhaar card with linked mobile number" },
      { name: "Income Certificate", uploaded: false, description: "Issued by Revenue Officer / Tehsildar" },
      { name: "Land Records / Khasra", uploaded: false, description: "Proof of land ownership or tenancy" },
      { name: "BPL Ration Card", uploaded: true, description: "Below Poverty Line ration card" },
      { name: "Bank Passbook", uploaded: true, description: "First page showing account details" },
      { name: "Self-declaration Form", uploaded: false, description: "Affidavit declaring no pucca house" },
    ],
    howToApply: [
      "Visit the official PMAY-G portal at pmayg.nic.in or your nearest Common Service Centre (CSC).",
      "Register with Aadhaar number and mobile number for OTP verification.",
      "Complete the online application form with household and income details.",
      "Upload required documents (Income Certificate, Land Records, BPL Card).",
      "Gram Sabha will verify your eligibility and recommend your name.",
      "Approval is done at the district level; you'll receive an SMS notification.",
      "Funds are released in 3 instalments directly to your linked bank account.",
    ],
  },
  "pm-kisan": {
    name: "PM Kisan Samman Nidhi",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    category: "Agriculture",
    benefit: "₹6,000/year",
    amount: "₹6,000 per year (₹2,000 per instalment × 3)",
    deadline: "December 31, 2025",
    matchScore: 88,
    description: "Direct income support of ₹6000 per year to farmer families.",
    fullDescription: "Under PM-KISAN, the Central Government provides income support of ₹6000 per year to all farmer families, payable in three equal instalments of ₹2000 each every four months. The money is directly transferred to the bank accounts of the beneficiaries.",
    eligibility: [
      { criterion: "Land Ownership", required: "Cultivable land", yours: "2.5 acres", met: true },
      { criterion: "Age", required: "18+ years", yours: "34 years", met: true },
      { criterion: "Citizenship", required: "Indian Citizen", yours: "Citizen", met: true },
      { criterion: "Tax Payer", required: "Not an income tax payer", yours: "Non-taxpayer", met: true },
      { criterion: "Government Job", required: "Not a Govt. employee", yours: "Not applicable", met: true },
      { criterion: "Aadhaar Linked Bank Account", required: "Mandatory", yours: "Linked", met: true },
    ],
    requiredDocs: [
      { name: "Aadhaar Card", uploaded: true, description: "Linked to bank account" },
      { name: "Land Records (Khasra/Khatauni)", uploaded: false, description: "Proof of agricultural land" },
      { name: "Bank Passbook", uploaded: true, description: "Account linked with Aadhaar" },
      { name: "Mobile Number", uploaded: true, description: "Registered with Aadhaar" },
    ],
    howToApply: [
      "Visit pmkisan.gov.in and click 'New Farmer Registration'.",
      "Enter your Aadhaar number and choose Rural or Urban Farmer.",
      "Fill in personal and bank account details.",
      "Upload land records and other required documents.",
      "Submit the form — your State Government will verify the details.",
      "After verification, you'll receive ₹2000 every 4 months via DBT.",
    ],
  },
};

const DEFAULT_SCHEME = schemeData["pm-awas"];

type ContentTab = "about" | "eligibility" | "documents" | "apply";

const contentTabs: { key: ContentTab; label: string; icon: React.ReactNode }[] = [
  { key: "about", label: "About", icon: <Info size={15} /> },
  { key: "eligibility", label: "Eligibility", icon: <ListChecks size={15} /> },
  { key: "documents", label: "Documents", icon: <FileText size={15} /> },
  { key: "apply", label: "How to Apply", icon: <Clipboard size={15} /> },
];

export default function SchemeDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const scheme = schemeData[id] || DEFAULT_SCHEME;
  const [tab, setTab] = useState<ContentTab>("about");

  const uploadedCount = scheme.requiredDocs.filter((d) => d.uploaded).length;

  return (
    <div className="space-y-6 pb-24">
      {/* Breadcrumb */}
      <Link
        href="/dashboard/schemes"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Schemes
      </Link>

      {/* Hero */}
      <div className="card-base p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <Badge variant="eligible">{scheme.category}</Badge>
              <Badge variant="processing">{scheme.matchScore}% Match</Badge>
            </div>
            <h1 className="text-2xl font-extrabold text-text">{scheme.name}</h1>
            <div className="flex items-center gap-2 mt-2 text-muted text-sm">
              <Building2 size={14} />
              {scheme.ministry}
            </div>
          </div>

          {/* Benefit highlight */}
          <div className="shrink-0 text-center p-5 rounded-2xl bg-indigo-50 border-2 border-indigo-100 min-w-[160px]">
            <IndianRupee size={20} className="text-primary mx-auto mb-1" />
            <div className="text-2xl font-extrabold text-primary">{scheme.benefit}</div>
            <div className="text-xs text-muted mt-1">Benefit Amount</div>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-border grid sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <Calendar size={16} className="text-muted" />
            <div>
              <p className="text-xs text-muted">Application Deadline</p>
              <p className="text-sm font-semibold text-text">{scheme.deadline}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FileText size={16} className="text-muted" />
            <div>
              <p className="text-xs text-muted">Documents</p>
              <p className="text-sm font-semibold text-text">{uploadedCount}/{scheme.requiredDocs.length} uploaded</p>
            </div>
          </div>
          <div>
            <ProgressBar
              value={scheme.matchScore}
              label="Your Eligibility"
              showLabel
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* Content tabs */}
      <div className="flex gap-1 bg-elevated rounded-xl p-1 w-fit overflow-x-auto">
        {contentTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
              tab === t.key ? "bg-surface shadow text-primary" : "text-muted hover:text-text"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "about" && (
        <Card>
          <h2 className="text-lg font-bold text-text mb-3">About This Scheme</h2>
          <p className="text-slate-600 leading-relaxed">{scheme.fullDescription}</p>

          <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <div className="flex items-center gap-2 mb-2">
              <Info size={16} className="text-primary" />
              <span className="text-sm font-semibold text-primary">Benefit Details</span>
            </div>
            <p className="text-sm text-slate-700">{scheme.amount}</p>
          </div>
        </Card>
      )}

      {tab === "eligibility" && (
        <Card>
          <h2 className="text-lg font-bold text-text mb-4">Eligibility Criteria</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 pr-4 font-semibold text-text">Criterion</th>
                  <th className="text-left py-3 pr-4 font-semibold text-text">Required</th>
                  <th className="text-left py-3 pr-4 font-semibold text-text">Your Profile</th>
                  <th className="text-left py-3 font-semibold text-text">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {scheme.eligibility.map((row) => (
                  <tr key={row.criterion} className={row.met ? "" : "bg-red-50"}>
                    <td className="py-3 pr-4 font-medium text-text">{row.criterion}</td>
                    <td className="py-3 pr-4 text-muted">{row.required}</td>
                    <td className="py-3 pr-4 text-text">{row.yours}</td>
                    <td className="py-3">
                      {row.met ? (
                        <span className="flex items-center gap-1 text-success text-xs font-semibold">
                          <CheckCircle2 size={14} /> Met
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-danger text-xs font-semibold">
                          <XCircle size={14} /> Not Met
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === "documents" && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text">Required Documents</h2>
            <span className="text-sm font-semibold text-primary">{uploadedCount}/{scheme.requiredDocs.length} uploaded</span>
          </div>
          <ProgressBar value={uploadedCount} max={scheme.requiredDocs.length} className="mb-6" />
          <div className="space-y-3">
            {scheme.requiredDocs.map((doc) => (
              <div key={doc.name} className={`flex items-center gap-4 p-4 rounded-xl border-2 ${doc.uploaded ? "border-success/30 bg-green-50" : "border-dashed border-border"}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${doc.uploaded ? "bg-success text-white" : "bg-elevated text-muted"}`}>
                  {doc.uploaded ? <CheckCircle2 size={18} /> : <FileText size={18} />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-text">{doc.name}</p>
                  <p className="text-xs text-muted">{doc.description}</p>
                </div>
                {doc.uploaded ? (
                  <Badge variant="verified">Uploaded</Badge>
                ) : (
                  <Link href="/dashboard/vault">
                    <Button variant="outline" size="sm">Upload</Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "apply" && (
        <Card>
          <h2 className="text-lg font-bold text-text mb-4">How to Apply</h2>
          <ol className="space-y-4">
            {scheme.howToApply.map((step, i) => (
              <li key={i} className="flex gap-4">
                <div className="w-7 h-7 rounded-full gradient-primary text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed pt-0.5">{step}</p>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex items-center gap-2 text-sm text-muted">
            <ExternalLink size={14} />
            <a href="#" className="hover:text-primary hover:underline">Visit official scheme website</a>
          </div>
        </Card>
      )}

      {/* Sticky action bar */}
      <div className="fixed bottom-0 left-64 right-0 bg-surface border-t border-border px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-text">{scheme.name}</p>
          <p className="text-xs text-muted">Deadline: {scheme.deadline}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Save for Later</Button>
          <Button variant="primary" size="lg" rightIcon={<ExternalLink size={16} />}>
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
}
