"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  ArrowRight,
  CheckCircle2,
  Zap,
  FileSearch,
  Bell,
  Users,
  Star,
  Clock,
  ChevronRight,
  Menu,
  X,
  FileCheck,
  Bot,
  Lock,
  Globe,
} from "lucide-react";

const stats = [
  { value: "500+", label: "Government Schemes" },
  { value: "10K+", label: "Citizens Served" },
  { value: "70%", label: "Auto-fill Rate" },
  { value: "5 min", label: "Apply Time" },
];

const features = [
  {
    icon: Bot,
    title: "AI-Powered Matching",
    description: "Our smart engine matches you with schemes based on your profile automatically — no manual searching required.",
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    icon: FileSearch,
    title: "Smart Document Vault",
    description: "Upload once, use everywhere. OCR technology auto-extracts your data from Aadhaar, PAN, and other documents.",
    color: "bg-cyan-100 text-cyan-600",
  },
  {
    icon: Zap,
    title: "One-Click Applications",
    description: "Forms auto-fill from your vault. Apply to multiple schemes in minutes, not hours.",
    color: "bg-amber-100 text-amber-600",
  },
  {
    icon: Bell,
    title: "Real-Time Alerts",
    description: "Never miss a deadline. Get notified about new schemes, application status, and required actions.",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Lock,
    title: "Bank-Grade Security",
    description: "Your documents and personal data are encrypted at rest and in transit using AES-256.",
    color: "bg-rose-100 text-rose-600",
  },
  {
    icon: Globe,
    title: "11 Indian Languages",
    description: "Navigate in your preferred language — Hindi, Tamil, Telugu, Bengali, and 7 more.",
    color: "bg-purple-100 text-purple-600",
  },
];

const steps = [
  {
    step: "01",
    title: "Create Your Profile",
    description: "Complete a 4-step onboarding: personal details, economic status, location, and preferences. Takes under 5 minutes.",
  },
  {
    step: "02",
    title: "Get Auto-Matched",
    description: "Our AI engine instantly scans 500+ schemes and shows you exactly which ones you qualify for, with match percentage.",
  },
  {
    step: "03",
    title: "Apply in One Click",
    description: "Forms auto-fill from your vault. Review, submit, and track applications — all in one place.",
  },
];

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#schemes", label: "Schemes" },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg text-text">
              SmartGov <span className="text-primary">Assist</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/auth"
              className="text-sm font-semibold text-text hover:text-primary transition-colors px-4 py-2"
            >
              Login
            </Link>
            <Link
              href="/auth"
              className="btn-primary text-sm font-semibold px-5 py-2 rounded-xl inline-flex items-center gap-2"
            >
              Get Started <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center text-text"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-surface border-t border-border px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block text-sm font-medium text-slate-600 hover:text-primary py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="flex gap-3 pt-2">
              <Link href="/auth" className="flex-1 text-center text-sm font-semibold border border-border rounded-xl py-2 hover:bg-elevated transition-colors">
                Login
              </Link>
              <Link href="/auth" className="flex-1 text-center btn-primary text-sm font-semibold rounded-xl py-2">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-20 px-4">
        {/* Background gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-200 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-1.5 mb-8">
            <Star size={14} className="text-primary" />
            <span className="text-xs font-semibold text-primary">500+ Government Schemes Auto-Matched</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-text leading-tight tracking-tight max-w-4xl mx-auto">
            Every Scheme You Deserve.{" "}
            <span className="gradient-text">Effortlessly.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            SmartGov Assist automatically discovers, matches, and helps you apply for government welfare schemes — in minutes, not months.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth"
              className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold"
            >
              Check Your Eligibility Free <ArrowRight size={18} />
            </Link>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold border-2 border-border hover:border-primary hover:text-primary transition-colors"
            >
              See How It Works
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted">
            {["Aadhaar Integrated", "DigiLocker Ready", "Govt Approved", "Free to Use"].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-success" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-surface border-y border-border py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-extrabold gradient-text">{stat.value}</div>
              <div className="mt-1 text-sm text-muted font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text">
              Everything You Need,{" "}
              <span className="gradient-text">Nothing You Don&apos;t</span>
            </h2>
            <p className="mt-4 text-muted max-w-2xl mx-auto">
              Built specifically for Indian citizens navigating complex government welfare systems.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="card-base p-6 hover:shadow-md transition-shadow group">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-text mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-surface">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="mt-4 text-muted">Three simple steps to unlock benefits you deserve.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-[calc(33%+2rem)] right-[calc(33%+2rem)] h-0.5 bg-gradient-to-r from-indigo-300 to-cyan-300" />

            {steps.map((step, i) => (
              <div key={step.step} className="relative text-center">
                <div className="w-24 h-24 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-lg shadow-indigo-200 mb-6">
                  <span className="text-3xl font-extrabold text-white">{step.step}</span>
                </div>
                <h3 className="text-xl font-bold text-text mb-3">{step.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto rounded-3xl p-12 text-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #06B6D4 100%)" }}>
          <div className="absolute inset-0 bg-white/5 rounded-3xl" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Start Claiming Your Benefits Today
            </h2>
            <p className="text-indigo-200 text-lg mb-8 max-w-xl mx-auto">
              Join 10,000+ citizens who discovered schemes they never knew they qualified for.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-primary font-bold rounded-xl hover:bg-indigo-50 transition-colors"
              >
                Get Started Free <ArrowRight size={18} />
              </Link>
              <Link
                href="/auth"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-white/40 text-white font-semibold rounded-xl hover:border-white/70 transition-colors"
              >
                Login to Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <Shield size={16} className="text-white" />
                </div>
                <span className="font-bold text-white">SmartGov Assist</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Empowering every Indian citizen to access the welfare benefits they deserve.
              </p>
            </div>
            {[
              { title: "Product", links: ["Features", "Schemes", "How It Works", "Pricing"] },
              { title: "Support", links: ["Help Center", "Contact Us", "FAQs", "Report Issue"] },
              { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Security"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold text-white mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              &copy; 2025 SmartGov Assist. All rights reserved.
            </p>
            <p className="text-sm text-slate-500">
              Made with care for Indian citizens.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
