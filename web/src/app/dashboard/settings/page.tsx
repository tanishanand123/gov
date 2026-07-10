"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toggleTheme } from "@/lib/theme";
import { api } from "@/lib/api";
import {
  Palette, User, Lock, Bell, Shield, Globe, Eye, EyeOff, Sun, Moon, Monitor,
} from "lucide-react";

const SUBNAV = [
  { id: "appearance", icon: Palette, label: "Appearance" },
  { id: "account", icon: User, label: "Account" },
  { id: "security", icon: Lock, label: "Security" },
  { id: "notifications", icon: Bell, label: "Notifications" },
  { id: "privacy", icon: Shield, label: "Privacy" },
  { id: "language", icon: Globe, label: "Language" },
];

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return <button className={`toggle${on ? " on" : ""}`} onClick={onClick} />;
}

function PasswordInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="input-icon-wrap" style={{ position: "relative" }}>
      <input
        className="input"
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ paddingRight: 40 }}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        title={visible ? "Hide password" : "Show password"}
        style={{
          position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
          background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "var(--text-muted)", padding: 4,
        }}
      >
        {visible ? <EyeOff size={16} strokeWidth={2} /> : <Eye size={16} strokeWidth={2} />}
      </button>
    </div>
  );
}

const SWATCHES = [
  "linear-gradient(135deg,#6366F1,#4338CA)",
  "linear-gradient(135deg,#06B6D4,#0891B2)",
  "linear-gradient(135deg,#10B981,#059669)",
  "linear-gradient(135deg,#F59E0B,#D97706)",
  "linear-gradient(135deg,#F43F5E,#E11D48)",
  "linear-gradient(135deg,#8B5CF6,#7C3AED)",
];

const LANGS = [
  { key: "hi", label: "🇮🇳 Hindi" },
  { key: "en", label: "🇬🇧 English" },
  { key: "ta", label: "🎭 Tamil" },
  { key: "te", label: "🌴 Telugu" },
  { key: "bn", label: "🐟 Bengali" },
  { key: "mr", label: "🏛 Marathi" },
];

export default function SettingsPage() {
  const { data: session } = useSession();
  const authId = session?.user?.email || "";

  const [panel, setPanel] = useState("appearance");
  const [theme, setThemeChoice] = useState<"light" | "dark" | "system">("light");
  const [swatch, setSwatch] = useState(0);
  const [lang, setLang] = useState("hi");

  const [twoFA, setTwoFA] = useState(true);
  const [loginNotifs, setLoginNotifs] = useState(true);
  const [autoLogout, setAutoLogout] = useState(false);

  const [notifInApp, setNotifInApp] = useState(true);
  const [notifSms, setNotifSms] = useState(true);
  const [notifEmail, setNotifEmail] = useState(false);
  const [notifWhatsapp, setNotifWhatsapp] = useState(false);

  const [shareUsage, setShareUsage] = useState(true);
  const [personalized, setPersonalized] = useState(true);

  // Account info — sourced from the profile created during onboarding
  const [accountName, setAccountName] = useState("");
  const [accountMobile, setAccountMobile] = useState("");
  const [accountLoading, setAccountLoading] = useState(true);
  const [accountSaving, setAccountSaving] = useState(false);
  const [accountMsg, setAccountMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  /* eslint-disable react-hooks/set-state-in-effect -- intentional fetch-on-mount with cancellation guard */
  useEffect(() => {
    if (!authId) { setAccountLoading(false); return; }
    let cancelled = false;
    setAccountLoading(true);
    api.getProfile(authId).then((profile) => {
      if (cancelled) return; // authId changed (account switch) while this request was in flight
      setAccountName(profile.name || session?.user?.name || "");
      setAccountMobile(profile.mobile || "");
    }).catch(() => {
      if (cancelled) return;
      setAccountName(session?.user?.name || "");
    }).finally(() => {
      if (!cancelled) setAccountLoading(false);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- session is read but only authId should retrigger the fetch
  }, [authId]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const saveAccount = async () => {
    if (!authId) return;
    setAccountSaving(true);
    setAccountMsg(null);
    try {
      await api.updateProfile(authId, { name: accountName, mobile: accountMobile });
      setAccountMsg({ type: "ok", text: "Account information saved." });
    } catch (e) {
      setAccountMsg({ type: "err", text: e instanceof Error ? e.message : "Failed to save." });
    } finally {
      setAccountSaving(false);
    }
  };

  // Change password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const updatePassword = async () => {
    setPasswordMsg(null);
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMsg({ type: "err", text: "Fill in all password fields." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "err", text: "New password and confirmation don't match." });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMsg({ type: "err", text: "New password must be at least 8 characters." });
      return;
    }
    setPasswordSaving(true);
    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update password");
      setPasswordMsg({ type: "ok", text: "Password updated successfully." });
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (e) {
      setPasswordMsg({ type: "err", text: e instanceof Error ? e.message : "Failed to update password" });
    } finally {
      setPasswordSaving(false);
    }
  };

  const applyTheme = (t: "light" | "dark") => {
    setThemeChoice(t);
    if (t === "light" || t === "dark") {
      document.documentElement.setAttribute("data-theme", t);
      localStorage.setItem("theme", t);
    }
  };

  return (
    <div>
      <div className="page-header"><h1>Settings</h1></div>
      <div className="settings-layout">
        <div className="settings-subnav">
          {SUBNAV.map((s) => (
            <div key={s.id} className={`settings-subnav-item${panel === s.id ? " active" : ""}`} onClick={() => setPanel(s.id)} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <s.icon size={16} strokeWidth={2} /> {s.label}
            </div>
          ))}
        </div>

        <div className="settings-content">
          {panel === "appearance" && (
            <>
              <div className="card" style={{ marginBottom: 16 }}>
                <h3 style={{ marginBottom: 16 }}>Theme</h3>
                <div style={{ display: "flex", gap: 12 }}>
                  <div className={`pill-option${theme === "light" ? " selected" : ""}`} onClick={() => applyTheme("light")} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Sun size={14} strokeWidth={2} /> Light</div>
                  <div className={`pill-option${theme === "dark" ? " selected" : ""}`} onClick={() => applyTheme("dark")} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Moon size={14} strokeWidth={2} /> Dark</div>
                  <div className={`pill-option${theme === "system" ? " selected" : ""}`} onClick={() => setThemeChoice("system")} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Monitor size={14} strokeWidth={2} /> System</div>
                </div>
              </div>
              <div className="card">
                <h3 style={{ marginBottom: 16 }}>Accent Color</h3>
                <div style={{ display: "flex", gap: 10 }}>
                  {SWATCHES.map((bg, i) => (
                    <div key={i} className={`color-swatch${swatch === i ? " selected" : ""}`} style={{ background: bg }} onClick={() => setSwatch(i)} />
                  ))}
                </div>
              </div>
            </>
          )}

          {panel === "security" && (
            <>
              <div className="card" style={{ marginBottom: 16 }}>
                <h3 style={{ marginBottom: 16 }}>Security Options</h3>
                <div className="toggle-row">
                  <div><div style={{ fontSize: 14, fontWeight: 500 }}>Two-Factor Authentication</div><div style={{ fontSize: 12, color: "var(--text-muted)" }}>Extra security via OTP on login</div></div>
                  <Toggle on={twoFA} onClick={() => setTwoFA(!twoFA)} />
                </div>
                <div className="toggle-row">
                  <div><div style={{ fontSize: 14, fontWeight: 500 }}>Login Notifications</div><div style={{ fontSize: 12, color: "var(--text-muted)" }}>Get alerted on new logins</div></div>
                  <Toggle on={loginNotifs} onClick={() => setLoginNotifs(!loginNotifs)} />
                </div>
                <div className="toggle-row">
                  <div><div style={{ fontSize: 14, fontWeight: 500 }}>Auto Logout after inactivity</div><div style={{ fontSize: 12, color: "var(--text-muted)" }}>Logout after 30 minutes of inactivity</div></div>
                  <Toggle on={autoLogout} onClick={() => setAutoLogout(!autoLogout)} />
                </div>
              </div>
              <div className="card">
                <h3 style={{ marginBottom: 16 }}>Change Password</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 400 }}>
                  {passwordMsg && (
                    <div style={{
                      fontSize: 13, borderRadius: 8, padding: "8px 12px",
                      background: passwordMsg.type === "ok" ? "#DCFCE7" : "#FEE2E2",
                      color: passwordMsg.type === "ok" ? "#16A34A" : "#DC2626",
                    }}>
                      {passwordMsg.text}
                    </div>
                  )}
                  <PasswordInput value={currentPassword} onChange={setCurrentPassword} placeholder="Current password" />
                  <PasswordInput value={newPassword} onChange={setNewPassword} placeholder="New password" />
                  <PasswordInput value={confirmPassword} onChange={setConfirmPassword} placeholder="Confirm new password" />
                  <button className="btn btn-primary" style={{ width: "fit-content" }} onClick={updatePassword} disabled={passwordSaving}>
                    {passwordSaving ? "Updating…" : "Update Password"}
                  </button>
                </div>
              </div>
            </>
          )}

          {panel === "notifications" && (
            <div className="card">
              <h3 style={{ marginBottom: 16 }}>Notification Preferences</h3>
              <div className="toggle-row"><div><div style={{ fontSize: 14, fontWeight: 500 }}>In-App Notifications</div></div><Toggle on={notifInApp} onClick={() => setNotifInApp(!notifInApp)} /></div>
              <div className="toggle-row"><div><div style={{ fontSize: 14, fontWeight: 500 }}>SMS Alerts</div></div><Toggle on={notifSms} onClick={() => setNotifSms(!notifSms)} /></div>
              <div className="toggle-row"><div><div style={{ fontSize: 14, fontWeight: 500 }}>Email Digest</div></div><Toggle on={notifEmail} onClick={() => setNotifEmail(!notifEmail)} /></div>
              <div className="toggle-row"><div><div style={{ fontSize: 14, fontWeight: 500 }}>WhatsApp Alerts <span className="beta-badge">Beta</span></div></div><Toggle on={notifWhatsapp} onClick={() => setNotifWhatsapp(!notifWhatsapp)} /></div>
            </div>
          )}

          {panel === "account" && (
            <div className="card">
              <h3 style={{ marginBottom: 16 }}>Account Information</h3>
              {accountLoading ? (
                <div style={{ color: "var(--text-muted)", fontSize: 14 }}>Loading…</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 400 }}>
                  {accountMsg && (
                    <div style={{
                      fontSize: 13, borderRadius: 8, padding: "8px 12px",
                      background: accountMsg.type === "ok" ? "#DCFCE7" : "#FEE2E2",
                      color: accountMsg.type === "ok" ? "#16A34A" : "#DC2626",
                    }}>
                      {accountMsg.text}
                    </div>
                  )}
                  <div className="input-wrap">
                    <label className="input-label">Full Name</label>
                    <input className="input" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
                  </div>
                  <div className="input-wrap">
                    <label className="input-label">Email</label>
                    <input className="input" value={authId} disabled title="Email is linked to your login and can't be changed here" />
                  </div>
                  <div className="input-wrap">
                    <label className="input-label">Mobile</label>
                    <input className="input" value={accountMobile} onChange={(e) => setAccountMobile(e.target.value)} />
                  </div>
                  <button className="btn btn-primary" style={{ width: "fit-content" }} onClick={saveAccount} disabled={accountSaving}>
                    {accountSaving ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          )}

          {panel === "privacy" && (
            <div className="card">
              <h3 style={{ marginBottom: 16 }}>Privacy Settings</h3>
              <div className="toggle-row">
                <div><div style={{ fontSize: 14, fontWeight: 500 }}>Share anonymous usage data</div><div style={{ fontSize: 12, color: "var(--text-muted)" }}>Helps improve SmartGov for everyone</div></div>
                <Toggle on={shareUsage} onClick={() => setShareUsage(!shareUsage)} />
              </div>
              <div className="toggle-row">
                <div><div style={{ fontSize: 14, fontWeight: 500 }}>Allow personalised recommendations</div></div>
                <Toggle on={personalized} onClick={() => setPersonalized(!personalized)} />
              </div>
            </div>
          )}

          {panel === "language" && (
            <div className="card">
              <h3 style={{ marginBottom: 16 }}>Language Preference</h3>
              <div className="lang-grid">
                {LANGS.map((l) => (
                  <div key={l.key} className={`lang-pill${lang === l.key ? " selected" : ""}`} onClick={() => setLang(l.key)}>{l.label}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ position: "fixed", bottom: 20, right: 20 }}>
        <button className="btn btn-secondary" onClick={toggleTheme}><Moon size={16} strokeWidth={2} /></button>
      </div>
    </div>
  );
}
