# Product Requirements Document (PRD)
## SmartGov Assist — AI-Powered Welfare Eligibility & Auto-Application Platform

**Version:** 1.0  
**Date:** 2026-06-24  
**Status:** Draft  

---

## 1. Product Vision

SmartGov Assist eliminates the gap between eligible citizens and government welfare schemes by automating eligibility discovery, document management, and application submission. The platform ensures no eligible citizen misses a scheme due to lack of awareness or paperwork burden.

**Tagline:** *One Profile. One Vault. Every Scheme You Deserve.*

---

## 2. Problem Statement

| Problem | Impact |
|---|---|
| Citizens are unaware of schemes they qualify for | Billions in welfare go unclaimed annually |
| Complex paper-based application processes | Low-income users abandon applications mid-way |
| Repeated document uploads for every scheme | Time-consuming and error-prone |
| No proactive alerts for deadlines or renewals | Citizens miss windows due to expired documents |
| Literacy and language barriers | Rural populations cannot navigate English portals |

---

## 3. Target Users

| Persona | Description |
|---|---|
| **Primary** | Low-to-middle income individuals (18–60 yrs) seeking government benefits |
| **Secondary** | Students applying for scholarships and education grants |
| **Tertiary** | Elderly citizens needing pension and healthcare schemes |
| **Admin** | Government officials / NGO workers assisting beneficiaries |

---

## 4. Core Features

### 4.1 User Profile & Eligibility Engine
- Guided onboarding form collecting demographic, economic, and geographic data
- AI-powered eligibility matching against a scheme database
- Real-time eligibility score per scheme
- Suggestions for schemes the user *almost* qualifies for (gap analysis)

### 4.2 Document Vault
- Single upload, multi-use document repository
- Supports: Aadhaar, Income Certificate, Caste Certificate, Residence Certificate, Bank Passbook, and more
- OCR-based data extraction from uploaded documents (auto-fills profile fields)
- Expiry tracking with renewal alerts
- Document verification status badge (Pending / Verified / Expired / Missing)

### 4.3 Auto Form Filling (Key Feature)
- When a user initiates an application for any scheme, the system pre-fills the application form using:
  - Data from the user profile (name, age, income, category, etc.)
  - Data extracted via OCR from uploaded documents
- User reviews the pre-filled form before submission
- System flags fields it could not auto-fill, prompting the user to complete only those

### 4.4 One-Click Document Submission
- Documents required for a scheme are identified automatically
- If documents exist in the vault, a single "Approve & Submit" action uploads them
- User must explicitly approve before any document is sent
- System shows exactly which documents will be attached before confirmation
- Supports partial submission: attach available docs, flag missing ones

### 4.5 Proactive Notification System
- **Eligibility Alerts:** "You are now eligible for PM Scholarship — apply before Dec 31"
- **Missing Document Alerts:** "Add Income Certificate to unlock 3 more schemes"
- **Deadline Reminders:** "Application deadline for XYZ scheme is in 7 days"
- **Document Expiry Warnings:** "Aadhaar address proof expires in 30 days — renew it"
- **New Scheme Alerts:** "A new scheme matching your profile was added"
- Notification channels: In-app, Push, SMS, WhatsApp (optional)

### 4.6 Authentic Government Links
- Each scheme card links directly to the official government portal
- Links are verified and sourced from official .gov.in / NIC-hosted domains
- Fallback to scheme-specific helpline numbers
- "Apply via SmartGov" (auto-fill assisted) vs "Apply on Official Site" (direct redirect)

### 4.7 Multilingual & Voice Support
- UI available in 10+ Indian languages (Hindi, Tamil, Telugu, Bengali, Marathi, etc.)
- Voice input for profile form fields
- Text-to-speech for scheme descriptions
- Language auto-detection from browser/device settings

---

## 5. Feature Priority Matrix

| Feature | Priority | Release |
|---|---|---|
| User Registration & Profile | P0 | MVP |
| Eligibility Matching Engine | P0 | MVP |
| Document Vault | P0 | MVP |
| Auto Form Filling | P0 | MVP |
| One-Click Document Submission | P0 | MVP |
| Notification System | P1 | v1.1 |
| Multilingual Support | P1 | v1.1 |
| Voice Input | P2 | v1.2 |
| Admin Panel | P1 | v1.1 |
| WhatsApp Notifications | P2 | v1.2 |
| Offline Mode | P3 | Future |

---

## 6. Non-Functional Requirements

| Requirement | Target |
|---|---|
| Page Load Time | < 2 seconds on 4G |
| Mobile Responsiveness | 100% — mobile-first design |
| Uptime | 99.5% SLA |
| Accessibility | WCAG 2.1 AA compliant |
| Data Encryption | AES-256 at rest, TLS 1.3 in transit |
| Language Support | 10+ Indian languages |
| Document Size Limit | Up to 5MB per file |
| Supported Formats | PDF, JPG, PNG, HEIC |

---

## 7. Success Metrics

| Metric | Target (6 months) |
|---|---|
| Registered Users | 10,000+ |
| Schemes Applied Via Platform | 25,000+ |
| Auto Form Fill Usage Rate | > 70% of applications |
| Document Vault Adoption | > 80% of users upload ≥ 1 doc |
| Avg. Application Completion Time | < 5 minutes |
| Notification Open Rate | > 40% |

---

## 8. Constraints & Assumptions

- Government scheme data will be maintained manually or via web scraping (no official API exists for most schemes)
- OCR accuracy depends on document quality; user can manually correct extracted data
- Auto form submission is NOT supported — the platform assists in filling, but final submission happens on the official government portal or via a guided in-app flow
- User consent is mandatory before any document is shared or uploaded

---

## 9. Out of Scope (v1.0)

- Direct integration with government backend systems (DigiLocker API integration is planned for v1.2)
- Payment processing
- Legal advisory or guaranteed eligibility certification
- Scheme grievance redressal
