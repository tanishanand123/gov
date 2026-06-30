"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Upload,
  Sparkles,
  FileText,
  CreditCard,
  Home,
  GraduationCap,
  ExternalLink,
  ClipboardCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { twMerge } from "tailwind-merge";

const steps = ["Review Documents", "Fill Application", "Confirm & Submit"];

const documents = [
  { name: "Aadhaar Card", uploaded: "3 days ago", verified: true, required: true, icon: CreditCard },
  { name: "Income Certificate", uploaded: "1 week ago", verified: true, required: true, icon: FileText },
  { name: "Bank Passbook", uploaded: "2 days ago", verified: true, required: true, icon: Home },
  { name: "Caste Certificate", uploaded: null, verified: false, required: false, icon: FileText },
  { name: "Domicile Certificate", uploaded: "5 days ago", verified: true, required: false, icon: GraduationCap },
];

type FieldConfidence = "high" | "medium" | "empty";

const formFields: {
  label: string;
  value: string;
  confidence: FieldConfidence;
  editable: boolean;
}[] = [
  { label: "Full Name", value: "Rajan Kumar", confidence: "high", editable: false },
  { label: "Date of Birth", value: "01 January 2000", confidence: "high", editable: false },
  { label: "Gender", value: "Male", confidence: "high", editable: false },
  { label: "Category", value: "OBC", confidence: "high", editable: false },
  { label: "Annual Family Income", value: "₹1,80,000", confidence: "high", editable: false },
  { label: "State", value: "Uttar Pradesh", confidence: "high", editable: false },
  { label: "District", value: "Lucknow", confidence: "medium", editable: true },
  { label: "Pincode", value: "226 005", confidence: "medium", editable: true },
  { label: "Bank Account Number", value: "XXXX XXXX 4521", confidence: "high", editable: false },
  { label: "IFSC Code", value: "SBIN0001234", confidence: "medium", editable: true },
  { label: "Course Name", value: "", confidence: "empty", editable: true },
];

const confidenceConfig = {
  high: {
    borderClass: "border-border",
    label: "Auto-filled",
    icon: Lock,
    iconClass: "text-success",
  },
  medium: {
    borderClass: "border-warning",
    label: "Please verify",
    icon: AlertTriangle,
    iconClass: "text-warning",
  },
  empty: {
    borderClass: "border-danger",
    label: "Fill required",
    icon: XCircle,
    iconClass: "text-danger",
  },
};

export default function ApplyPage({ params }: { params: { id: string } }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(
    Object.fromEntries(formFields.map((f) => [f.label, f.value]))
  );

  const schemeId = params.id;
  const schemeName = schemeId === "scholarship"
    ? "National Scholarship Portal 2026"
    : schemeId === "pm-kisan"
    ? "PM Kisan Samman Nidhi"
    : "PM Awas Yojana";

  const autoFilledCount = formFields.filter((f) => f.confidence !== "empty").length;
  const requiredDocs = documents.filter((d) => d.required);
  const missingRequired = requiredDocs.filter((d) => !d.verified);
  const emptyRequired = formFields.filter((f) => f.confidence === "empty");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back link */}
      <Link
        href={`/dashboard/schemes/${schemeId}`}
        className="flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors"
      >
        <ArrowLeft size={14} /> Back to Scheme
      </Link>

      {/* Stepper */}
      <div className="flex items-center gap-0">
        {steps.map((step, idx) => {
          const done = idx < currentStep;
          const active = idx === currentStep;
          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div
                  className={twMerge(
                    "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all",
                    done
                      ? "bg-success border-success text-white"
                      : active
                      ? "border-primary text-primary bg-indigo-50"
                      : "border-border text-muted bg-surface"
                  )}
                >
                  {done ? <CheckCircle2 size={16} /> : idx + 1}
                </div>
                <span
                  className={twMerge(
                    "text-xs mt-1.5 font-medium whitespace-nowrap",
                    active ? "text-primary" : done ? "text-success" : "text-muted"
                  )}
                >
                  {step}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className="flex-1 h-0.5 mb-5 mx-1 rounded-full"
                  style={{
                    background: idx < currentStep
                      ? "linear-gradient(to right, #10B981, #06B6D4)"
                      : "#E2E8F0",
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* STEP 1: Document Review */}
      {currentStep === 0 && (
        <div className="space-y-4">
          <div>
            <h1 className="text-xl font-extrabold text-text">Documents for {schemeName}</h1>
            <p className="text-sm text-muted mt-0.5">Review which documents will be used for this application.</p>
          </div>

          <div className="space-y-2">
            {documents.map((doc) => {
              const Icon = doc.icon;
              return (
                <div
                  key={doc.name}
                  className={twMerge(
                    "flex items-center gap-4 p-4 rounded-xl border transition-colors",
                    doc.verified
                      ? "border-success/30 bg-green-50/50"
                      : "border-danger/30 bg-red-50/50"
                  )}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      doc.verified ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    <Icon size={18} className={doc.verified ? "text-success" : "text-danger"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-text">{doc.name}</p>
                      {!doc.required && (
                        <span className="text-xs text-muted bg-elevated px-2 py-0.5 rounded-full">Optional</span>
                      )}
                    </div>
                    <p className="text-xs text-muted mt-0.5">
                      {doc.verified
                        ? `Uploaded ${doc.uploaded} · Verified`
                        : "Not uploaded"}
                    </p>
                  </div>
                  <div className="shrink-0">
                    {doc.verified ? (
                      <CheckCircle2 size={20} className="text-success" />
                    ) : (
                      <Button size="sm" variant="outline" leftIcon={<Upload size={12} />}>
                        Upload
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {missingRequired.length === 0 && (
            <div className="flex items-start gap-3 p-4 rounded-xl border border-primary/30 bg-indigo-50">
              <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-primary font-medium">
                All required documents are uploaded. You're ready to proceed.
              </p>
            </div>
          )}

          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={() => {}}>Cancel</Button>
            <Button rightIcon={<ArrowRight size={14} />} onClick={() => setCurrentStep(1)}>
              Approve & Continue
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: Auto Form Fill */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <div>
            <h1 className="text-xl font-extrabold text-text">Review your auto-filled application</h1>
            <p className="text-sm text-muted mt-0.5">Fields highlighted in amber need your attention.</p>
          </div>

          {/* Auto-fill info chip */}
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-primary/30 bg-indigo-50">
            <Sparkles size={16} className="text-primary shrink-0" />
            <p className="text-sm text-primary font-medium">
              {autoFilledCount} of {formFields.length} fields auto-filled from your profile and documents
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs text-muted">
            <span className="flex items-center gap-1"><Lock size={11} className="text-success" /> Auto-filled</span>
            <span className="flex items-center gap-1"><AlertTriangle size={11} className="text-warning" /> Verify</span>
            <span className="flex items-center gap-1"><XCircle size={11} className="text-danger" /> Fill required</span>
          </div>

          {/* Form fields */}
          <div className="space-y-3">
            {formFields.map((field) => {
              const conf = confidenceConfig[field.confidence];
              const ConfIcon = conf.icon;
              return (
                <div key={field.label}>
                  <label className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1.5">
                    {field.label}
                  </label>
                  <div className="relative">
                    <input
                      className={twMerge(
                        "w-full h-12 px-4 pr-10 rounded-xl border-[1.5px] text-sm text-text bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all",
                        conf.borderClass,
                        !field.editable && field.confidence === "high" ? "bg-slate-50 text-slate-500" : ""
                      )}
                      value={fieldValues[field.label] ?? ""}
                      readOnly={!field.editable}
                      placeholder={field.confidence === "empty" ? `Enter ${field.label.toLowerCase()}` : ""}
                      onChange={(e) =>
                        setFieldValues((prev) => ({ ...prev, [field.label]: e.target.value }))
                      }
                    />
                    <div className="absolute right-3 top-3.5">
                      <ConfIcon size={15} className={conf.iconClass} />
                    </div>
                  </div>
                  {field.confidence === "medium" && (
                    <p className="text-xs text-warning mt-1">Please verify this value is correct.</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Sticky-like bottom row */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="text-sm text-muted">
              <span className="font-bold text-text">
                {formFields.filter((f) => fieldValues[f.label]?.trim()).length}/{formFields.length}
              </span>{" "}
              fields complete
            </div>
            <div className="flex gap-3">
              <Button variant="outline" leftIcon={<ArrowLeft size={13} />} onClick={() => setCurrentStep(0)}>
                Back
              </Button>
              <Button rightIcon={<ArrowRight size={14} />} onClick={() => setCurrentStep(2)}>
                Review & Submit
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Confirmation */}
      {currentStep === 2 && (
        <div className="text-center space-y-6 py-4">
          {/* Success animation */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-success/20 flex items-center justify-center">
                  <CheckCircle2 size={40} className="text-success" />
                </div>
              </div>
              <div className="absolute inset-0 rounded-full animate-ping bg-success/10" />
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-success">Application Submitted!</h1>
            <p className="text-sm text-muted mt-1">{schemeName}</p>
          </div>

          {/* Details card */}
          <div className="card-base p-5 text-left space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Submission ID</span>
              <span className="font-mono font-semibold text-text bg-elevated px-2 py-0.5 rounded-lg text-xs">
                #SGov-2026-00{Math.floor(Math.random() * 900) + 100}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm border-t border-border pt-3">
              <span className="text-muted">Submitted On</span>
              <span className="font-medium text-text">Today, {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
            <div className="flex items-center justify-between text-sm border-t border-border pt-3">
              <span className="text-muted">Documents Attached</span>
              <span className="font-medium text-text">{documents.filter((d) => d.verified).length} documents</span>
            </div>
            <div className="flex items-center justify-between text-sm border-t border-border pt-3">
              <span className="text-muted">Status</span>
              <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-lg">Under Review</span>
            </div>
          </div>

          {/* Next steps */}
          <div className="card-base p-5 text-left">
            <h3 className="font-bold text-text mb-3 flex items-center gap-2">
              <ClipboardCheck size={16} className="text-primary" /> Next Steps
            </h3>
            <ol className="space-y-2">
              {[
                "You'll receive an SMS confirmation within 24 hours.",
                "Track your application status in My Applications.",
                "Visit the official portal to check processing updates.",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted">
                  <div className="w-5 h-5 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" leftIcon={<ExternalLink size={14} />} className="flex-1">
              Track on Official Site
            </Button>
            <Link href="/dashboard/applications" className="flex-1">
              <Button className="w-full" leftIcon={<FileText size={14} />}>
                Save to My Applications
              </Button>
            </Link>
          </div>

          <Link href="/dashboard" className="text-sm text-muted hover:text-primary transition-colors block">
            ← Back to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
}
