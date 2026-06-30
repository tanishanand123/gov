"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  User,
  IndianRupee,
  MapPin,
  Settings,
  ChevronRight,
  ChevronLeft,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";
import { ProgressBar } from "@/components/ui/ProgressBar";

const steps = [
  { id: 1, label: "Personal", icon: User },
  { id: 2, label: "Economic", icon: IndianRupee },
  { id: 3, label: "Location", icon: MapPin },
  { id: 4, label: "Preferences", icon: Settings },
];

const STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

const OCCUPATIONS = [
  "Farmer", "Agricultural Labourer", "Daily Wage Worker", "Self-Employed",
  "Salaried Employee", "Business Owner", "Student", "Homemaker", "Unemployed", "Retired",
];

const LANGUAGES = [
  "English", "Hindi", "Tamil", "Telugu", "Bengali", "Marathi",
  "Gujarati", "Kannada", "Malayalam", "Punjabi", "Odia", "Assamese",
];

function PillGroup({
  options,
  value,
  onChange,
  multi,
}: {
  options: string[];
  value: string | string[];
  onChange: (v: string | string[]) => void;
  multi?: boolean;
}) {
  const toggle = (opt: string) => {
    if (multi) {
      const arr = value as string[];
      onChange(arr.includes(opt) ? arr.filter((x) => x !== opt) : [...arr, opt]);
    } else {
      onChange(opt);
    }
  };
  const isActive = (opt: string) =>
    multi ? (value as string[]).includes(opt) : value === opt;

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
            isActive(opt)
              ? "border-primary bg-indigo-50 text-primary"
              : "border-border bg-surface text-slate-600 hover:border-primary/40"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function Step1() {
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");

  return (
    <div className="space-y-6">
      <Input label="Full Name" placeholder="Enter your full name" />
      <Input label="Date of Birth" type="date" />
      <div>
        <label className="text-sm font-medium text-text mb-2 block">Gender</label>
        <PillGroup
          options={["Male", "Female", "Transgender", "Prefer not to say"]}
          value={gender}
          onChange={(v) => setGender(v as string)}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-text mb-2 block">Social Category</label>
        <PillGroup
          options={["General", "OBC", "SC", "ST", "EWS"]}
          value={category}
          onChange={(v) => setCategory(v as string)}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-text mb-1.5 block">State of Residence</label>
        <select className="input-base">
          <option value="">Select state</option>
          {STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function Step2() {
  const [income, setIncome] = useState(150000);
  const [occupation, setOccupation] = useState("");
  const [bpl, setBpl] = useState(false);
  const [bank, setBank] = useState(false);
  const [pwd, setPwd] = useState(false);

  const formatIncome = (v: number) => {
    if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
    return `₹${(v / 1000).toFixed(0)}K`;
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-text">Annual Household Income</label>
          <span className="text-lg font-bold text-primary">{formatIncome(income)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={1000000}
          step={10000}
          value={income}
          onChange={(e) => setIncome(Number(e.target.value))}
          className="w-full h-2 rounded-full accent-primary cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted mt-1">
          <span>₹0</span>
          <span>₹50K</span>
          <span>₹1L</span>
          <span>₹5L</span>
          <span>₹10L+</span>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-text mb-2 block">Occupation</label>
        <select className="input-base">
          <option value="">Select occupation</option>
          {OCCUPATIONS.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4 pt-2">
        <Toggle
          checked={bpl}
          onChange={setBpl}
          label="BPL Card Holder"
          description="Do you have a Below Poverty Line ration card?"
        />
        <Toggle
          checked={bank}
          onChange={setBank}
          label="Jan Dhan Account"
          description="Do you have a Pradhan Mantri Jan Dhan bank account?"
        />
        <Toggle
          checked={pwd}
          onChange={setPwd}
          label="Person with Disability (PwD)"
          description="Do you have a disability certificate?"
        />
      </div>
    </div>
  );
}

function Step3() {
  const [areaType, setAreaType] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-text mb-2 block">State</label>
        <select className="input-base">
          <option value="">Select state</option>
          {STATES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <Input label="District" placeholder="e.g. Nashik" />
      <Input label="Block / Taluka" placeholder="e.g. Igatpuri" />
      <Input label="PIN Code" placeholder="e.g. 422403" maxLength={6} />
      <div>
        <label className="text-sm font-medium text-text mb-2 block">Area Type</label>
        <PillGroup
          options={["Rural", "Urban", "Semi-Urban"]}
          value={areaType}
          onChange={(v) => setAreaType(v as string)}
        />
      </div>
    </div>
  );
}

function Step4() {
  const [languages, setLanguages] = useState<string[]>(["English"]);
  const [notifications, setNotifications] = useState({
    sms: true,
    email: true,
    whatsapp: false,
    push: true,
  });

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-text mb-2 block">Preferred Languages</label>
        <p className="text-xs text-muted mb-3">Select up to 3 languages for scheme information</p>
        <div className="grid grid-cols-3 gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() =>
                setLanguages((prev) =>
                  prev.includes(lang)
                    ? prev.filter((l) => l !== lang)
                    : prev.length < 3
                    ? [...prev, lang]
                    : prev
                )
              }
              className={`py-2 px-3 rounded-xl text-sm font-medium border-2 transition-all text-center ${
                languages.includes(lang)
                  ? "border-primary bg-indigo-50 text-primary"
                  : "border-border bg-surface text-slate-600 hover:border-primary/40"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-semibold text-text">Notification Preferences</p>
        <Toggle
          checked={notifications.sms}
          onChange={(v) => setNotifications((p) => ({ ...p, sms: v }))}
          label="SMS Notifications"
          description="Get updates via SMS on your registered mobile"
        />
        <Toggle
          checked={notifications.email}
          onChange={(v) => setNotifications((p) => ({ ...p, email: v }))}
          label="Email Notifications"
          description="Receive emails about schemes and applications"
        />
        <Toggle
          checked={notifications.whatsapp}
          onChange={(v) => setNotifications((p) => ({ ...p, whatsapp: v }))}
          label="WhatsApp Updates"
          description="Get scheme updates on WhatsApp"
        />
        <Toggle
          checked={notifications.push}
          onChange={(v) => setNotifications((p) => ({ ...p, push: v }))}
          label="Push Notifications"
          description="Browser/app push notifications"
        />
      </div>
    </div>
  );
}

const STEP_CONTENT = [Step1, Step2, Step3, Step4];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const StepComponent = STEP_CONTENT[currentStep - 1];
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-bg flex items-start justify-center py-8 px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg text-text">SmartGov Assist</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-text">Complete Your Profile</h1>
          <p className="text-muted mt-1">Help us find the best schemes for you</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute left-0 right-0 top-5 h-0.5 bg-border" />
          <div
            className="absolute left-0 top-5 h-0.5 progress-gradient transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
          {steps.map((step) => {
            const Icon = step.icon;
            const done = currentStep > step.id;
            const active = currentStep === step.id;
            return (
              <div key={step.id} className="relative flex flex-col items-center gap-2 z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                    done
                      ? "gradient-primary border-primary text-white"
                      : active
                      ? "bg-surface border-primary text-primary"
                      : "bg-surface border-border text-muted"
                  }`}
                >
                  {done ? <Check size={16} /> : <Icon size={16} />}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${active ? "text-primary" : done ? "text-text" : "text-muted"}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div className="card-base p-8">
          <h2 className="text-xl font-bold text-text mb-1">
            Step {currentStep}: {steps[currentStep - 1].label} Details
          </h2>
          <p className="text-sm text-muted mb-6">
            {currentStep === 1 && "Tell us about yourself so we can personalise your experience."}
            {currentStep === 2 && "Your economic details help us match income-based schemes."}
            {currentStep === 3 && "Your location determines state-specific scheme eligibility."}
            {currentStep === 4 && "Customise how you want to receive updates."}
          </p>

          <StepComponent />

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              leftIcon={<ChevronLeft size={16} />}
            >
              Back
            </Button>
            <span className="text-sm text-muted">Step {currentStep} of {steps.length}</span>
            {currentStep < steps.length ? (
              <Button variant="primary" onClick={handleNext} rightIcon={<ChevronRight size={16} />}>
                Continue
              </Button>
            ) : (
              <Link href="/dashboard">
                <Button variant="primary" rightIcon={<Check size={16} />}>
                  Finish Setup
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
