"use client";

import React, { useState } from "react";
import {
  User,
  Briefcase,
  MapPin,
  Bell,
  Edit2,
  Camera,
  CheckCircle2,
  Phone,
  Mail,
  Calendar,
  IndianRupee,
  X,
  Save,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Input } from "@/components/ui/Input";

const profileSections = [
  {
    id: "personal",
    label: "Personal Information",
    icon: User,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
    fields: [
      { label: "Full Name", value: "Rajan Kumar", key: "name" },
      { label: "Date of Birth", value: "01 January 2000", key: "dob" },
      { label: "Gender", value: "Male", key: "gender" },
      { label: "Category", value: "OBC", key: "category" },
      { label: "Mobile Number", value: "+91 98765 43210", key: "mobile" },
      { label: "Email Address", value: "rajan@example.com", key: "email" },
    ],
  },
  {
    id: "economic",
    label: "Economic Details",
    icon: IndianRupee,
    color: "text-amber-500",
    bg: "bg-amber-50",
    fields: [
      { label: "Annual Family Income", value: "₹1,80,000", key: "income" },
      { label: "Occupation", value: "Student", key: "occupation" },
      { label: "BPL Card", value: "Yes", key: "bpl" },
      { label: "Bank Account", value: "Yes — SBI, XXXX4521", key: "bank" },
      { label: "Disability", value: "No", key: "disability" },
    ],
  },
  {
    id: "location",
    label: "Location Details",
    icon: MapPin,
    color: "text-cyan-500",
    bg: "bg-cyan-50",
    fields: [
      { label: "State", value: "Uttar Pradesh", key: "state" },
      { label: "District", value: "Lucknow", key: "district" },
      { label: "Block / Taluka", value: "Alambagh", key: "block" },
      { label: "Pincode", value: "226 005", key: "pincode" },
      { label: "Area Type", value: "Urban", key: "area" },
    ],
  },
  {
    id: "preferences",
    label: "Preferences & Notifications",
    icon: Bell,
    color: "text-pink-500",
    bg: "bg-pink-50",
    fields: [
      { label: "Preferred Language", value: "Hindi, English", key: "language" },
      { label: "In-App Notifications", value: "Enabled", key: "inapp" },
      { label: "SMS Alerts", value: "Enabled", key: "sms" },
      { label: "WhatsApp", value: "Disabled", key: "whatsapp" },
    ],
  },
];

const completedItems = [
  { label: "Aadhaar Card", done: true },
  { label: "PAN Card", done: true },
  { label: "Bank Account", done: true },
  { label: "Income Certificate", done: false },
  { label: "Caste Certificate", done: false },
  { label: "Domicile Certificate", done: false },
  { label: "Passport Photo", done: true },
];

export default function ProfilePage() {
  const [editingSection, setEditingSection] = useState<string | null>(null);

  const completedCount = completedItems.filter((i) => i.done).length;
  const completion = Math.round((completedCount / completedItems.length) * 100);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile header card */}
      <div
        className="rounded-2xl p-7 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 60%, #06B6D4 100%)" }}
      >
        <div className="absolute inset-0 bg-white/5" />
        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center text-white font-extrabold text-3xl border-[3px] border-white shadow-lg">
              RK
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md text-primary hover:scale-110 transition-transform">
              <Camera size={13} />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-extrabold">Rajan Kumar</h1>
            <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1 mt-1 text-white/80 text-sm">
              <span className="flex items-center gap-1"><Phone size={12} /> +91 98765 43210</span>
              <span className="flex items-center gap-1"><Mail size={12} /> rajan@example.com</span>
              <span className="flex items-center gap-1"><Calendar size={12} /> Member since Jan 2026</span>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5">
                <span className="text-sm font-semibold">Profile {completion}% complete</span>
                <Badge variant="eligible" className="text-xs">
                  <CheckCircle2 size={10} className="mr-1" /> Active
                </Badge>
              </div>
              <div className="w-full sm:w-64 h-2 rounded-full bg-white/20">
                <div
                  className="h-2 rounded-full bg-white"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            className="bg-white/20 text-white hover:bg-white/30 border-0 shrink-0"
            leftIcon={<Edit2 size={13} />}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Completion checklist */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-text">Document Completion</h2>
          <span className="text-sm font-bold text-primary">{completedCount}/{completedItems.length} uploaded</span>
        </div>
        <ProgressBar value={completion} showLabel className="mb-4" />
        <div className="grid sm:grid-cols-2 gap-2">
          {completedItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2.5 text-sm">
              {item.done ? (
                <CheckCircle2 size={16} className="text-success shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-dashed border-slate-300 shrink-0" />
              )}
              <span className={item.done ? "text-text" : "text-muted"}>{item.label}</span>
              {!item.done && (
                <span className="ml-auto text-xs text-danger font-medium">Missing</span>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Profile sections */}
      {profileSections.map((section) => {
        const Icon = section.icon;
        const isEditing = editingSection === section.id;

        return (
          <Card key={section.id}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${section.bg}`}>
                  <Icon size={18} className={section.color} />
                </div>
                <h2 className="font-bold text-text">{section.label}</h2>
              </div>
              {isEditing ? (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<X size={13} />}
                    onClick={() => setEditingSection(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    leftIcon={<Save size={13} />}
                    onClick={() => setEditingSection(null)}
                  >
                    Save
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Edit2 size={13} />}
                  onClick={() => setEditingSection(section.id)}
                >
                  Edit
                </Button>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {section.fields.map((field) => (
                <div key={field.key}>
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                    {field.label}
                  </p>
                  {isEditing ? (
                    <Input defaultValue={field.value} className="h-10 text-sm" />
                  ) : (
                    <p className="text-sm font-medium text-text">{field.value}</p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        );
      })}

      {/* Danger zone */}
      <Card>
        <h2 className="font-bold text-text mb-1">Account</h2>
        <p className="text-sm text-muted mb-4">Manage your account data and preferences.</p>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" leftIcon={<Briefcase size={14} />}>
            Download My Data
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="bg-red-50 text-danger border border-red-200 hover:bg-danger hover:text-white"
          >
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
}
