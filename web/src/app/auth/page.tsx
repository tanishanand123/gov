"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toggleTheme } from "@/lib/theme";

type Tab = "login" | "register";

function pwScore(password: string): number {
  let score = 0;
  if (password.length >= 6) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const PW_CLASSES = ["", "weak", "fair", "strong", "vstrong"];
const PW_LABELS = ["", "Weak", "Fair", "Strong", "Very Strong"];
const PW_COLORS = ["", "#EF4444", "#F59E0B", "#10B981", "#6366F1"];

function PasswordStrength({ password }: { password: string }) {
  const score = pwScore(password);
  return (
    <>
      <div className="pw-strength">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`pw-segment${i < score ? " " + PW_CLASSES[score] : ""}`} />
        ))}
      </div>
      {password && (
        <div style={{ fontSize: 12, color: PW_COLORS[score] || "var(--text-muted)", marginTop: 4 }}>
          {PW_LABELS[score]}
        </div>
      )}
    </>
  );
}

function ErrorBanner({ msg }: { msg: string }) {
  return (
    <div style={{ background: "#FEE2E2", color: "#DC2626", borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 4 }}>
      {msg}
    </div>
  );
}

function OTPModal({
  open,
  onClose,
  mobile,
  devOtp,
  onVerified,
}: {
  open: boolean;
  onClose: () => void;
  mobile: string;
  devOtp: string;
  onVerified: () => void;
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const verify = async () => {
    const code = otp.join("");
    if (code.length < 6) { setError("Enter all 6 digits."); return; }
    setLoading(true);
    setError("");
    const res = await fetch("/api/otp", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, otp: code }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.valid) {
      onVerified();
    } else {
      setError(data.error || "Invalid OTP.");
      setOtp(["", "", "", "", "", ""]);
      refs.current[0]?.focus();
    }
  };

  const resend = async () => {
    setError("");
    setOtp(["", "", "", "", "", ""]);
    await fetch("/api/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile }),
    });
  };

  if (!open) return null;

  return (
    <div className={`modal-overlay${open ? " open" : ""}`}>
      <div className="modal otp-modal">
        <div style={{ textAlign: "center", marginBottom: 6, fontSize: 40 }}>📱</div>
        <h3>Verify your mobile</h3>
        <div className="sub">
          Enter the 6-digit OTP sent to<br /><strong>+91-{mobile}</strong>
        </div>

        {devOtp && (
          <div style={{ background: "#EEF2FF", borderRadius: 10, padding: 12, textAlign: "center", marginBottom: 14 }}>
            <p style={{ fontSize: 11, color: "#4F46E5", fontWeight: 600, marginBottom: 4 }}>Dev mode — OTP (no SMS sent)</p>
            <p style={{ fontSize: 22, fontWeight: 800, letterSpacing: "0.3em", color: "#4338CA" }}>{devOtp}</p>
          </div>
        )}

        <div className="otp-row">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              className="otp-box"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
            />
          ))}
        </div>

        {error && <div style={{ marginTop: 12 }}><ErrorBanner msg={error} /></div>}

        <button className="btn btn-primary btn-full mt-4" style={{ marginTop: 20 }} onClick={verify} disabled={loading}>
          {loading ? "Verifying…" : "Verify OTP →"}
        </button>
        <button className="btn btn-outline btn-full mt-2" style={{ marginTop: 8 }} onClick={onClose}>Cancel</button>

        <div className="countdown">
          Didn&apos;t receive it?{" "}
          <span style={{ cursor: "pointer" }} onClick={resend}>Resend</span>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("register");

  const [loginId, setLoginId] = useState("");
  const [loginPwd, setLoginPwd] = useState("");
  const [showLoginPwd, setShowLoginPwd] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [regName, setRegName] = useState("");
  const [regMobile, setRegMobile] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPwd, setRegPwd] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [showRegPwd, setShowRegPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  const [otpOpen, setOtpOpen] = useState(false);
  const [devOtp, setDevOtp] = useState("");
  const [pendingRegData, setPendingRegData] = useState<{ name: string; email: string; mobile: string; password: string } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!loginId || !loginPwd) { setLoginError("Please fill in all fields."); return; }
    setLoginLoading(true);
    const res = await signIn("credentials", { email: loginId, password: loginPwd, redirect: false });
    setLoginLoading(false);
    if (res?.error) {
      setLoginError("Invalid email/mobile or password.");
    } else {
      router.push("/dashboard");
    }
  };

  const handleGoogleSignIn = () => signIn("google", { callbackUrl: "/dashboard" });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    if (!regName || !regMobile || !regEmail || !regPwd || !regConfirm) { setRegError("All fields are required."); return; }
    if (!/^\d{10}$/.test(regMobile)) { setRegError("Enter a valid 10-digit mobile number."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail)) { setRegError("Enter a valid email address."); return; }
    if (regPwd.length < 8) { setRegError("Password must be at least 8 characters."); return; }
    if (regPwd !== regConfirm) { setRegError("Passwords do not match."); return; }
    if (!agreed) { setRegError("Please accept the Terms of Service."); return; }

    setRegLoading(true);
    const otpRes = await fetch("/api/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile: regMobile }),
    });
    const otpData = await otpRes.json();
    setRegLoading(false);

    if (otpData.success) {
      setDevOtp(otpData.otp);
      setPendingRegData({ name: regName, email: regEmail, mobile: regMobile, password: regPwd });
      setOtpOpen(true);
    } else {
      setRegError("Failed to send OTP. Please try again.");
    }
  };

  const handleOtpVerified = async () => {
    if (!pendingRegData) return;
    setOtpOpen(false);
    setRegLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pendingRegData),
    });
    const data = await res.json();

    if (!res.ok) {
      setRegError(data.error || "Registration failed.");
      setRegLoading(false);
      return;
    }

    const loginRes = await signIn("credentials", { email: pendingRegData.email, password: pendingRegData.password, redirect: false });
    setRegLoading(false);

    if (loginRes?.error) {
      setRegError("Account created! Please log in.");
      setTab("login");
    } else {
      router.push("/onboarding");
    }
  };

  return (
    <div className="auth-bg">
      <div className="orb" style={{ width: 400, height: 400, background: "rgba(99,102,241,0.15)", top: -100, left: -100 }} />
      <div className="orb" style={{ width: 300, height: 300, background: "rgba(6,182,212,0.1)", bottom: -80, right: -80 }} />

      <div className="auth-nav">
        <Link href="/" className="auth-logo gradient-text-cyan" style={{ textDecoration: "none" }}>SmartGov</Link>
        <Link href="/" className="back-link">← Back to Home</Link>
      </div>

      <div className="auth-card">
        <div className="text-center" style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 900 }} className="gradient-text-cyan">SmartGov</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Assist • Govt Welfare Platform</div>
        </div>

        <div className="auth-tabs">
          <button className={`auth-tab${tab === "register" ? " active" : ""}`} onClick={() => { setTab("register"); setLoginError(""); }}>Create Account</button>
          <button className={`auth-tab${tab === "login" ? " active" : ""}`} onClick={() => { setTab("login"); setRegError(""); }}>Sign In</button>
        </div>

        {tab === "register" ? (
          <form onSubmit={handleRegister}>
            <div style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", marginBottom: 20 }}>
              Join 10,000+ citizens claiming their benefits
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {regError && <ErrorBanner msg={regError} />}

              <div className="input-wrap">
                <label className="input-label">Full Name</label>
                <div className="input-icon-wrap">
                  <span className="icon-left">👤</span>
                  <input className="input" type="text" placeholder="Rahul Kumar" value={regName} onChange={(e) => setRegName(e.target.value)} />
                </div>
              </div>

              <div className="input-wrap">
                <label className="input-label">Mobile Number</label>
                <div className="input-icon-wrap">
                  <span className="icon-left">🇮🇳 +91</span>
                  <input
                    className="input"
                    type="tel"
                    placeholder="9876543210"
                    style={{ paddingLeft: 70 }}
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  />
                </div>
              </div>

              <div className="input-wrap">
                <label className="input-label">Email Address</label>
                <div className="input-icon-wrap">
                  <span className="icon-left">✉️</span>
                  <input className="input" type="email" placeholder="rahul@example.com" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
                </div>
              </div>

              <div className="input-wrap">
                <label className="input-label">Password</label>
                <div className="input-icon-wrap">
                  <span className="icon-left">🔒</span>
                  <input
                    className="input"
                    type={showRegPwd ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={regPwd}
                    onChange={(e) => setRegPwd(e.target.value)}
                  />
                  <span className="icon-right" onClick={() => setShowRegPwd(!showRegPwd)}>{showRegPwd ? "🙈" : "👁"}</span>
                </div>
                <PasswordStrength password={regPwd} />
              </div>

              <div className="input-wrap">
                <label className="input-label">Confirm Password</label>
                <div className="input-icon-wrap">
                  <span className="icon-left">🔒</span>
                  <input
                    className="input"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repeat your password"
                    value={regConfirm}
                    onChange={(e) => setRegConfirm(e.target.value)}
                  />
                  <span className="icon-right" onClick={() => setShowConfirm(!showConfirm)}>{showConfirm ? "🙈" : "👁"}</span>
                </div>
              </div>

              <div className="checkbox-row">
                <input type="checkbox" className="checkbox-custom" id="termsCheck" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                <label htmlFor="termsCheck" style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  I agree to the <a href="#" className="link">Terms of Service</a> and <a href="#" className="link">Privacy Policy</a>
                </label>
              </div>

              <button type="submit" className="btn btn-primary btn-full" style={{ height: 48, marginTop: 4 }} disabled={regLoading}>
                {regLoading ? "Creating…" : "Create Account →"}
              </button>
            </div>

            <div className="divider-text">or sign up with</div>
            <button type="button" className="social-btn-full" onClick={handleGoogleSignIn}>
              <span style={{ fontSize: 18 }}>G</span> Continue with Google
            </button>

            <div style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "var(--text-muted)" }}>
              Already have an account?{" "}
              <a href="#" className="link" onClick={(e) => { e.preventDefault(); setTab("login"); }}>Sign In</a>
            </div>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <div style={{ fontSize: 22, fontWeight: 700, textAlign: "center", marginBottom: 6 }}>Welcome back</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", marginBottom: 24 }}>Sign in to your SmartGov account</div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {loginError && <ErrorBanner msg={loginError} />}

              <div className="input-wrap">
                <label className="input-label">Mobile / Email</label>
                <div className="input-icon-wrap">
                  <span className="icon-left">📱</span>
                  <input className="input" type="text" placeholder="Mobile number or email" value={loginId} onChange={(e) => setLoginId(e.target.value)} />
                </div>
              </div>

              <div className="input-wrap">
                <div className="forgot-row">
                  <label className="input-label">Password</label>
                  <a href="#" className="link" style={{ fontSize: 12 }}>Forgot Password?</a>
                </div>
                <div className="input-icon-wrap">
                  <span className="icon-left">🔒</span>
                  <input
                    className="input"
                    type={showLoginPwd ? "text" : "password"}
                    placeholder="Enter your password"
                    value={loginPwd}
                    onChange={(e) => setLoginPwd(e.target.value)}
                  />
                  <span className="icon-right" onClick={() => setShowLoginPwd(!showLoginPwd)}>{showLoginPwd ? "🙈" : "👁"}</span>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-full" style={{ height: 48 }} disabled={loginLoading}>
                {loginLoading ? "Signing in…" : "Sign In →"}
              </button>
            </div>

            <div className="divider-text">or continue with</div>
            <button type="button" className="social-btn-full" onClick={handleGoogleSignIn}>
              <span style={{ fontSize: 18 }}>G</span> Continue with Google
            </button>

            <div style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "var(--text-muted)" }}>
              Don&apos;t have an account?{" "}
              <a href="#" className="link" onClick={(e) => { e.preventDefault(); setTab("register"); }}>Get Started</a>
            </div>
          </form>
        )}
      </div>

      <div style={{ position: "fixed", bottom: 20, right: 20 }}>
        <button className="btn btn-secondary" onClick={toggleTheme}>🌙</button>
      </div>

      <OTPModal
        open={otpOpen}
        onClose={() => setOtpOpen(false)}
        mobile={regMobile}
        devOtp={devOtp}
        onVerified={handleOtpVerified}
      />
    </div>
  );
}
