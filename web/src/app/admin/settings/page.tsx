"use client";

import React, { useState } from "react";
import {
  Shield,
  Bell,
  Globe,
  Database,
  Mail,
  Key,
  Save,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

type Tab = "general" | "security" | "notifications" | "integrations";

const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "general", label: "General", icon: Globe },
  { key: "security", label: "Security", icon: Shield },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "integrations", label: "Integrations", icon: Database },
];

function ToggleRow({ label, desc, defaultOn = false }: { label: string; desc: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-white/[0.06] last:border-0">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-white/40 mt-0.5">{desc}</p>
      </div>
      <button onClick={() => setOn(!on)}>
        {on ? <ToggleRight size={26} className="text-indigo-400" /> : <ToggleLeft size={26} className="text-white/30" />}
      </button>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.06)" }}>
      <h2 className="font-bold text-white mb-4">{title}</h2>
      {children}
    </div>
  );
}

function FieldRow({ label, placeholder, type = "text", defaultValue = "" }: { label: string; placeholder: string; type?: string; defaultValue?: string }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full text-sm rounded-xl px-3 py-2.5 text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
      />
    </div>
  );
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white">Admin Settings</h1>
          <p className="text-sm text-white/40 mt-0.5">Platform configuration and preferences</p>
        </div>
        <Button leftIcon={<Save size={14} />} onClick={handleSave} className={saved ? "bg-emerald-600 hover:bg-emerald-600" : ""}>
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      <div className="flex gap-5">
        {/* Sidebar */}
        <div
          className="w-44 shrink-0 rounded-2xl p-3 h-fit space-y-0.5"
          style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === t.key
                    ? "bg-indigo-600 text-white"
                    : "text-white/50 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon size={15} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {activeTab === "general" && (
            <>
              <SectionCard title="Platform Settings">
                <FieldRow label="Platform Name" placeholder="SmartGov Assist" defaultValue="SmartGov Assist" />
                <FieldRow label="Support Email" placeholder="support@smartgov.in" defaultValue="support@smartgov.in" />
                <FieldRow label="Max Doc Upload Size (MB)" placeholder="10" defaultValue="10" />
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">Default Language</label>
                  <div className="relative">
                    <select
                      className="w-full text-sm rounded-xl px-3 py-2.5 pr-8 appearance-none text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                      defaultValue="en"
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="ta">Tamil</option>
                      <option value="te">Telugu</option>
                      <option value="bn">Bengali</option>
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-3 text-white/40 pointer-events-none" />
                  </div>
                </div>
              </SectionCard>
              <SectionCard title="Feature Flags">
                <ToggleRow label="OCR Auto-Extraction" desc="Auto-extract data from uploaded documents" defaultOn />
                <ToggleRow label="Auto Form Fill" desc="Pre-fill application forms from profile + docs" defaultOn />
                <ToggleRow label="Voice Input" desc="Enable voice input on profile forms" />
                <ToggleRow label="SMS Notifications" desc="Send SMS alerts to users for deadlines" defaultOn />
                <ToggleRow label="WhatsApp Integration" desc="Send WhatsApp messages for scheme updates" />
              </SectionCard>
            </>
          )}

          {activeTab === "security" && (
            <>
              <SectionCard title="Authentication">
                <ToggleRow label="Two-Factor Authentication (Admin)" desc="Require 2FA for all admin logins" defaultOn />
                <ToggleRow label="IP Whitelist for Admin" desc="Restrict admin access to approved IPs only" />
                <ToggleRow label="Auto Logout (30 min)" desc="Log out idle admin sessions automatically" defaultOn />
              </SectionCard>
              <SectionCard title="Change Admin Password">
                <FieldRow label="Current Password" placeholder="••••••••" type="password" />
                <FieldRow label="New Password" placeholder="••••••••" type="password" />
                <FieldRow label="Confirm New Password" placeholder="••••••••" type="password" />
                <Button size="sm" leftIcon={<Key size={14} />}>Update Password</Button>
              </SectionCard>
              <SectionCard title="Audit Log">
                <ToggleRow label="Enable Audit Logging" desc="Log all admin actions for compliance" defaultOn />
                <ToggleRow label="Log User Actions" desc="Track document uploads and applications" defaultOn />
                <div className="mt-3">
                  <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">Log Retention Period</label>
                  <div className="relative">
                    <select
                      className="w-full text-sm rounded-xl px-3 py-2.5 pr-8 appearance-none text-white focus:outline-none"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                      defaultValue="90"
                    >
                      <option value="30">30 days</option>
                      <option value="90">90 days</option>
                      <option value="180">180 days</option>
                      <option value="365">1 year</option>
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-3 text-white/40 pointer-events-none" />
                  </div>
                </div>
              </SectionCard>
            </>
          )}

          {activeTab === "notifications" && (
            <>
              <SectionCard title="User Notification Triggers">
                <ToggleRow label="New Scheme Match" desc="Notify users when a new scheme matches their profile" defaultOn />
                <ToggleRow label="Application Deadline" desc="7-day and 1-day deadline reminders" defaultOn />
                <ToggleRow label="Document Expiry" desc="30-day expiry warning for docs in vault" defaultOn />
                <ToggleRow label="Application Status Update" desc="Approved / Rejected / Under Review updates" defaultOn />
                <ToggleRow label="New Scheme Added" desc="Alert users when new schemes are published" defaultOn />
              </SectionCard>
              <SectionCard title="Admin Alerts">
                <ToggleRow label="Daily Summary Email" desc="Daily report of applications and new users" defaultOn />
                <ToggleRow label="Document Queue Alerts" desc="Alert when pending verifications exceed 50" defaultOn />
                <FieldRow label="Admin Alert Email" placeholder="admin@smartgov.in" defaultValue="admin@smartgov.in" />
              </SectionCard>
            </>
          )}

          {activeTab === "integrations" && (
            <>
              <SectionCard title="Government APIs">
                <ToggleRow label="DigiLocker Integration" desc="Pull documents from DigiLocker directly" defaultOn />
                <ToggleRow label="Aadhaar e-KYC" desc="Verify identity via Aadhaar OTP" defaultOn />
                <ToggleRow label="PFMS Integration" desc="Link to Public Financial Management System" />
                <FieldRow label="UMANG API Key" placeholder="Enter API key..." />
              </SectionCard>
              <SectionCard title="Communication">
                <FieldRow label="Twilio SMS SID" placeholder="Enter SID..." />
                <FieldRow label="Twilio Auth Token" placeholder="Enter token..." type="password" />
                <FieldRow label="SMTP Host" placeholder="smtp.sendgrid.net" defaultValue="smtp.sendgrid.net" />
                <FieldRow label="SendGrid API Key" placeholder="Enter API key..." type="password" />
              </SectionCard>
              <SectionCard title="Storage & Database">
                <ToggleRow label="S3 Document Storage" desc="Store uploaded documents in AWS S3" defaultOn />
                <FieldRow label="S3 Bucket Name" placeholder="smartgov-docs-prod" defaultValue="smartgov-docs-prod" />
                <FieldRow label="Database Backup Schedule" placeholder="0 2 * * *" defaultValue="0 2 * * *" />
              </SectionCard>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
