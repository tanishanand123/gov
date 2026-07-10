"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { api, type ProfileFields } from "@/lib/api";
import {
  INDIA_STATES, STATE_OTHER, GENDERS, CATEGORIES, OCCUPATIONS, AREA_TYPES, YES_NO, ENABLED_DISABLED,
} from "@/lib/constants";
import { Save, Pencil } from "lucide-react";

type FieldType = "text" | "date" | "select" | "readonly";
interface FieldDef { label: string; key: string; type: FieldType; options?: string[]; }
interface SectionDef { id: string; label: string; fields: FieldDef[]; }

const SECTIONS: SectionDef[] = [
  {
    id: "personal", label: "Personal Information",
    fields: [
      { label: "Full Name", key: "name", type: "text" },
      { label: "Date of Birth", key: "dob", type: "date" },
      { label: "Gender", key: "gender", type: "select", options: GENDERS },
      { label: "Category", key: "category", type: "select", options: CATEGORIES },
      { label: "Mobile", key: "mobile", type: "text" },
      { label: "Email", key: "email", type: "readonly" },
    ],
  },
  {
    id: "economic", label: "Economic Details",
    fields: [
      { label: "Annual Income", key: "income", type: "text" },
      { label: "Occupation", key: "occupation", type: "select", options: OCCUPATIONS },
      { label: "BPL Card", key: "bpl", type: "select", options: YES_NO },
      { label: "Bank Account", key: "bank", type: "select", options: YES_NO },
      { label: "PwD Status", key: "disability", type: "select", options: YES_NO },
    ],
  },
  {
    id: "location", label: "Location Details",
    fields: [
      { label: "State", key: "state", type: "select", options: [...INDIA_STATES, STATE_OTHER] },
      { label: "District", key: "district", type: "text" },
      { label: "Pincode", key: "pincode", type: "text" },
      { label: "Area Type", key: "area", type: "select", options: AREA_TYPES },
    ],
  },
  {
    id: "preferences", label: "Preferences & Notifications",
    fields: [
      { label: "Language", key: "language", type: "text" },
      { label: "SMS Alerts", key: "sms", type: "select", options: ENABLED_DISABLED },
      { label: "WhatsApp", key: "whatsapp", type: "select", options: ENABLED_DISABLED },
      { label: "In-App Notifications", key: "inapp", type: "select", options: ENABLED_DISABLED },
    ],
  },
];

const DOB_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function dobToInputValue(dob: string): string {
  const m = dob.match(/^(\d{1,2}) (\w+) (\d{4})$/);
  if (!m) return "";
  const day = m[1].padStart(2, "0");
  const monthIdx = DOB_MONTHS.findIndex((mo) => mo === m[2]);
  if (monthIdx === -1) return "";
  return `${m[3]}-${String(monthIdx + 1).padStart(2, "0")}-${day}`;
}

function inputValueToDob(value: string): string {
  const [y, mo, d] = value.split("-");
  if (!y || !mo || !d) return "";
  const monthName = DOB_MONTHS[Number(mo) - 1];
  if (!monthName) return "";
  return `${Number(d)} ${monthName} ${y}`;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const authId = session?.user?.email || "";

  const [values, setValues] = useState<ProfileFields>({});
  const [draft, setDraft] = useState<ProfileFields>({});
  const [editing, setEditing] = useState(false);
  const [stateOtherMode, setStateOtherMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* eslint-disable react-hooks/set-state-in-effect -- intentional fetch-on-mount with cancellation guard */
  useEffect(() => {
    if (!authId) { setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    api.getProfile(authId).then((data) => {
      if (cancelled) return; // authId changed (account switch) while this request was in flight
      setValues(data);
      setError(null);
    }).catch((e) => {
      if (cancelled) return;
      setError(e instanceof Error ? e.message : "Failed to load profile");
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [authId]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const displayName = values.name || session?.user?.name || "";
  const initials = displayName.split(" ").filter(Boolean).map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  const completion = Object.values(values).filter((v) => v && v !== "Not set").length
    ? Math.round((Object.values(values).filter((v) => v).length / Object.keys(values).length) * 100)
    : 0;

  const startEditing = () => {
    const seed: ProfileFields = {};
    SECTIONS.forEach((section) => {
      section.fields.forEach((f) => { seed[f.key] = values[f.key] ?? (f.key === "email" ? authId : ""); });
    });
    setDraft(seed);
    setStateOtherMode(!!seed.state && !INDIA_STATES.includes(seed.state));
    setEditing(true);
  };

  const cancelEditing = () => setEditing(false);

  const saveAll = async () => {
    if (!authId) return;
    setSaving(true);
    try {
      const updated = await api.updateProfile(authId, draft);
      setValues(updated);
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (!authId) {
    return <div className="card" style={{ textAlign: "center", color: "var(--text-muted)" }}>Sign in to view your profile.</div>;
  }

  if (loading) {
    return <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-muted)" }}>Loading profile…</div>;
  }

  return (
    <div>
      {error && (
        <div style={{ background: "#FEE2E2", color: "#DC2626", borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 16 }}>{error}</div>
      )}

      <div className="profile-header-card">
        <div className="profile-avatar">{initials || "?"}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{displayName || "Complete your profile"}</div>
          <div style={{ opacity: 0.85, fontSize: 14, marginBottom: 12 }}>{values.mobile || "No mobile set"} • {authId}</div>
          <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 8 }}>{completion}% complete</div>
          <div style={{ height: 6, background: "rgba(255,255,255,0.3)", borderRadius: 3, width: 200 }}>
            <div style={{ height: "100%", width: `${completion}%`, background: "#fff", borderRadius: 3 }} />
          </div>
        </div>
        {editing ? (
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" style={{ background: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 13, borderRadius: 10 }} onClick={cancelEditing} disabled={saving}>
              Cancel
            </button>
            <button className="btn" style={{ background: "#fff", color: "#4F46E5", fontSize: 13, borderRadius: 10 }} onClick={saveAll} disabled={saving}>
              {saving ? "Saving…" : (<><Save size={14} strokeWidth={2} /> Save Profile</>)}
            </button>
          </div>
        ) : (
          <button
            className="btn"
            style={{ background: "#fff", color: "#4F46E5", fontSize: 13, borderRadius: 10 }}
            onClick={startEditing}
          >
            <Pencil size={14} strokeWidth={2} /> Edit Profile
          </button>
        )}
      </div>

      {SECTIONS.map((section) => {
        return (
          <div key={section.id} id={`section-${section.id}`} className="profile-section-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3>{section.label}</h3>
            </div>
            <div className="profile-field-grid">
              {section.fields.map((field) => {
                const value = draft[field.key] ?? "";
                const isCustomState = field.key === "state" && stateOtherMode;
                return (
                  <div className="profile-field" key={field.key}>
                    <label>{field.label}</label>
                    {editing ? (
                      field.type === "date" ? (
                        <input
                          className="input"
                          type="date"
                          value={dobToInputValue(value)}
                          onChange={(e) => setDraft((prev) => ({ ...prev, [field.key]: inputValueToDob(e.target.value) }))}
                        />
                      ) : field.type === "select" ? (
                        <>
                          <select
                            className="input"
                            value={isCustomState ? STATE_OTHER : value}
                            onChange={(e) => {
                              const v = e.target.value;
                              if (field.key === "state") setStateOtherMode(v === STATE_OTHER);
                              setDraft((prev) => ({ ...prev, [field.key]: v === STATE_OTHER ? "" : v }));
                            }}
                          >
                            <option value="">Select {field.label.toLowerCase()}</option>
                            {field.options?.map((o) => <option key={o}>{o}</option>)}
                          </select>
                          {field.key === "state" && isCustomState && (
                            <input
                              className="input"
                              style={{ marginTop: 8 }}
                              type="text"
                              placeholder="Enter your state / UT name"
                              value={value}
                              onChange={(e) => setDraft((prev) => ({ ...prev, state: e.target.value }))}
                            />
                          )}
                        </>
                      ) : field.type === "readonly" ? (
                        <input className="input" value={value} disabled title="Email is linked to your login and can't be changed here" />
                      ) : (
                        <input
                          className="input"
                          value={value}
                          onChange={(e) => setDraft((prev) => ({ ...prev, [field.key]: e.target.value }))}
                        />
                      )
                    ) : (
                      <span>{values[field.key] || "Not set"}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
