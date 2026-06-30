"use client";

import React, { useState } from "react";
import {
  User,
  Shield,
  Bell,
  Eye,
  Globe,
  Palette,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  Lock,
  Smartphone,
  LogOut,
  Check,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";
import { twMerge } from "tailwind-merge";

const categories = [
  { id: "account", label: "Account", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Eye },
  { id: "language", label: "Language", icon: Globe },
  { id: "appearance", label: "Appearance", icon: Palette },
];

const accentColors = [
  { name: "Indigo", hex: "#4F46E5", gradient: "linear-gradient(135deg, #6366F1, #4338CA)" },
  { name: "Cyan", hex: "#06B6D4", gradient: "linear-gradient(135deg, #22D3EE, #0891B2)" },
  { name: "Emerald", hex: "#10B981", gradient: "linear-gradient(135deg, #34D399, #059669)" },
  { name: "Amber", hex: "#F59E0B", gradient: "linear-gradient(135deg, #FCD34D, #D97706)" },
  { name: "Rose", hex: "#F43F5E", gradient: "linear-gradient(135deg, #FB7185, #E11D48)" },
  { name: "Purple", hex: "#8B5CF6", gradient: "linear-gradient(135deg, #A78BFA, #7C3AED)" },
];

const languages = [
  { code: "en", flag: "🇬🇧", name: "English" },
  { code: "hi", flag: "🇮🇳", name: "Hindi" },
  { code: "ta", flag: "🏴", name: "Tamil" },
  { code: "te", flag: "🏴", name: "Telugu" },
  { code: "bn", flag: "🏴", name: "Bengali" },
  { code: "mr", flag: "🏴", name: "Marathi" },
  { code: "kn", flag: "🏴", name: "Kannada" },
  { code: "ml", flag: "🏴", name: "Malayalam" },
  { code: "gu", flag: "🏴", name: "Gujarati" },
  { code: "pa", flag: "🏴", name: "Punjabi" },
];

export default function SettingsPage() {
  const [activeCategory, setActiveCategory] = useState("account");
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [accentColor, setAccentColor] = useState("#4F46E5");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [twoFA, setTwoFA] = useState(false);
  const [loginNotifs, setLoginNotifs] = useState(true);
  const [autoLogout, setAutoLogout] = useState(true);
  const [inApp, setInApp] = useState(true);
  const [sms, setSms] = useState(true);
  const [push, setPush] = useState(false);
  const [whatsapp, setWhatsapp] = useState(false);
  const [profileVisible, setProfileVisible] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-text">Settings</h1>
        <p className="text-sm text-muted mt-0.5">Manage your account preferences and configurations.</p>
      </div>

      <div className="flex gap-6">
        {/* Category sidebar */}
        <div className="w-52 shrink-0">
          <Card className="p-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={twMerge(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left",
                    active
                      ? "bg-indigo-50 text-primary border-l-[3px] border-primary pl-[calc(0.75rem-3px)]"
                      : "text-slate-600 hover:bg-elevated hover:text-text"
                  )}
                >
                  <Icon size={16} className={active ? "text-primary" : "text-slate-400"} />
                  {cat.label}
                  {active && <ChevronRight size={13} className="ml-auto text-primary" />}
                </button>
              );
            })}
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {/* ACCOUNT */}
          {activeCategory === "account" && (
            <>
              <Card>
                <h2 className="font-bold text-text mb-4">Account Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1.5">Full Name</label>
                    <Input defaultValue="Rajan Kumar" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1.5">Email Address</label>
                    <Input defaultValue="rajan@example.com" type="email" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1.5">Mobile Number</label>
                    <Input defaultValue="+91 98765 43210" />
                  </div>
                  <Button leftIcon={<Check size={14} />}>Save Changes</Button>
                </div>
              </Card>
              <Card>
                <h2 className="font-bold text-text mb-1">Danger Zone</h2>
                <p className="text-sm text-muted mb-4">These actions are irreversible. Proceed with caution.</p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" size="sm">Download My Data</Button>
                  <Button
                    size="sm"
                    className="bg-red-50 text-danger border border-red-200 hover:bg-danger hover:text-white transition-colors"
                  >
                    Delete Account
                  </Button>
                </div>
              </Card>
            </>
          )}

          {/* SECURITY */}
          {activeCategory === "security" && (
            <>
              <Card>
                <h2 className="font-bold text-text mb-4">Security</h2>
                <div className="space-y-4">
                  {[
                    { label: "Two-Factor Authentication", desc: "Add an extra layer of security via OTP", value: twoFA, set: setTwoFA, icon: Smartphone },
                    { label: "Login Notifications", desc: "Get notified when a new device signs in", value: loginNotifs, set: setLoginNotifs, icon: Bell },
                    { label: "Auto Logout", desc: "Sign out after 30 minutes of inactivity", value: autoLogout, set: setAutoLogout, icon: LogOut },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-center justify-between gap-4 py-3 border-b border-border last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                            <Icon size={16} className="text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-text">{item.label}</p>
                            <p className="text-xs text-muted">{item.desc}</p>
                          </div>
                        </div>
                        <Toggle checked={item.value} onChange={item.set} />
                      </div>
                    );
                  })}
                </div>
              </Card>
              <Card>
                <h2 className="font-bold text-text mb-4">Change Password</h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1.5">Current Password</label>
                    <Input type="password" placeholder="Enter current password" leftIcon={<Lock size={15} />} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1.5">New Password</label>
                    <Input type="password" placeholder="Enter new password" leftIcon={<Lock size={15} />} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1.5">Confirm Password</label>
                    <Input type="password" placeholder="Confirm new password" leftIcon={<Lock size={15} />} />
                  </div>
                  <Button>Update Password</Button>
                </div>
              </Card>
            </>
          )}

          {/* NOTIFICATIONS */}
          {activeCategory === "notifications" && (
            <Card>
              <h2 className="font-bold text-text mb-4">Notification Preferences</h2>
              <div className="space-y-1">
                {[
                  { label: "In-App Notifications", desc: "Show alerts inside the SmartGov app", value: inApp, set: setInApp },
                  { label: "SMS Alerts", desc: "Receive updates via text message", value: sms, set: setSms },
                  { label: "Push Notifications", desc: "Browser push notifications", value: push, set: setPush },
                  { label: "WhatsApp", desc: "Receive scheme updates on WhatsApp", value: whatsapp, set: setWhatsapp, badge: "Beta" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-4 py-4 border-b border-border last:border-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-text">{item.label}</p>
                        {item.badge && (
                          <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted mt-0.5">{item.desc}</p>
                    </div>
                    <Toggle checked={item.value} onChange={item.set} />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* PRIVACY */}
          {activeCategory === "privacy" && (
            <Card>
              <h2 className="font-bold text-text mb-4">Privacy Settings</h2>
              <div className="space-y-1">
                {[
                  { label: "Profile Visibility", desc: "Allow government portals to view your profile", value: profileVisible, set: setProfileVisible },
                  { label: "Anonymous Data Sharing", desc: "Help improve SmartGov with anonymous usage data", value: dataSharing, set: setDataSharing },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-4 py-4 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-text">{item.label}</p>
                      <p className="text-xs text-muted mt-0.5">{item.desc}</p>
                    </div>
                    <Toggle checked={item.value} onChange={item.set} />
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <Button variant="outline" size="sm">View Privacy Policy</Button>
              </div>
            </Card>
          )}

          {/* LANGUAGE */}
          {activeCategory === "language" && (
            <Card>
              <h2 className="font-bold text-text mb-4">Language</h2>
              <p className="text-sm text-muted mb-4">Choose the language you want to use in SmartGov Assist.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {languages.map((lang) => {
                  const selected = selectedLanguage === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => setSelectedLanguage(lang.code)}
                      className={twMerge(
                        "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all",
                        selected
                          ? "border-primary bg-indigo-50 text-primary"
                          : "border-border text-text hover:border-primary/40 hover:bg-elevated"
                      )}
                    >
                      <span className="text-base">{lang.flag}</span>
                      {lang.name}
                      {selected && <Check size={13} className="ml-auto text-primary" />}
                    </button>
                  );
                })}
              </div>
              <Button className="mt-4">Apply Language</Button>
            </Card>
          )}

          {/* APPEARANCE */}
          {activeCategory === "appearance" && (
            <>
              <Card>
                <h2 className="font-bold text-text mb-4">Theme</h2>
                <div className="grid grid-cols-3 gap-3">
                  {(["light", "dark", "system"] as const).map((t) => {
                    const icons = { light: Sun, dark: Moon, system: Monitor };
                    const Icon = icons[t];
                    const selected = theme === t;
                    return (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={twMerge(
                          "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                          selected
                            ? "border-primary bg-indigo-50"
                            : "border-border hover:border-primary/40 hover:bg-elevated"
                        )}
                      >
                        <Icon size={22} className={selected ? "text-primary" : "text-muted"} />
                        <span className={twMerge("text-sm font-semibold capitalize", selected ? "text-primary" : "text-text")}>
                          {t}
                        </span>
                        {selected && <Check size={13} className="text-primary" />}
                      </button>
                    );
                  })}
                </div>
              </Card>
              <Card>
                <h2 className="font-bold text-text mb-4">Accent Color</h2>
                <div className="flex gap-3 flex-wrap">
                  {accentColors.map((color) => {
                    const selected = accentColor === color.hex;
                    return (
                      <button
                        key={color.hex}
                        onClick={() => setAccentColor(color.hex)}
                        title={color.name}
                        className={twMerge(
                          "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                          selected ? "ring-2 ring-offset-2 ring-current scale-110" : "hover:scale-105"
                        )}
                        style={{ background: color.gradient, color: color.hex }}
                      >
                        {selected && <Check size={14} className="text-white" />}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-muted mt-3">Selected: {accentColors.find(c => c.hex === accentColor)?.name}</p>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
