"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Shield,
  Eye,
  EyeOff,
  Phone,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

type Tab = "login" | "register";

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /\d/.test(password) },
    { label: "Special char", pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const colors = ["bg-danger", "bg-amber-400", "bg-amber-400", "bg-success", "bg-success"];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  if (!password) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i < score ? colors[score] : "bg-slate-200"}`} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {checks.map((c) => (
            <span key={c.label} className={`text-xs flex items-center gap-0.5 ${c.pass ? "text-success" : "text-muted"}`}>
              <CheckCircle2 size={10} /> {c.label}
            </span>
          ))}
        </div>
        {score > 0 && (
          <span className={`text-xs font-semibold ${score >= 3 ? "text-success" : score >= 2 ? "text-amber-500" : "text-danger"}`}>
            {labels[score]}
          </span>
        )}
      </div>
    </div>
  );
}

function ErrorBanner({ msg }: { msg: string }) {
  return (
    <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
      <AlertCircle size={16} className="shrink-0 mt-0.5" />
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

  return (
    <Modal open={open} onClose={onClose} title="Verify Your Mobile" description={`Enter the 6-digit OTP for +91 ${mobile}`}>
      {devOtp && (
        <div className="mb-4 p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-center">
          <p className="text-xs text-indigo-500 font-medium mb-1">Dev mode — OTP (no SMS sent)</p>
          <p className="text-2xl font-extrabold tracking-[0.3em] text-indigo-700">{devOtp}</p>
        </div>
      )}
      <div className="flex gap-2 justify-center my-4">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-11 h-13 text-center text-xl font-bold border-2 border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        ))}
      </div>
      {error && <ErrorBanner msg={error} />}
      <Button variant="primary" fullWidth onClick={verify} disabled={loading} className="mt-3">
        {loading ? <Loader2 size={16} className="animate-spin" /> : "Verify & Continue"}
      </Button>
      <p className="text-center text-sm text-muted mt-3">
        Didn&apos;t receive it?{" "}
        <button className="text-primary font-semibold hover:underline" onClick={resend}>Resend OTP</button>
      </p>
    </Modal>
  );
}

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("login");

  // login state
  const [loginId, setLoginId] = useState("");
  const [loginPwd, setLoginPwd] = useState("");
  const [showLoginPwd, setShowLoginPwd] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // register state
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

  // OTP
  const [otpOpen, setOtpOpen] = useState(false);
  const [devOtp, setDevOtp] = useState("");
  const [pendingRegData, setPendingRegData] = useState<{ name: string; email: string; mobile: string; password: string } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!loginId || !loginPwd) { setLoginError("Please fill in all fields."); return; }
    setLoginLoading(true);
    const res = await signIn("credentials", {
      email: loginId,
      password: loginPwd,
      redirect: false,
    });
    setLoginLoading(false);
    if (res?.error) {
      setLoginError("Invalid email/mobile or password.");
    } else {
      router.push("/dashboard");
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    if (!regName || !regMobile || !regEmail || !regPwd || !regConfirm) {
      setRegError("All fields are required."); return;
    }
    if (!/^\d{10}$/.test(regMobile)) {
      setRegError("Enter a valid 10-digit mobile number."); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail)) {
      setRegError("Enter a valid email address."); return;
    }
    if (regPwd.length < 8) {
      setRegError("Password must be at least 8 characters."); return;
    }
    if (regPwd !== regConfirm) {
      setRegError("Passwords do not match."); return;
    }
    if (!agreed) {
      setRegError("Please accept the Terms of Service."); return;
    }

    setRegLoading(true);
    // Request OTP first
    const otpRes = await fetch("/api/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile: regMobile }),
    });
    const otpData = await otpRes.json();
    setRegLoading(false);

    if (otpData.success) {
      setDevOtp(otpData.otp); // shown on screen (dev mode)
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

    // Auto-login after registration
    const loginRes = await signIn("credentials", {
      email: pendingRegData.email,
      password: pendingRegData.password,
      redirect: false,
    });
    setRegLoading(false);

    if (loginRes?.error) {
      setRegError("Account created! Please log in.");
      setTab("login");
    } else {
      router.push("/onboarding");
    }
  };

  const GoogleButton = ({ label }: { label: string }) => (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      className="w-full h-12 flex items-center justify-center gap-3 border-2 border-border rounded-xl text-sm font-semibold text-text hover:bg-elevated transition-colors"
    >
      <svg viewBox="0 0 24 24" className="w-5 h-5">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      {label}
    </button>
  );

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #06B6D4 100%)" }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-center px-16 py-12 flex-1">
        <Link href="/" className="flex items-center gap-2.5 mb-12">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Shield size={22} className="text-white" />
          </div>
          <span className="font-bold text-2xl text-white">SmartGov Assist</span>
        </Link>
        <h1 className="text-4xl font-extrabold text-white leading-tight mb-6">
          Your Gateway to<br />Government Benefits
        </h1>
        <p className="text-indigo-200 text-lg mb-10">500+ schemes. Auto-matched. One platform.</p>
        <div className="space-y-4">
          {["Instant eligibility matching", "Secure document vault", "Track all applications", "Real-time status alerts"].map((item) => (
            <div key={item} className="flex items-center gap-3 text-white">
              <CheckCircle2 size={18} className="text-indigo-200 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-[480px] flex items-center justify-center p-4 lg:p-8">
        <div className="w-full bg-surface rounded-[20px] shadow-2xl p-8">
          {/* Tab switcher */}
          <div className="flex bg-elevated rounded-xl p-1 mb-8">
            {(["login", "register"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setLoginError(""); setRegError(""); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${tab === t ? "bg-surface shadow text-primary" : "text-muted hover:text-text"}`}
              >
                {t === "login" ? "Login" : "Create Account"}
              </button>
            ))}
          </div>

          {tab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-text">Welcome back</h2>
                <p className="text-muted text-sm mt-1">Sign in to your account</p>
              </div>

              {loginError && <ErrorBanner msg={loginError} />}

              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                leftIcon={<Mail size={16} />}
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
              />

              <div>
                <Input
                  label="Password"
                  type={showLoginPwd ? "text" : "password"}
                  placeholder="Enter your password"
                  leftIcon={<Lock size={16} />}
                  value={loginPwd}
                  onChange={(e) => setLoginPwd(e.target.value)}
                  rightIcon={
                    <button type="button" onClick={() => setShowLoginPwd(!showLoginPwd)}>
                      {showLoginPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />
                <div className="flex justify-end mt-1">
                  <button type="button" className="text-xs text-primary hover:underline font-medium">Forgot Password?</button>
                </div>
              </div>

              <Button type="submit" variant="primary" fullWidth size="lg" disabled={loginLoading}>
                {loginLoading ? <Loader2 size={16} className="animate-spin" /> : <><span>Sign In</span> <ArrowRight size={16} /></>}
              </Button>

              <div className="relative flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted">or continue with</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <GoogleButton label="Continue with Google" />
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-text">Create account</h2>
                <p className="text-muted text-sm mt-1">Join 10,000+ citizens already using SmartGov</p>
              </div>

              {regError && <ErrorBanner msg={regError} />}

              <Input
                label="Full Name"
                placeholder="Rajan Kumar"
                leftIcon={<User size={16} />}
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
              />

              <Input
                label="Mobile Number"
                placeholder="9876543210"
                leftAddon="+91"
                value={regMobile}
                onChange={(e) => setRegMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                inputMode="numeric"
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                leftIcon={<Mail size={16} />}
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />

              <div>
                <Input
                  label="Password"
                  type={showRegPwd ? "text" : "password"}
                  placeholder="Create a strong password"
                  leftIcon={<Lock size={16} />}
                  value={regPwd}
                  onChange={(e) => setRegPwd(e.target.value)}
                  rightIcon={
                    <button type="button" onClick={() => setShowRegPwd(!showRegPwd)}>
                      {showRegPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />
                <PasswordStrength password={regPwd} />
              </div>

              <Input
                label="Confirm Password"
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter your password"
                leftIcon={<Lock size={16} />}
                value={regConfirm}
                onChange={(e) => setRegConfirm(e.target.value)}
                rightIcon={
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-border accent-primary"
                />
                <span className="text-sm text-muted leading-snug">
                  I agree to the{" "}
                  <a href="#" className="text-primary hover:underline font-medium">Terms of Service</a>{" "}
                  and{" "}
                  <a href="#" className="text-primary hover:underline font-medium">Privacy Policy</a>
                </span>
              </label>

              <Button type="submit" variant="primary" fullWidth size="lg" disabled={regLoading || !agreed}>
                {regLoading
                  ? <Loader2 size={16} className="animate-spin" />
                  : <><span>Create Account</span> <ArrowRight size={16} /></>
                }
              </Button>

              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <GoogleButton label="Sign up with Google" />
            </form>
          )}

          <p className="text-center text-sm text-muted mt-6">
            {tab === "login" ? (
              <>Don&apos;t have an account?{" "}
                <button onClick={() => { setTab("register"); setLoginError(""); }} className="text-primary font-semibold hover:underline">
                  Sign up free
                </button>
              </>
            ) : (
              <>Already have an account?{" "}
                <button onClick={() => { setTab("login"); setRegError(""); }} className="text-primary font-semibold hover:underline">
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
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
