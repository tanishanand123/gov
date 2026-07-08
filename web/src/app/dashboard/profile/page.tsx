"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { api, type ProfileFields } from "@/lib/api";

interface FieldDef { label: string; key: string; }
interface SectionDef { id: string; label: string; fields: FieldDef[]; }

const SECTIONS: SectionDef[] = [
  {
    id: "personal", label: "Personal Information",
    fields: [
      { label: "Full Name", key: "name" },
      { label: "Date of Birth", key: "dob" },
      { label: "Gender", key: "gender" },
      { label: "Category", key: "category" },
      { label: "Mobile", key: "mobile" },
      { label: "Email", key: "email" },
    ],
  },
  {
    id: "economic", label: "Economic Details",
    fields: [
      { label: "Annual Income", key: "income" },
      { label: "Occupation", key: "occupation" },
      { label: "BPL Card", key: "bpl" },
      { label: "Bank Account", key: "bank" },
      { label: "PwD Status", key: "disability" },
    ],
  },
  {
    id: "location", label: "Location Details",
    fields: [
      { label: "State", key: "state" },
      { label: "District", key: "district" },
      { label: "Pincode", key: "pincode" },
      { label: "Area Type", key: "area" },
    ],
  },
  {
    id: "preferences", label: "Preferences & Notifications",
    fields: [
      { label: "Language", key: "language" },
      { label: "SMS Alerts", key: "sms" },
      { label: "WhatsApp", key: "whatsapp" },
      { label: "In-App Notifications", key: "inapp" },
    ],
  },
];

export default function ProfilePage() {
  const { data: session } = useSession();
  const authId = session?.user?.email || "";

  const [values, setValues] = useState<ProfileFields>({});
  const [draft, setDraft] = useState<ProfileFields>({});
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!authId) return;
    try {
      const data = await api.getProfile(authId);
      setValues(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [authId]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional fetch-on-mount
  useEffect(() => { refresh(); }, [refresh]);

  const displayName = values.name || session?.user?.name || "";
  const initials = displayName.split(" ").filter(Boolean).map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  const completion = Object.values(values).filter((v) => v && v !== "Not set").length
    ? Math.round((Object.values(values).filter((v) => v).length / Object.keys(values).length) * 100)
    : 0;

  const startEditing = (section: SectionDef) => {
    const seed: ProfileFields = {};
    section.fields.forEach((f) => { seed[f.key] = values[f.key] ?? ""; });
    setDraft(seed);
    setEditingSection(section.id);
  };

  const saveEditing = async () => {
    if (!editingSection || !authId) return;
    setSaving(true);
    try {
      const updated = await api.updateProfile(authId, draft);
      setValues(updated);
      setEditingSection(null);
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
        <button
          className="btn"
          style={{ background: "#fff", color: "#4F46E5", fontSize: 13, borderRadius: 10 }}
          onClick={() => {
            startEditing(SECTIONS[0]);
            document.getElementById("section-personal")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          Edit Profile ✏️
        </button>
      </div>

      {SECTIONS.map((section) => {
        const isEditing = editingSection === section.id;
        return (
          <div key={section.id} id={`section-${section.id}`} className="profile-section-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3>{section.label}</h3>
              {isEditing ? (
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn-icon" onClick={() => setEditingSection(null)} disabled={saving}>✕</button>
                  <button className="btn-icon" onClick={saveEditing} disabled={saving} title="Save">{saving ? "…" : "💾"}</button>
                </div>
              ) : (
                <button className="btn-icon" onClick={() => startEditing(section)}>✏️</button>
              )}
            </div>
            <div className="profile-field-grid">
              {section.fields.map((field) => (
                <div className="profile-field" key={field.key}>
                  <label>{field.label}</label>
                  {isEditing ? (
                    <input
                      className="input"
                      value={draft[field.key] ?? ""}
                      onChange={(e) => setDraft((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    />
                  ) : (
                    <span>{values[field.key] || "Not set"}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
