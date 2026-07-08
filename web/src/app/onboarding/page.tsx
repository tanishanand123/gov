"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toggleTheme } from "@/lib/theme";
import { api } from "@/lib/api";

const STATES = [
  "Uttar Pradesh", "Maharashtra", "Bihar", "West Bengal", "Madhya Pradesh",
  "Tamil Nadu", "Rajasthan", "Karnataka", "Gujarat", "Andhra Pradesh",
];

const OCCUPATIONS = [
  "Student", "Farmer", "Daily Wage Worker", "Salaried Employee", "Self-Employed", "Unemployed", "Other",
];

const LANGUAGES = [
  { key: "Hindi", label: "🇮🇳 Hindi" },
  { key: "English", label: "🇬🇧 English" },
  { key: "Tamil", label: "🎭 Tamil" },
  { key: "Telugu", label: "🌴 Telugu" },
  { key: "Bengali", label: "🐟 Bengali" },
  { key: "Marathi", label: "🏛 Marathi" },
  { key: "Kannada", label: "☕ Kannada" },
  { key: "Malayalam", label: "🌊 Malayalam" },
  { key: "Gujarati", label: "🦁 Gujarati" },
  { key: "Punjabi", label: "🌾 Punjabi" },
];

function Pill({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <div className={`pill-option${selected ? " selected" : ""}`} onClick={onClick}>
      {label}
    </div>
  );
}

function ToggleRow({
  label, desc, on, onToggle, beta,
}: { label: string; desc: string; on: boolean; onToggle: () => void; beta?: boolean }) {
  return (
    <div className="toggle-row">
      <div>
        <div className="toggle-row-label">{label}{beta && <span className="beta-badge">Beta</span>}</div>
        <div className="toggle-row-desc">{desc}</div>
      </div>
      <button className={`toggle${on ? " on" : ""}`} onClick={onToggle} />
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Step 1
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("Male");
  const [category, setCategory] = useState("OBC");
  const [state, setState] = useState("");

  // Step 2
  const [income, setIncome] = useState(180000);
  const [occupation, setOccupation] = useState("");
  const [bpl, setBpl] = useState(false);
  const [bank, setBank] = useState(true);
  const [pwd, setPwd] = useState(false);

  // Step 3
  const [district, setDistrict] = useState("");
  const [block, setBlock] = useState("");
  const [pincode, setPincode] = useState("");
  const [areaType, setAreaType] = useState<"Rural" | "Urban">("Rural");

  // Step 4
  const [languages, setLanguages] = useState<string[]>(["Hindi"]);
  const [inapp, setInapp] = useState(true);
  const [sms, setSms] = useState(true);
  const [push, setPush] = useState(false);
  const [whatsapp, setWhatsapp] = useState(false);

  const toggleLang = (key: string) => {
    setLanguages((prev) => (prev.includes(key) ? prev.filter((l) => l !== key) : [...prev, key]));
  };

  const finish = async () => {
    const authId = session?.user?.email;
    if (!authId) { router.push("/dashboard"); return; }
    setSaving(true);
    try {
      await api.updateProfile(authId, {
        name,
        dob,
        gender,
        category,
        state,
        income: String(income),
        occupation,
        bpl: bpl ? "Yes" : "No",
        bank: bank ? "Yes" : "No",
        disability: pwd ? "Yes" : "No",
        district,
        block,
        pincode,
        area: areaType,
        language: languages.join(", ") || "English",
        inapp: inapp ? "Enabled" : "Disabled",
        sms: sms ? "Enabled" : "Disabled",
        whatsapp: whatsapp ? "Enabled" : "Disabled",
      });
    } catch {
      // non-fatal — proceed to dashboard even if save fails, user can edit profile later
    } finally {
      setSaving(false);
      router.push("/dashboard");
    }
  };

  const steps = [
    { n: 1, label: "Personal" },
    { n: 2, label: "Economic" },
    { n: 3, label: "Location" },
    { n: 4, label: "Preferences" },
  ];

  return (
    <div className="wizard-page">
      <div className="wizard-header">
        <div className="wizard-header-logo gradient-text-cyan">SmartGov Assist</div>
        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Let&apos;s set up your profile — takes less than 2 minutes</div>
      </div>

      {/* Stepper */}
      <div className="stepper-outer">
        <div className="stepper-row">
          {steps.map((s, i) => (
            <React.Fragment key={s.n}>
              <div className="step-col">
                <div className={`step-circle${step === s.n ? " active" : step > s.n ? " done" : ""}`}>
                  {step > s.n ? "✓" : s.n}
                </div>
                <div className={`step-label${step === s.n ? " active" : ""}`}>{s.label}</div>
              </div>
              {i < steps.length - 1 && (
                <div className="connector-col">
                  <div className={`connector-line${step > s.n ? " done" : ""}`} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="wizard-card">
          <div className="step-icon-circle" style={{ background: "linear-gradient(135deg,#6366F1,#4338CA)" }}>👤</div>
          <h2>Tell us about yourself</h2>
          <div className="sub">This helps us match you to the right government schemes</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="input-wrap">
              <label className="input-label">Full Name</label>
              <input className="input" type="text" placeholder="As per Aadhaar card" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="input-wrap">
              <label className="input-label">Date of Birth</label>
              <input className="input" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
            </div>
            <div className="input-wrap">
              <label className="input-label">Gender</label>
              <div className="pill-group">
                {["Male", "Female", "Other", "Prefer not to say"].map((g) => (
                  <Pill key={g} label={g} selected={gender === g} onClick={() => setGender(g)} />
                ))}
              </div>
            </div>
            <div className="input-wrap">
              <label className="input-label">Social Category</label>
              <div className="pill-group">
                {["General", "OBC", "SC", "ST"].map((c) => (
                  <Pill key={c} label={c} selected={category === c} onClick={() => setCategory(c)} />
                ))}
              </div>
            </div>
            <div className="input-wrap">
              <label className="input-label">State</label>
              <select className="input" value={state} onChange={(e) => setState(e.target.value)}>
                <option value="">Select your state</option>
                {STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="nav-row">
            <span />
            <button className="btn btn-primary" onClick={() => setStep(2)}>Next →</button>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="wizard-card">
          <div className="step-icon-circle" style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}>₹</div>
          <h2>Economic Details</h2>
          <div className="sub">Used to check financial eligibility criteria</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="input-wrap">
              <label className="input-label">Annual Family Income</label>
              <div className="input-icon-wrap">
                <span className="icon-left">₹</span>
                <input
                  className="input"
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value) || 0)}
                />
              </div>
              <input
                type="range"
                className="range-slider"
                min={0}
                max={1000000}
                step={10000}
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                style={{ marginTop: 10 }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                <span>₹0</span><span style={{ color: "#10B981" }}>Below ₹2L</span><span style={{ color: "#F59E0B" }}>₹2–5L</span><span style={{ color: "#EF4444" }}>Above ₹5L</span><span>₹10L+</span>
              </div>
            </div>
            <div className="input-wrap">
              <label className="input-label">Occupation</label>
              <select className="input" value={occupation} onChange={(e) => setOccupation(e.target.value)}>
                <option value="">Select occupation</option>
                {OCCUPATIONS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <ToggleRow label="BPL Card Holder" desc="Below Poverty Line ration card" on={bpl} onToggle={() => setBpl(!bpl)} />
            <ToggleRow label="Bank Account" desc="Active bank account for DBT" on={bank} onToggle={() => setBank(!bank)} />
            <ToggleRow label="Person with Disability (PwD)" desc="Eligible for additional schemes" on={pwd} onToggle={() => setPwd(!pwd)} />
          </div>

          <div className="nav-row">
            <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
            <button className="btn btn-primary" onClick={() => setStep(3)}>Next →</button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="wizard-card">
          <div className="step-icon-circle" style={{ background: "linear-gradient(135deg,#06B6D4,#0891B2)" }}>📍</div>
          <h2>Location Details</h2>
          <div className="sub">State schemes vary — accurate location unlocks more eligibility</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="grid-2">
              <div className="input-wrap">
                <label className="input-label">State</label>
                <select className="input" value={state} onChange={(e) => setState(e.target.value)}>
                  {STATES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="input-wrap">
                <label className="input-label">District</label>
                <input className="input" type="text" placeholder="District" value={district} onChange={(e) => setDistrict(e.target.value)} />
              </div>
            </div>
            <div className="grid-2">
              <div className="input-wrap">
                <label className="input-label">Block / Taluka</label>
                <input className="input" type="text" placeholder="Block name" value={block} onChange={(e) => setBlock(e.target.value)} />
              </div>
              <div className="input-wrap">
                <label className="input-label">Pincode</label>
                <input className="input" type="text" maxLength={6} placeholder="226001" value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))} />
              </div>
            </div>
            <div className="input-wrap">
              <label className="input-label">Area Type</label>
              <div className="pill-group">
                <Pill label="🏘 Rural" selected={areaType === "Rural"} onClick={() => setAreaType("Rural")} />
                <Pill label="🏙 Urban" selected={areaType === "Urban"} onClick={() => setAreaType("Urban")} />
              </div>
            </div>
            <div style={{ borderRadius: 12, background: "var(--surface-elevated)", height: 120, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: 13, border: "1px solid var(--border)" }}>
              🗺 Map preview — {state || "select a state"}
            </div>
          </div>

          <div className="nav-row">
            <button className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
            <button className="btn btn-primary" onClick={() => setStep(4)}>Next →</button>
          </div>
        </div>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <div className="wizard-card">
          <div className="step-icon-circle" style={{ background: "linear-gradient(135deg,#EC4899,#DB2777)" }}>🔔</div>
          <h2>Preferences</h2>
          <div className="sub">Personalise your experience</div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Choose your preferred language</div>
            <div className="lang-grid">
              {LANGUAGES.map((l) => (
                <div key={l.key} className={`lang-pill${languages.includes(l.key) ? " selected" : ""}`} onClick={() => toggleLang(l.key)}>
                  {l.label}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>How should we notify you?</div>
            <div>
              <ToggleRow label="In-App Notifications" desc="Bell icon alerts inside SmartGov" on={inapp} onToggle={() => setInapp(!inapp)} />
              <ToggleRow label="SMS Alerts" desc="Text messages on your mobile" on={sms} onToggle={() => setSms(!sms)} />
              <ToggleRow label="Push Notifications" desc="Browser / device notifications" on={push} onToggle={() => setPush(!push)} />
              <ToggleRow label="WhatsApp" desc="Scheme updates on WhatsApp" on={whatsapp} onToggle={() => setWhatsapp(!whatsapp)} beta />
            </div>
          </div>

          <div className="nav-row" style={{ flexDirection: "column", gap: 10 }}>
            <button className="btn btn-primary btn-full" style={{ height: 52, borderRadius: 14, fontSize: 15 }} onClick={finish} disabled={saving}>
              {saving ? "Saving…" : "Finish Setup → 🎉"}
            </button>
            <div style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)" }}>
              Takes less than 30 seconds. You can update these anytime.
            </div>
            <button className="btn btn-outline btn-full" onClick={() => setStep(3)}>← Back</button>
          </div>
        </div>
      )}

      <div style={{ position: "fixed", bottom: 20, right: 20 }}>
        <button className="btn btn-secondary" onClick={toggleTheme}>🌙</button>
      </div>
    </div>
  );
}
