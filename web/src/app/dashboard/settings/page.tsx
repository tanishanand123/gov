"use client";

import React, { useState } from "react";
import { toggleTheme } from "@/lib/theme";

const SUBNAV = [
  { id: "appearance", icon: "🎨", label: "Appearance" },
  { id: "account", icon: "👤", label: "Account" },
  { id: "security", icon: "🔒", label: "Security" },
  { id: "notifications", icon: "🔔", label: "Notifications" },
  { id: "privacy", icon: "🛡", label: "Privacy" },
  { id: "language", icon: "🌐", label: "Language" },
];

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return <button className={`toggle${on ? " on" : ""}`} onClick={onClick} />;
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
            <div key={s.id} className={`settings-subnav-item${panel === s.id ? " active" : ""}`} onClick={() => setPanel(s.id)}>
              {s.icon} {s.label}
            </div>
          ))}
        </div>

        <div className="settings-content">
          {panel === "appearance" && (
            <>
              <div className="card" style={{ marginBottom: 16 }}>
                <h3 style={{ marginBottom: 16 }}>Theme</h3>
                <div style={{ display: "flex", gap: 12 }}>
                  <div className={`pill-option${theme === "light" ? " selected" : ""}`} onClick={() => applyTheme("light")}>☀️ Light</div>
                  <div className={`pill-option${theme === "dark" ? " selected" : ""}`} onClick={() => applyTheme("dark")}>🌙 Dark</div>
                  <div className={`pill-option${theme === "system" ? " selected" : ""}`} onClick={() => setThemeChoice("system")}>💻 System</div>
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
                  <input className="input" type="password" placeholder="Current password" />
                  <input className="input" type="password" placeholder="New password" />
                  <input className="input" type="password" placeholder="Confirm new password" />
                  <button className="btn btn-primary" style={{ width: "fit-content" }}>Update Password</button>
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
              <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 400 }}>
                <div className="input-wrap"><label className="input-label">Full Name</label><input className="input" defaultValue="Rahul Kumar" /></div>
                <div className="input-wrap"><label className="input-label">Email</label><input className="input" defaultValue="rahul@example.com" /></div>
                <div className="input-wrap"><label className="input-label">Mobile</label><input className="input" defaultValue="+91 98765 43210" /></div>
                <button className="btn btn-primary" style={{ width: "fit-content" }}>Save Changes</button>
              </div>
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
        <button className="btn btn-secondary" onClick={toggleTheme}>🌙</button>
      </div>
    </div>
  );
}
