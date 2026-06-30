# Technical Requirements Document (TRD)
## SmartGov Assist

**Version:** 1.0  
**Date:** 2026-06-24  

---

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│        React/Next.js SPA  ←→  PWA / Mobile-Responsive       │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS / REST / WebSocket
┌────────────────────────▼────────────────────────────────────┐
│                       API GATEWAY                            │
│              (Node.js / Express or FastAPI)                  │
│         Auth Middleware │ Rate Limiting │ Logging            │
└──┬─────────────┬────────┴──────┬──────────────┬────────────┘
   │             │               │              │
┌──▼──┐    ┌────▼────┐    ┌─────▼────┐   ┌────▼──────┐
│Auth │    │ Profile │    │ Document │   │  Scheme   │
│Svc  │    │  Svc    │    │   Svc    │   │  Engine   │
└──┬──┘    └────┬────┘    └─────┬────┘   └────┬──────┘
   │             │               │              │
┌──▼─────────────▼───────────────▼──────────────▼──────────┐
│                     DATABASE LAYER                          │
│     PostgreSQL (primary) + Redis (cache/sessions)          │
│              + S3-compatible (document storage)            │
└──────────────────────────────┬─────────────────────────────┘
                               │
┌──────────────────────────────▼─────────────────────────────┐
│                      AI / ML LAYER                          │
│   OCR Service │ Eligibility Engine │ Form-Fill Agent        │
│   (Tesseract / Google Vision / AWS Textract)                │
│   LLM: Claude claude-sonnet-4-6 (primary) or OpenAI GPT-4o        │
└────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

### 2.1 Frontend
| Layer | Technology | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR for SEO, file-based routing, API routes |
| Styling | Tailwind CSS + ShadCN UI | Rapid UI dev, accessible components |
| State Management | Zustand | Lightweight, no boilerplate |
| Form Handling | React Hook Form + Zod | Validation and type safety |
| Animations | Framer Motion | Smooth transitions |
| HTTP Client | Axios + React Query | Caching, retry, background sync |
| PWA | next-pwa | Offline capability, home screen install |

### 2.2 Backend
| Layer | Technology | Reason |
|---|---|---|
| Runtime | Node.js 20 LTS | Familiarity, large ecosystem |
| Framework | Express.js or Fastify | Lightweight REST API |
| Auth | JWT + Refresh Tokens | Stateless, scalable |
| OTP | Firebase Auth / MSG91 | Reliable OTP delivery in India |
| File Upload | Multer + AWS S3 / Cloudflare R2 | Scalable document storage |
| Scheduler | node-cron / BullMQ | Notification jobs, deadline checks |
| Email/SMS | Nodemailer + Twilio / MSG91 | Notification delivery |

### 2.3 Database
| Store | Technology | Used For |
|---|---|---|
| Primary DB | PostgreSQL 15 | Users, schemes, documents metadata, applications |
| Cache | Redis 7 | Sessions, eligibility results, OCR cache |
| File Storage | AWS S3 / Cloudflare R2 | Raw document files |
| Search | PostgreSQL Full Text Search (or Meilisearch) | Scheme search |

### 2.4 AI / ML Components

#### OCR (Document Data Extraction)
| Option | Cost | Accuracy | Recommendation |
|---|---|---|---|
| **Google Cloud Vision API** | ~$1.50/1000 pages | Very High | **Recommended for production** |
| **AWS Textract** | ~$1.50/1000 pages | Very High | Good alternative |
| **Tesseract.js (local)** | Free | Medium | Use for dev/testing only |
| **Azure Form Recognizer** | ~$1/1000 pages | High | Good for structured forms |

#### LLM for Eligibility Engine & Form Filling Agent
| Option | Cost | Capability | Recommendation |
|---|---|---|---|
| **Claude claude-sonnet-4-6** (Anthropic) | $3/$15 per M tokens (in/out) | Excellent reasoning, tool use | **Recommended — best for structured extraction and form logic** |
| **OpenAI GPT-4o** | $2.50/$10 per M tokens | Excellent, widely used | Strong alternative, good function calling |
| **OpenAI GPT-4o-mini** | $0.15/$0.60 per M tokens | Good for simple tasks | Use for classification/tagging to save cost |
| **Gemini 1.5 Flash** | Very cheap | Good | Cost-effective for bulk eligibility checks |
| **Local: LLaMA 3 / Mistral** | Infrastructure cost only | Moderate | Use if data privacy is critical |

**Recommended Strategy:**
- Use **Claude claude-sonnet-4-6** for form-fill agent (complex reasoning, reading OCR output, mapping to form fields)
- Use **GPT-4o-mini** or **Gemini Flash** for bulk eligibility scoring (cheaper, fast)
- Use **Google Vision API** for OCR
- **Can you use OpenAI API?** Yes — OpenAI API is straightforward to integrate and has excellent support for structured output (JSON mode, function calling). For this project, using both Claude + OpenAI is fine; or pick one to keep it simple.

---

## 3. Key Technical Modules

### 3.1 Eligibility Engine
- Rule-based matching: scheme criteria (age, income, category, state) matched against user profile
- LLM-assisted fuzzy matching for ambiguous criteria
- Scoring: 0–100 eligibility score per scheme
- Gap detection: "You need Income < 2L, you have 2.5L — you are ₹50K over the limit"
- Stored in Redis (TTL: 24 hours), recalculated on profile update

### 3.2 Auto Form Fill Agent
```
Input:  User Profile Data + OCR-extracted Document Data + Scheme Application Form Schema
Process: LLM maps available data fields → application form fields
Output: Pre-filled form JSON + list of unfilled required fields
```
- Form schemas stored in DB per scheme
- Agent uses structured output / function calling to return filled JSON
- Confidence score per field (high/medium/low) — low confidence fields highlighted for user review

### 3.3 Document Vault
- Each document has: `type`, `file_url`, `ocr_status`, `extracted_data (JSON)`, `expiry_date`, `verification_status`
- OCR runs asynchronously via BullMQ queue after upload
- Extracted data auto-syncs to user profile (with user confirmation)
- Expiry checker runs nightly via cron — triggers notifications

### 3.4 Notification Engine
- Event-driven via BullMQ queues
- Events: `ELIGIBILITY_FOUND`, `DEADLINE_APPROACHING`, `DOCUMENT_EXPIRING`, `NEW_SCHEME_ADDED`, `MISSING_DOC_BLOCKING`
- Delivery: Push notification (FCM) + SMS (MSG91/Twilio) + In-app
- User can set notification preferences (channel, frequency)

### 3.5 Government Link Registry
- Table: `scheme_links` — stores official URL, last verified date, scheme_id
- Automated link health check (weekly cron using HEAD requests)
- Admin can manually update links
- Only `.gov.in`, `nic.in`, `india.gov.in`, `scholarships.gov.in` domains allowed

---

## 4. Security Requirements

| Area | Requirement |
|---|---|
| Authentication | JWT (15-min access token) + Refresh Token (7 days) |
| Document Storage | Private S3 buckets, pre-signed URLs (15-min expiry) |
| Data at Rest | AES-256 encryption for PII fields in DB |
| Data in Transit | TLS 1.3 only |
| PII Handling | Aadhaar numbers masked in logs and responses |
| User Consent | Explicit approval required before any doc upload to external system |
| API Rate Limiting | 100 req/min per user, 1000 req/min per IP |
| Audit Log | All document access and submissions logged with timestamp + user |
| OWASP | Input validation, SQL parameterization, XSS sanitization enforced |

---

## 5. API Design

### Base URL: `https://api.smartgov.in/v1`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login, returns JWT |
| POST | `/auth/otp/send` | Send OTP |
| POST | `/auth/otp/verify` | Verify OTP |
| GET/PUT | `/profile` | Get or update user profile |
| GET | `/schemes/eligible` | Get eligible schemes for user |
| GET | `/schemes/:id` | Get scheme details |
| GET | `/schemes/:id/form-fill` | Get auto-filled application form |
| POST | `/documents/upload` | Upload document to vault |
| GET | `/documents` | List user documents |
| DELETE | `/documents/:id` | Delete document |
| POST | `/applications/:schemeId/submit` | Submit application (with doc approval) |
| GET | `/notifications` | Get user notifications |
| PUT | `/notifications/:id/read` | Mark notification as read |

---

## 6. Infrastructure & Deployment

| Component | Service |
|---|---|
| Hosting | Vercel (frontend) + Railway / Render (backend) |
| Database | Supabase (managed PostgreSQL) or Neon.tech |
| Cache | Upstash Redis |
| File Storage | Cloudflare R2 (cheaper than S3) |
| OCR | Google Cloud Vision API |
| LLM | Anthropic API (Claude) + OpenAI API |
| Notifications | Firebase Cloud Messaging + MSG91 |
| Monitoring | Sentry (errors) + Grafana (metrics) |
| CI/CD | GitHub Actions |

---

## 7. Environment Variables Required

```env
# App
NODE_ENV=production
PORT=8000
FRONTEND_URL=https://smartgov.in

# Database
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# Auth
JWT_SECRET=
JWT_REFRESH_SECRET=
OTP_PROVIDER_KEY=   # MSG91 / Firebase

# Storage
S3_BUCKET_NAME=
S3_ACCESS_KEY=
S3_SECRET_KEY=
S3_REGION=

# AI
ANTHROPIC_API_KEY=
OPENAI_API_KEY=      # optional fallback
GOOGLE_VISION_API_KEY=

# Notifications
FCM_SERVER_KEY=
SMS_API_KEY=
```
