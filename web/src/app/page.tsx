"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toggleTheme, getTheme } from "@/lib/theme";
import { STOCK_PHOTOS, photoUrl } from "@/lib/constants";
import {
  Sun, Moon, Play, Star, Landmark, Target, FolderArchive, Zap, Bell, Globe, Link2,
} from "lucide-react";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads client-only document.documentElement
    setIsDark(getTheme() === "dark");
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleToggleTheme = () => {
    toggleTheme();
    setIsDark(getTheme() === "dark");
  };

  return (
    <>
      {/* Navbar */}
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <Link href="/" className="nav-logo gradient-text-cyan" style={{ textDecoration: "none" }}>SmartGov</Link>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how">How it Works</a>
          <a href="#schemes">Schemes</a>
          <a href="#languages">Languages</a>
        </div>
        <div className="nav-cta">
          <button className="theme-toggle" onClick={handleToggleTheme} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            {isDark ? <Moon size={14} strokeWidth={2} /> : <Sun size={14} strokeWidth={2} />} {isDark ? "Dark" : "Light"}
          </button>
          <Link href="/auth" className="btn btn-outline">Login</Link>
          <Link href="/auth" className="btn btn-primary btn-pill">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="orb" style={{ width: 500, height: 500, background: "rgba(99,102,241,0.2)", top: -150, left: -150 }} />
        <div className="orb" style={{ width: 400, height: 400, background: "rgba(6,182,212,0.15)", bottom: -100, right: 80 }} />

        <div className="hero-content">
          <div className="hero-tag">🇮🇳 Built for Bharat</div>
          <h1>
            <span className="gradient-text-cyan">Every Scheme</span><br />
            <span className="gradient-text-cyan">You Deserve.</span><br />
            <span style={{ color: "var(--text-primary)" }}>Effortlessly.</span>
          </h1>
          <p className="hero-sub">One profile. One vault. Auto-apply to 500+ government welfare schemes.</p>
          <div className="hero-cta-row">
            <Link href="/auth" className="btn btn-primary btn-pill btn-lg">Get Started Free</Link>
            <button className="btn btn-outline btn-pill btn-lg" onClick={() => alert("Demo video coming soon! 🎬")} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Play size={14} strokeWidth={2} fill="currentColor" /> Watch Demo
            </button>
          </div>
          <div className="hero-trust">
            <span className="trust-avatars">
              <img src={photoUrl(STOCK_PHOTOS.womanFarmerRice, 64)} alt="" />
              <img src={photoUrl(STOCK_PHOTOS.motherDaughter, 64)} alt="" />
              <img src={photoUrl(STOCK_PHOTOS.girlPortraitSmiling, 64)} alt="" />
            </span>
            <span className="star-rating">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={13} strokeWidth={0} fill="#F59E0B" />)}
            </span>
            &nbsp;Trusted by <strong>10,000+ citizens</strong> across India
          </div>
        </div>

        <div className="hero-visual">
          <div className="phone-mockup">
            <div className="phone-screen">
              <div className="phone-topbar" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Landmark size={14} strokeWidth={2} /> SmartGov Assist &nbsp;•&nbsp; Dashboard
              </div>
              <div className="phone-body">
                <div className="phone-stat-row">
                  <div className="phone-stat">
                    <div className="phone-stat-val gradient-text">12</div>
                    <div className="phone-stat-lbl">Schemes</div>
                  </div>
                  <div className="phone-stat">
                    <div className="phone-stat-val" style={{ color: "#10B981" }}>4/7</div>
                    <div className="phone-stat-lbl">Documents</div>
                  </div>
                  <div className="phone-stat">
                    <div className="phone-stat-val" style={{ color: "#F59E0B" }}>2</div>
                    <div className="phone-stat-lbl">Applied</div>
                  </div>
                </div>
                <div className="phone-scheme">
                  <div className="phone-scheme-name">PM Scholarship Scheme</div>
                  <div className="phone-scheme-amt">₹25,000/year • 92% match ✓</div>
                </div>
                <div className="phone-scheme" style={{ borderColor: "#6366F1", marginTop: 5 }}>
                  <div className="phone-scheme-name">PM Awas Yojana</div>
                  <div className="phone-scheme-amt" style={{ color: "#6366F1" }}>Housing subsidy • 85% match ✓</div>
                </div>
                <div className="phone-scheme" style={{ borderColor: "#F59E0B", marginTop: 5 }}>
                  <div className="phone-scheme-name">Ayushman Bharat</div>
                  <div className="phone-scheme-amt" style={{ color: "#F59E0B" }}>₹5L health cover • 78% match</div>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-glow" />
        </div>
      </section>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-bar-item">
          <div className="stat-bar-val gradient-text-cyan">500+</div>
          <div className="stat-bar-lbl">Schemes Covered</div>
        </div>
        <div className="stat-bar-item">
          <div className="stat-bar-val gradient-text-cyan">10K+</div>
          <div className="stat-bar-lbl">Registered Users</div>
        </div>
        <div className="stat-bar-item">
          <div className="stat-bar-val gradient-text-cyan">70%</div>
          <div className="stat-bar-lbl">Auto-Fill Rate</div>
        </div>
        <div className="stat-bar-item">
          <div className="stat-bar-val gradient-text-cyan">5 min</div>
          <div className="stat-bar-lbl">Avg Apply Time</div>
        </div>
      </div>

      {/* Features */}
      <section className="section features-bg" id="features">
        <div className="section-center">
          <h2>Everything you need to <span className="gradient-text">claim your benefits</span></h2>
          <p>From eligibility check to form submission — we handle every step so you don&apos;t have to.</p>
        </div>
        <div className="features-grid">
          {[
            { icon: Target, bg: "linear-gradient(135deg,#6366F1,#4338CA)", title: "Eligibility Check", desc: "Auto-match your profile against 500+ schemes. Know exactly what you qualify for in seconds." },
            { icon: FolderArchive, bg: "linear-gradient(135deg,#06B6D4,#0891B2)", title: "Document Vault", desc: "Upload once. We extract data via OCR and reuse across all applications — securely encrypted." },
            { icon: Zap, bg: "linear-gradient(135deg,#F59E0B,#D97706)", title: "Auto Form Fill", desc: "Your profile data auto-populates government forms. Apply in one click, no manual entry." },
            { icon: Bell, bg: "linear-gradient(135deg,#10B981,#059669)", title: "Smart Notifications", desc: "Never miss a deadline. Get alerts for new schemes, expiring docs, and application updates." },
            { icon: Globe, bg: "linear-gradient(135deg,#EC4899,#DB2777)", title: "Multi-language", desc: "Available in Hindi, English, Tamil, Telugu, Bengali, and 6 more Indian languages." },
            { icon: Link2, bg: "linear-gradient(135deg,#8B5CF6,#7C3AED)", title: "Direct Gov Links", desc: "Apply directly on official government portals. We only guide and fill — never intercept data." },
          ].map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon" style={{ background: f.bg }}><f.icon size={22} strokeWidth={2} color="#fff" /></div>
              <h3>{f.title}</h3>
              <p className="text-secondary mt-2">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="section how-bg" id="how">
        <div className="section-center">
          <h2>How it <span className="gradient-text">Works</span></h2>
          <p>Three steps to unlock every government benefit you&apos;re entitled to.</p>
        </div>
        <div className="how-steps">
          <div className="how-step">
            <img className="how-step-photo" src={photoUrl(STOCK_PHOTOS.motherDaughter, 500)} alt="" />
            <div className="how-step-num">1</div>
            <h3>Create Your Profile</h3>
            <p className="text-secondary mt-2">Fill your basic info, income, location, and category in under 2 minutes. One-time setup.</p>
          </div>
          <div className="how-step">
            <img className="how-step-photo" src={photoUrl(STOCK_PHOTOS.farmerField, 500)} alt="" />
            <div className="how-step-num">2</div>
            <h3>Upload Documents Once</h3>
            <p className="text-secondary mt-2">Upload Aadhaar, income certificate, and other docs. Our OCR extracts and stores them securely.</p>
          </div>
          <div className="how-step">
            <img className="how-step-photo" src={photoUrl(STOCK_PHOTOS.womanFarmerRice, 500)} alt="" />
            <div className="how-step-num">3</div>
            <h3>Apply with One Click</h3>
            <p className="text-secondary mt-2">Auto-filled forms. One-click submission. Track status in real time from your dashboard.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="cta-section" style={{ backgroundImage: `url(${photoUrl(STOCK_PHOTOS.farmerField, 1600)})` }}>
        <h2>Start claiming what&apos;s yours today</h2>
        <p>Join 10,000+ citizens who&apos;ve already claimed ₹2.3 Crore+ in benefits.</p>
        <Link href="/auth" className="cta-btn" style={{ display: "inline-block", textDecoration: "none" }}>Get Started Free →</Link>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-brand-name gradient-text-cyan">SmartGov Assist</div>
            <p>Making government welfare accessible to every Indian citizen through technology, transparency, and trust.</p>
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            <ul>
              <li><a href="#">Features</a></li>
              <li><a href="#">How it Works</a></li>
              <li><a href="#">Schemes Database</a></li>
              <li><a href="#">Languages</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Report an Issue</a></li>
              <li><a href="#">Grievances</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Data Security</a></li>
              <li><a href="#">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 SmartGov Assist. For Indian citizens, by Indian developers. 🇮🇳</p>
          <div className="footer-socials">
            <a href="#" className="social-btn">𝕏</a>
            <a href="#" className="social-btn">in</a>
            <a href="#" className="social-btn">f</a>
            <a href="#" className="social-btn"><Play size={14} strokeWidth={2} fill="currentColor" /></a>
          </div>
        </div>
      </footer>
    </>
  );
}
