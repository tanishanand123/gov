# App Flow Document
## SmartGov Assist — Complete User Journey

**Version:** 1.0  
**Date:** 2026-06-24  

---

## 1. High-Level Flow Overview

```
Landing Page
    │
    ├──► Register / Login
    │         │
    │         ▼
    │    Profile Setup (Onboarding Wizard)
    │         │
    │         ▼
    │    Document Vault (Upload Docs → OCR → Auto-fill Profile)
    │         │
    │         ▼
    │    Dashboard (Eligible Schemes + Alerts + Progress)
    │         │
    │         ├──► Scheme Detail Page
    │         │         │
    │         │         ▼
    │         │    Auto Form Fill Preview
    │         │         │
    │         │         ▼
    │         │    One-Click Doc Approval & Submit
    │         │
    │         └──► Notification Center
    │
    └──► Admin Panel (separate flow)
```

---

## 2. Detailed Screen-by-Screen Flow

---

### FLOW 1: New User Onboarding

```
[1] Landing Page
    │  User clicks "Get Started"
    ▼
[2] Register Screen
    │  Fields: Name, Mobile/Email, Password
    │  Optional: OTP verification
    │  On success → redirect to Profile Setup
    ▼
[3] Profile Setup Wizard (4 steps)
    │
    ├── Step 1: Personal Info
    │     Name, Date of Birth, Gender, Category (General/OBC/SC/ST)
    │
    ├── Step 2: Economic Info
    │     Annual Income, Occupation, BPL Card (Yes/No), Bank Account (Yes/No)
    │
    ├── Step 3: Location Info
    │     State, District, Block/Taluka, Rural/Urban Toggle
    │
    └── Step 4: Preferences
          Preferred Language, Notification Preferences
    │
    │  On completion → Eligibility Engine runs in background
    ▼
[4] Document Upload Prompt (nudge screen)
    │  "Upload your documents to unlock more schemes and enable auto form fill"
    │  CTA: "Upload Now" / "Skip for now"
    ▼
[5] Dashboard (first-time view)
    │  Shows:
    │  - X schemes matched to your profile
    │  - Y schemes unlockable by uploading more docs
    │  - Profile completion progress bar
    │  - Suggested: "Upload Aadhaar to verify identity"
```

---

### FLOW 2: Document Vault

```
[Dashboard] → Click "Document Vault"
    ▼
[Document Vault Page]
    │
    ├── Grid of document slots (Aadhaar, Income Cert, Caste Cert, etc.)
    │
    ├── Each slot shows:
    │     - Upload status (Uploaded / Missing / Expired)
    │     - Expiry date (if applicable)
    │     - OCR status (Processing / Extracted / Failed)
    │     - Verification badge
    │
    └── User clicks "Upload" on a slot
            │
            ▼
        [Upload Modal]
            │  Drag & drop OR file picker
            │  File validation (size ≤ 5MB, type: PDF/JPG/PNG)
            │
            ▼
        [OCR Processing] (async, background)
            │  System extracts: Name, DOB, ID number, Address, etc.
            │
            ▼
        [Profile Sync Prompt]
            │  "We extracted the following from your Aadhaar:
            │   Name: Rahul Kumar, DOB: 01/01/2003, Address: UP"
            │  "Sync to your profile?" → Yes / Review & Edit
            │
            ▼
        [Document Status Updated]
            │  Badge changes to "Uploaded – OCR Complete"
            │  Eligibility re-calculated in background
            │
            ▼
        [New Schemes Unlocked Toast]
            "2 new schemes are now available based on your documents!"
```

---

### FLOW 3: Scheme Discovery & Eligibility

```
[Dashboard] → Click "View All Schemes"
    ▼
[Eligible Schemes Page]
    │
    ├── Filter/Sort: By Category, Benefit Type, State, Income Range
    ├── Search bar
    │
    ├── Scheme Cards (eligible) — green border
    │     - Scheme Name
    │     - Benefit: ₹X scholarship / free healthcare / etc.
    │     - Eligibility Score: 92%
    │     - Status badge: ELIGIBLE
    │     - CTA: "View Details"
    │
    ├── Scheme Cards (nearly eligible) — yellow border
    │     - Status badge: ALMOST ELIGIBLE
    │     - "Missing: Income Certificate"
    │     - CTA: "Upload to unlock"
    │
    └── Scheme Cards (not eligible) — grey, collapsed
          - Toggle to show/hide
```

---

### FLOW 4: Auto Form Fill + One-Click Submission (Core Feature)

```
[Scheme Card] → Click "View Details"
    ▼
[Scheme Detail Page]
    │  Sections:
    │  - Full Description
    │  - Eligibility Criteria (with your match highlighted)
    │  - Required Documents (vault status shown inline)
    │  - Step-by-step Application Process
    │  - Official Government Link
    │  - CTA: "Apply via SmartGov" (primary) | "Apply on Govt Site" (secondary)
    │
    └── User clicks "Apply via SmartGov"
            │
            ▼
        [Document Approval Screen]
            │  "To apply for PM Scholarship, the following documents
            │   will be submitted from your vault:"
            │
            │  ✅ Aadhaar Card (verified)
            │  ✅ Income Certificate (uploaded 3 days ago)
            │  ❌ Caste Certificate (missing — scheme requires this)
            │
            │  Missing doc options:
            │  - "Upload Now" → goes to vault flow
            │  - "Continue without it" (if optional)
            │
            └── User clicks "Approve & Continue"
                    │
                    ▼
                [Auto Form Fill Preview]
                    │  System shows pre-filled application form:
                    │
                    │  Full Name:        Rahul Kumar          ✅ (from Aadhaar OCR)
                    │  Date of Birth:    01 Jan 2003          ✅ (from profile)
                    │  Category:         OBC                  ✅ (from profile)
                    │  Annual Income:    ₹1,80,000            ✅ (from profile)
                    │  Aadhaar Number:   XXXX-XXXX-1234       ✅ (masked, from doc)
                    │  Bank Account No:  ●●●●●●●1234          ⚠️ (please verify)
                    │  Course Name:      [empty — fill here]  ❌ (user must fill)
                    │
                    │  User reviews, edits any field, fills missing ones
                    │
                    └── "Submit Application"
                            │
                            ▼
                        [Confirmation Screen]
                            │  "Application submitted for PM Scholarship"
                            │  Submission ID: #XYZ123
                            │  Official portal link to track status
                            │  "Save to My Applications"
```

---

### FLOW 5: Notification System

```
Background Events (triggered by system):
    │
    ├── New eligible scheme found → Push + In-app notification
    │     "You are eligible for PM Awas Yojana! Apply before Dec 31"
    │
    ├── Deadline approaching (7 days / 1 day) → SMS + Push
    │     "PM Scholarship deadline is in 7 days. Complete your application!"
    │
    ├── Document expiry warning (30 days / 7 days) → In-app + SMS
    │     "Your Income Certificate expires on Aug 15. Renew it to stay eligible."
    │
    ├── Missing document blocking schemes → In-app
    │     "Upload Caste Certificate to unlock 3 more schemes you qualify for"
    │
    └── Profile incomplete → In-app
          "Complete your profile (60% done) to see more scheme matches"

[Notification Center Page]
    │  List of all notifications
    │  Grouped by: Action Required / Informational / Archived
    │  Click → navigates to relevant page (scheme, document, profile)
```

---

### FLOW 6: Admin Panel

```
[Admin Login] (separate subdomain: admin.smartgov.in)
    ▼
[Admin Dashboard]
    │
    ├── Schemes Management
    │     - Add new scheme (name, criteria, benefit, docs required, official link)
    │     - Edit existing scheme
    │     - Toggle active/inactive
    │     - Bulk import via CSV
    │
    ├── User Management
    │     - View user list, search
    │     - View profile, documents, applications
    │     - Manual document verification
    │
    ├── Document Verification Queue
    │     - View uploaded docs awaiting review
    │     - Approve / Reject with reason
    │
    └── Analytics Dashboard
          - Daily active users
          - Schemes applied
          - Documents uploaded
          - Most claimed schemes
          - Drop-off funnel analysis
```

---

## 3. State Machine — User Account

```
UNREGISTERED
    │ Register
    ▼
REGISTERED (profile_complete: false)
    │ Complete profile wizard
    ▼
PROFILE_COMPLETE (docs_uploaded: false)
    │ Upload ≥ 1 document
    ▼
ACTIVE (full access)
    │
    ├── Can browse and apply for eligible schemes
    ├── Receives notifications
    └── Auto form fill enabled
```

---

## 4. Error States & Edge Cases

| Scenario | Handling |
|---|---|
| OCR fails to extract data | Show "Manual Entry Required" — user fills profile fields manually |
| Document upload fails | Retry with exponential backoff, show error toast |
| Scheme application link is broken | Show cached link + "Link may be outdated, check official site" |
| User uploads wrong document type | Validate MIME type before upload, show friendly error |
| LLM form-fill confidence low | Highlight those fields in yellow, prompt user to verify |
| Session expires during form fill | Auto-save draft, restore on next login |
| Internet lost mid-upload | PWA offline queue — resumes on reconnect |
