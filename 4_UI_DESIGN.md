# UI Design Specification
## SmartGov Assist — Complete Screen-by-Screen UI Guide

**Version:** 1.0
**Date:** 2026-06-25
**Target:** Stitch / AI Design Tool Input

---

## GLOBAL DESIGN SYSTEM

### Color Palette

#### Brand Colors
- **Primary:** `#4F46E5` (Indigo 600)
- **Primary Gradient:** `linear-gradient(135deg, #6366F1 0%, #4F46E5 50%, #4338CA 100%)`
- **Secondary:** `#06B6D4` (Cyan 500)
- **Accent:** `#F59E0B` (Amber 500)
- **Accent Gradient:** `linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)`
- **Success:** `#10B981` (Emerald 500)
- **Warning:** `#F59E0B` (Amber 500)
- **Error:** `#EF4444` (Red 500)

#### Light Theme
- **Background Primary:** `#F8FAFC`
- **Background Secondary:** `#FFFFFF`
- **Background Card:** `#FFFFFF`
- **Surface Elevated:** `#F1F5F9`
- **Text Primary:** `#0F172A`
- **Text Secondary:** `#475569`
- **Text Muted:** `#94A3B8`
- **Border:** `#E2E8F0`
- **Divider:** `#F1F5F9`

#### Dark Theme
- **Background Primary:** `#0B1120`
- **Background Secondary:** `#111827`
- **Background Card:** `#1E293B`
- **Surface Elevated:** `#1E293B`
- **Text Primary:** `#F1F5F9`
- **Text Secondary:** `#94A3B8`
- **Text Muted:** `#64748B`
- **Border:** `#334155`
- **Divider:** `#1E293B`

### Typography
- **Font Family:** `Inter, system-ui, sans-serif`
- **Display (H1):** `32px / 700 weight / -0.02em tracking`
- **Heading (H2):** `24px / 600 weight / -0.01em tracking`
- **Subheading (H3):** `18px / 600 weight`
- **Body Large:** `16px / 400 weight / 1.6 line-height`
- **Body:** `14px / 400 weight / 1.5 line-height`
- **Caption:** `12px / 400 weight / #94A3B8`
- **Label:** `12px / 600 weight / uppercase / 0.05em tracking`

### Button Styles (Soft Rounded Corners)
- **Border Radius (all buttons):** `12px`
- **Border Radius (pill):** `50px`
- **Border Radius (cards):** `16px`
- **Border Radius (inputs):** `12px`
- **Border Radius (modals):** `20px`
- **Border Radius (tags/badges):** `8px`

#### Button Variants

**Primary Button**
```
Background: linear-gradient(135deg, #6366F1 0%, #4338CA 100%)
Text: #FFFFFF, 14px, 600 weight
Padding: 12px 24px
Border Radius: 12px
Shadow: 0 4px 14px rgba(79, 70, 229, 0.4)
Hover: scale(1.02), shadow increase
Active: scale(0.98)
```

**Secondary Button**
```
Light: Background #EEF2FF, Text #4F46E5, Border: none
Dark: Background #1E293B, Text #818CF8, Border: 1px solid #334155
Border Radius: 12px
Padding: 12px 24px
```

**Outline Button**
```
Background: transparent
Border: 1.5px solid #4F46E5 (light) / #6366F1 (dark)
Text: #4F46E5 (light) / #818CF8 (dark)
Border Radius: 12px
Padding: 12px 24px
```

**Danger Button**
```
Background: linear-gradient(135deg, #F87171 0%, #EF4444 100%)
Text: #FFFFFF
Border Radius: 12px
Shadow: 0 4px 14px rgba(239, 68, 68, 0.35)
```

**Success Button**
```
Background: linear-gradient(135deg, #34D399 0%, #10B981 100%)
Text: #FFFFFF
Border Radius: 12px
Shadow: 0 4px 14px rgba(16, 185, 129, 0.35)
```

**Icon Button**
```
Size: 40px × 40px
Border Radius: 12px
Background: Surface Elevated
```

### Input / Form Fields
```
Height: 48px
Border Radius: 12px
Border: 1.5px solid #E2E8F0 (light) / #334155 (dark)
Background: #FFFFFF (light) / #1E293B (dark)
Focus Border: #6366F1
Focus Shadow: 0 0 0 3px rgba(99, 102, 241, 0.15)
Padding: 12px 16px
Font Size: 14px
```

### Card Styles
```
Border Radius: 16px
Background: #FFFFFF (light) / #1E293B (dark)
Border: 1px solid #E2E8F0 (light) / #334155 (dark)
Shadow (light): 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)
Shadow (dark): 0 1px 3px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.2)
Hover Shadow: 0 8px 32px rgba(79, 70, 229, 0.12)
Padding: 24px
```

### Badge / Status Pills
```
Border Radius: 8px
Padding: 4px 10px
Font: 12px, 600 weight

ELIGIBLE: Background #DCFCE7, Text #16A34A (light) / Background #14532D, Text #4ADE80 (dark)
ALMOST: Background #FEF9C3, Text #CA8A04 (light) / Background #422006, Text #FDE047 (dark)
MISSING: Background #FEE2E2, Text #DC2626 (light) / Background #450A0A, Text #F87171 (dark)
PROCESSING: Background #EEF2FF, Text #4F46E5 (light) / Background #1E1B4B, Text #A5B4FC (dark)
VERIFIED: Background #DCFCE7, Text #15803D (light) / Background #052E16, Text #86EFAC (dark)
```

### Navigation / Sidebar
```
Width: 256px (expanded), 72px (collapsed)
Background: #FFFFFF (light) / #111827 (dark)
Border Right: 1px solid #E2E8F0 (light) / #1E293B (dark)
Active Item Background: linear-gradient(135deg, #EEF2FF, #E0E7FF) (light) / #1E1B4B (dark)
Active Item Text: #4F46E5 (light) / #818CF8 (dark)
Active Item Border Left: 3px solid #4F46E5
```

---

## SCREEN 1: LANDING PAGE

**Purpose:** First impression — showcase value proposition, drive sign-ups.

**Layout:** Full-width, single-page scroll. No sidebar.

**Header / Navbar**
```
Height: 72px
Background: rgba(255,255,255,0.85) blur backdrop (light) / rgba(11,17,32,0.85) blur backdrop (dark)
Sticky: true
Logo: Left — "SmartGov" wordmark in gradient text (#6366F1 → #06B6D4)
Nav Links: Center — Features, How it Works, Schemes, Languages
CTA Buttons: Right — "Login" (outline) + "Get Started" (primary gradient)
Border Bottom: 1px solid #E2E8F0 (appears on scroll)
```

**Hero Section**
```
Height: 100vh
Background Light: linear-gradient(160deg, #EEF2FF 0%, #F0FDFA 50%, #F8FAFC 100%)
Background Dark: linear-gradient(160deg, #0B1120 0%, #0F1729 50%, #0B1120 100%)
Floating Decoration: Two blurred gradient orbs behind content
  Orb 1: 500px circle, #6366F1 at 20% opacity, top-left
  Orb 2: 400px circle, #06B6D4 at 15% opacity, bottom-right

Content (centered):
  Tag Chip: "🇮🇳 Built for Bharat" — #FEF9C3 bg, #CA8A04 text, border-radius 50px, padding 6px 16px
  H1: "Every Scheme You Deserve." — 56px, 800 weight, gradient text (#4F46E5 → #06B6D4)
  H1 Line 2: "Effortlessly." — same style
  Subtext: "One profile. One vault. Auto-apply to 500+ government welfare schemes." — 20px, #475569
  CTA Row: [Get Started Free — primary gradient button, 16px, pill shape] [Watch Demo — outline, pill]
  Trust Line: "Trusted by 10,000+ citizens across India" — 14px, #94A3B8 with star icons

Hero Illustration (right side):
  Floating phone mockup showing the dashboard
  Background glow: radial gradient #6366F1 30% opacity
```

**Stats Bar**
```
Background Light: #FFFFFF
Background Dark: #111827
Border: top and bottom 1px solid #E2E8F0 / #1E293B
Padding: 32px 0
4 columns:
  "500+" schemes covered / "10K+" registered users / "70%" auto-fill rate / "5 min" avg apply time
  Numbers: 32px, 700 weight, gradient (#4F46E5 → #06B6D4)
  Labels: 14px, #64748B
```

**Features Section**
```
Background: #F8FAFC (light) / #0B1120 (dark)
Title: "Everything you need to claim your benefits" — centered, H2
Subtitle: Muted text below
Grid: 3 columns, gap 24px

Feature Card (x6):
  Border Radius: 16px
  Background: #FFFFFF / #1E293B
  Border: 1px solid #E2E8F0 / #334155
  Icon Container: 48px × 48px, border-radius 12px, gradient background per feature:
    Eligibility → #6366F1 → #4338CA gradient
    Document Vault → #06B6D4 → #0891B2 gradient
    Auto Form Fill → #F59E0B → #D97706 gradient
    Notifications → #10B981 → #059669 gradient
    Multi-language → #EC4899 → #DB2777 gradient
    Gov Links → #8B5CF6 → #7C3AED gradient
  Feature Name: 16px, 600 weight
  Feature Desc: 14px, #475569 / #94A3B8
  Hover: Card lifts with shadow, border color #6366F1
```

**How It Works Section**
```
Background: linear-gradient(180deg, #F8FAFC 0%, #EEF2FF 100%) light
             linear-gradient(180deg, #0B1120 0%, #0F1729 100%) dark
3-step horizontal flow with connector lines:
  Step 1 → Step 2 → Step 3

Step Card:
  Step Number: 40px circle, gradient background, white number inside, 700 weight
  Step Title: 18px, 600 weight
  Step Desc: 14px, muted

Steps:
  1. "Create Your Profile" — fill basic info in 2 minutes
  2. "Upload Documents Once" — we extract and store securely
  3. "Apply with One Click" — auto-filled, auto-submitted
```

**CTA Section (Bottom)**
```
Background: linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)
Text: White
H2: "Start claiming what's yours today" — white, centered
Subtext: white 80% opacity
Button: White background, #4F46E5 text — "Get Started Free"
Border Radius of section: 24px top corners
```

**Footer**
```
Background: #111827 (always dark)
Text: #94A3B8
Logo in footer, nav links, social icons
Bottom line: "© 2026 SmartGov Assist. For Indian citizens, by Indian developers."
```

---

## SCREEN 2: REGISTER / SIGN UP PAGE

**Layout:** Centered card on gradient background. No sidebar.

**Background**
```
Light: linear-gradient(135deg, #EEF2FF 0%, #F0FDFA 100%)
Dark: linear-gradient(135deg, #0B1120 0%, #0F1729 100%)
Floating orbs: same as landing page (subtle)
```

**Auth Card**
```
Width: 480px
Border Radius: 24px
Background: #FFFFFF (light) / #1E293B (dark)
Shadow: 0 20px 60px rgba(79, 70, 229, 0.15)
Padding: 40px
```

**Card Content**
```
Logo: Top center — SmartGov logo + wordmark (gradient)
Title: "Create your account" — 24px, 700 weight
Subtitle: "Join 10,000+ citizens claiming their benefits" — 14px, muted

Fields (stacked, gap 16px):
  Full Name — Input with user icon left
  Mobile Number — Input with flag (+91) prefix selector, phone icon
  Email Address — Input with email icon
  Password — Input with eye toggle icon
  Confirm Password — Input with eye toggle

Password Strength Meter:
  4 segments below password field
  Colors: #EF4444 (weak) → #F59E0B (fair) → #10B981 (strong) → #6366F1 (very strong)
  Border Radius: 4px each segment

Terms Checkbox:
  Custom checkbox: 18px, border-radius 6px, checked = gradient (#6366F1 fill)
  "I agree to the Terms of Service and Privacy Policy" — 13px

Primary CTA: "Create Account" — full width, primary gradient button, 48px height

Divider: "— or sign up with —" — muted text with lines

Social Sign-In Row:
  Google Button — white bg, Google icon, "Continue with Google" — border 1px solid #E2E8F0
  Border Radius: 12px, full width

Bottom Link: "Already have an account? Login" — #6366F1 text, 14px
```

**OTP Verification Modal** (appears after submit)
```
Overlay: rgba(0,0,0,0.5) backdrop blur
Modal Border Radius: 20px
Width: 400px
Title: "Verify your mobile" — 20px, 600 weight
Sub: "Enter the 6-digit OTP sent to +91-XXXXX" — muted
OTP Input: 6 individual boxes side by side
  Each box: 52px × 56px, border-radius 12px, border 1.5px solid #E2E8F0
  Active box: border #6366F1, shadow 0 0 0 3px rgba(99,102,241,0.15)
  Filled box: background #EEF2FF, text #4F46E5
Resend: "Didn't receive it? Resend in 0:45" — countdown timer, muted
Submit: "Verify OTP" — primary gradient button, full width
```

---

## SCREEN 3: LOGIN PAGE

**Layout:** Same centered card layout as Register.

**Card Content**
```
Same card style as register (480px, 24px radius)

Title: "Welcome back" — 24px, 700 weight
Subtitle: "Sign in to your SmartGov account"

Fields:
  Mobile / Email — Input with icon
  Password — Input with eye toggle
  "Forgot Password?" — right-aligned link, 13px, #6366F1

Primary CTA: "Sign In" — full width, primary gradient

Divider + Google Sign-In (same as register)

Bottom: "Don't have an account? Get Started" — #6366F1
```

---

## SCREEN 4: PROFILE SETUP WIZARD (ONBOARDING)

**Layout:** Full screen with progress stepper. Light sidebar with steps list (desktop). Mobile: top progress bar.

**Background:** Soft `#F8FAFC` (light) / `#0B1120` (dark)

**Progress Stepper (Top)**
```
4 steps shown horizontally
Active Step: Filled circle with step number, gradient background, white text
Completed Step: Filled circle with ✓ checkmark, #10B981 background
Upcoming Step: Outlined circle, #94A3B8
Connector Line: Gradient fills left-to-right as steps complete
  Unfilled: #E2E8F0 / #334155
  Filled: linear-gradient(to right, #6366F1, #06B6D4)
Step Labels below circles: 12px, muted (inactive) / 12px, #4F46E5 (active)
```

**Step Card**
```
Max Width: 640px, centered
Border Radius: 20px
Background: #FFFFFF / #1E293B
Padding: 40px
Shadow: standard card shadow
```

**STEP 1 — Personal Info**
```
Step Icon: 48px circle, gradient (#6366F1 → #4338CA), white user icon
Title: "Tell us about yourself" — 22px, 600 weight
Subtitle: Muted helper text

Fields (2-col grid where applicable):
  Full Name — full width
  Date of Birth — date picker, full width
  Gender: Radio button group
    Custom radio: pill-shaped buttons [Male] [Female] [Other] [Prefer not to say]
    Selected: gradient background #6366F1, white text
    Unselected: border 1.5px solid #E2E8F0, text #475569
    Border Radius: 12px, padding 10px 20px
  Category: Segmented control
    [General] [OBC] [SC] [ST]
    Same pill style as gender
  State: Dropdown with search, custom styled (border-radius 12px)

Nav Buttons:
  "Next →" — right aligned, primary gradient, 48px, border-radius 12px
```

**STEP 2 — Economic Info**
```
Step Icon: ₹ icon in #F59E0B gradient circle

Fields:
  Annual Family Income — Input with ₹ prefix label
    Below: Slider control
    Gradient track: #10B981 (below ₹2L) → #F59E0B (₹2–5L) → #EF4444 (above ₹5L)
    Thumb: White circle with #6366F1 border, 20px diameter
  Occupation — Dropdown (Student / Farmer / Daily Wage / Salaried / Self-Employed / Unemployed / Other)
  BPL Card — Toggle switch
    Off: #E2E8F0 track / On: gradient (#6366F1 → #06B6D4) track
    Thumb: White circle, 20px, shadow
  Bank Account — Toggle switch (same style)
  Disability — Toggle switch

Nav: "← Back" (outline) | "Next →" (primary gradient)
```

**STEP 3 — Location Info**
```
Step Icon: Map pin icon in #06B6D4 gradient circle

Fields:
  State — Searchable dropdown
  District — Searchable dropdown (populates based on state)
  Block / Taluka — Text input
  Pincode — 6-digit input
  Rural / Urban Toggle:
    Pill toggle with 2 options side by side
    Selected: gradient bg, white text
    Unselected: outlined

Map Preview (optional):
  Small map card below, showing selected state highlighted
  Border Radius: 12px
```

**STEP 4 — Preferences**
```
Step Icon: Bell icon in #EC4899 gradient circle

Language Selection:
  Title: "Choose your preferred language"
  Grid of language pills (3 cols):
    Each: flag emoji + language name
    Selected: gradient border 2px, gradient bg tint, bold text
    Unselected: grey border
    Languages shown: Hindi, English, Tamil, Telugu, Bengali, Marathi, Kannada, Malayalam, Gujarati, Punjabi

Notification Preferences:
  Title: "How should we notify you?"
  Toggle rows:
    In-App Notifications — Toggle
    SMS Alerts — Toggle
    Push Notifications — Toggle
    WhatsApp — Toggle (with "Beta" badge)
  Each row: Label + description (muted) + toggle right-aligned

Final CTA:
  "Finish Setup →" — full width, primary gradient, 52px, border-radius 14px
  Sub text below: "Takes less than 30 seconds. You can update these anytime."
```

---

## SCREEN 5: DASHBOARD (HOME)

**Layout:** Left sidebar nav + main content area. Sticky top bar.

**Top Bar**
```
Height: 64px
Background: #FFFFFF (light) / #111827 (dark)
Border Bottom: 1px solid #E2E8F0 / #1E293B
Left: Hamburger + "SmartGov Assist" breadcrumb
Center: Search bar (scheme search)
  Width: 480px
  Border Radius: 12px
  Placeholder: "Search schemes, documents..."
  Background: #F8FAFC / #1E293B
Right:
  Language switcher icon button
  Notification bell icon (with badge count in gradient circle)
  Theme toggle (sun/moon icon, bordered pill)
  Avatar circle — initials, gradient background
```

**Left Sidebar**
```
Width: 256px
Background: #FFFFFF / #111827
Border Right: 1px solid #E2E8F0 / #1E293B
Padding Top: 24px

Logo Section:
  SmartGov gradient logo + "Assist" text
  Version tag below: "v1.0" — muted

Nav Items (with left icons):
  🏠 Dashboard — active
  📋 Eligible Schemes
  🗂 Document Vault
  📝 My Applications
  🔔 Notifications
  👤 My Profile
  ⚙️ Settings

Active Item Style:
  Background: linear-gradient(to right, #EEF2FF, transparent) light
               linear-gradient(to right, #1E1B4B, transparent) dark
  Left border: 3px solid #6366F1
  Text: #4F46E5 / #818CF8, 600 weight
  Icon: #6366F1 / #818CF8

Inactive Item:
  Text: #475569 / #94A3B8
  Hover: bg #F8FAFC / #1E293B

Bottom of Sidebar:
  User mini-card:
    Avatar + Name + "Active" status badge (#10B981 dot)
    "Logout" link in red
```

**Main Content Area**

*Welcome Banner*
```
Background: linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)
Border Radius: 20px
Padding: 28px 32px
Text: White
Greeting: "Good morning, Rahul! 👋" — 22px, 600 weight
Sub: "You have 3 new eligible schemes and 1 document expiring soon."
Right side: Illustration of person with documents (decorative)
```

*Profile Completion Card*
```
Below banner, full width
Border Radius: 16px
Background: #FFFFFF / #1E293B
Padding: 20px 24px
Left: "Complete your profile" — 16px, 600 weight
      "72% complete — add Caste Certificate to unlock 3 more schemes" — muted
Progress Bar:
  Height: 8px, border-radius 4px
  Track: #E2E8F0 / #334155
  Fill: linear-gradient(to right, #6366F1, #06B6D4)
  Current: 72% width
Right: "Complete Now →" — outline button, 12px, border-radius 10px
```

*Stats Row (4 cards)*
```
Grid: 4 columns, gap 16px
Card Style: border-radius 16px, padding 20px

Card 1 — Eligible Schemes:
  Icon: 40px circle, gradient #6366F1
  Value: "12" — 28px, 700 weight, gradient text
  Label: "Eligible Schemes" — muted
  Delta: "+3 new this week" — #10B981, 12px

Card 2 — Documents:
  Icon: 40px circle, gradient #06B6D4
  Value: "4/7" — 28px, 700 weight
  Label: "Documents Uploaded"
  Delta: "3 missing" — #F59E0B

Card 3 — Applications:
  Icon: 40px circle, gradient #10B981
  Value: "2" — 28px, 700 weight
  Label: "Applications Submitted"
  Delta: "1 in review" — muted

Card 4 — Alerts:
  Icon: 40px circle, gradient #EF4444
  Value: "3" — 28px, 700 weight, text #EF4444
  Label: "Action Required"
  Delta: "View alerts →" — #6366F1 link
```

*Top Eligible Schemes (horizontal scroll)*
```
Section Header:
  "Your Top Matches" — 18px, 600 weight
  "View All →" — #6366F1, right aligned

Scheme Cards (horizontal scroll row):
  Width: 280px each
  Border Radius: 16px
  Background: #FFFFFF / #1E293B
  Border: 1px solid #E2E8F0 / #334155
  Padding: 20px

  Top: Category badge (colour coded) + Eligibility score pill
  Eligibility Score Pill:
    Background: gradient fill based on score
    ≥80%: #10B981 gradient
    60–79%: #F59E0B gradient
    Text: white, 12px, 600 weight, border-radius 50px

  Scheme Name: 15px, 600 weight, 2-line clamp
  Benefit text: "₹25,000/year scholarship" — 14px, #6366F1
  Ministry tag: 12px, muted, with building icon

  Bottom Row:
    Deadline chip: "Closes Dec 31" — small pill, red bg tint
    "Apply" button: primary gradient, small, border-radius 10px, padding 8px 16px
```

*Alerts Panel*
```
Title: "Action Required" — 18px, 600 weight, with animated red dot

Alert Items (stacked list):
  Each item:
    Left: colored icon circle (12px)
    Content:
      Alert title — 14px, 600 weight
      Alert desc — 13px, muted, 1-line
      Time — 12px, muted, right
    Right arrow: chevron icon

Alert Types with colours:
  Document Expiring: #F59E0B left border
  Missing Document: #EF4444 left border
  New Scheme: #6366F1 left border
  Deadline: #EC4899 left border
```

---

## SCREEN 6: ELIGIBLE SCHEMES PAGE

**Layout:** Sidebar + main content with filter panel.

**Page Header**
```
Title: "Eligible Schemes" — 24px, 700 weight
Subtitle: "12 schemes matched to your profile" — muted with green dot

Top Row Controls:
  Left: Segment tabs [All] [Eligible] [Almost Eligible] [Applied]
    Active tab: gradient underline + bold text
  Right: [Filter icon button] [Sort dropdown] [Grid/List toggle]
```

**Filter Sidebar (collapsible)**
```
Width: 240px
Title: "Filters" — 14px, 600 weight

Filter Groups:
  Category: Checkbox list (Scholarship, Healthcare, Housing, Agriculture, Women Empowerment)
    Custom checkbox: 16px, border-radius 5px, checked = gradient fill
  Benefit Type: Checkboxes (Cash Transfer, Scholarship, Subsidy, Insurance)
  State: Dropdown searchable
  Income Range: Range slider (gradient track)
  Document Required: Toggle "Show only schemes I can apply now"

Apply Filters Button:
  "Apply" — primary gradient, full width, border-radius 12px
Clear: "Clear All" — text link, muted
```

**Scheme Card Grid (3 cols desktop, 2 tablet, 1 mobile)**

*Eligible Card (Green accent)*
```
Border Radius: 16px
Border Left: 4px solid #10B981
Background: #FFFFFF / #1E293B
Padding: 20px

Top Row:
  Category icon + category name (colored chip)
  Bookmark icon (outline, right)

Eligibility Badge: "ELIGIBLE ✓" — #DCFCE7 bg, #16A34A text, border-radius 8px

Scheme Name: 16px, 600 weight
Ministry: 12px, muted, italic
Benefit: "₹25,000 annual scholarship" — 14px, #10B981, semi-bold

Progress Bar: "Eligibility: 92%"
  Track: #E2E8F0
  Fill: #10B981 gradient (left to right)
  Label: "92%" right-aligned in #10B981

Required Docs Row:
  Icon chips for each doc type (Aadhaar ✓, Income Cert ✓, Caste Cert ✗)
  ✓ = green chip, ✗ = red chip

Deadline: "Closes: Dec 31, 2026" — small red pill chip

Action Row:
  "View Details" — outline button, border-radius 10px
  "Apply Now" — primary gradient button, border-radius 10px
```

*Almost Eligible Card (Amber accent)*
```
Same as above but:
Border Left: 4px solid #F59E0B
Badge: "ALMOST ELIGIBLE" — #FEF9C3 bg, #CA8A04 text
Eligibility Progress: Amber gradient fill
Action: "Upload to Unlock" — amber gradient button (#F59E0B → #D97706)
Missing Info: "Upload Caste Certificate to qualify" — small note with upload icon
```

---

## SCREEN 7: SCHEME DETAIL PAGE

**Layout:** Sidebar + wide content. Back button at top.

**Hero Section**
```
Background: linear-gradient(135deg, #EEF2FF 0%, #F0FDFA 100%) light
             linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%) dark
Border Radius: 20px
Padding: 32px

Top Row:
  "← Back to Schemes" — 14px, link
  Bookmark + Share icons (right)

Scheme Name: 26px, 700 weight
Ministry Badge: "Ministry of Education" — small chip, #EEF2FF bg
Benefit Highlight Box:
  Background: gradient (#6366F1 at 10% opacity)
  Border: 1px solid #6366F1
  Border Radius: 12px
  "₹25,000 / year" — 24px, 700 weight, gradient text
  "Annual Scholarship" — 14px, muted

Status: Large "ELIGIBLE" badge — green gradient, 14px, rounded pill
Deadline chip: "Apply by: Dec 31, 2026" — red bg tint
Official Site link: "govt.scholarship.in →" — muted, external link icon
```

**Content Sections (tabbed or accordion)**

*About*
```
Section Header: 18px, 600 weight, with coloured left border
Text: 14px, 1.7 line-height
```

*Eligibility Criteria*
```
Table or check-list:
  Each criterion row:
    Criterion: "Annual income below ₹2,00,000"
    Your Value: "₹1,80,000" ✅
    Match: Green check or Red X
  Your match highlighted in green fill rows
  Unmet criteria highlighted in red fill rows
```

*Required Documents*
```
Document checklist:
  Each doc row:
    Doc icon + Doc name
    Status badge (Uploaded ✓ / Missing ✗ / Expired ⚠)
    If missing: "Upload" button inline — small, outline, border-radius 8px
```

*Application Process*
```
Numbered steps list:
  Step number: gradient circle
  Step text: 14px
  Connector line between steps
```

**Sticky Bottom Action Bar**
```
Height: 72px
Background: #FFFFFF / #1E293B
Border Top: 1px solid #E2E8F0 / #334155
Shadow: 0 -4px 16px rgba(0,0,0,0.06)

Left: Eligibility score — "92% Match" with progress ring
Right:
  "Apply on Govt Site" — outline button
  "Apply via SmartGov" — primary gradient button, 52px height
```

---

## SCREEN 8: DOCUMENT VAULT

**Layout:** Sidebar + grid content.

**Page Header**
```
Title: "Document Vault" — 24px, 700 weight
Subtitle: "4 of 7 documents uploaded" — muted
Progress Bar: partial fill gradient (#6366F1 → #06B6D4)
"Upload New Document" — primary gradient button, top right
```

**Document Grid (3 cols)**

*Uploaded + Verified Card*
```
Border Radius: 16px
Border: 1px solid #10B981
Background: #F0FDF4 / #052E16
Padding: 20px

Top: File type icon (PDF/JPG) in green circle + "Verified" badge (green)
Doc Name: "Aadhaar Card" — 15px, 600 weight
Uploaded: "Uploaded 3 days ago" — 12px, muted
OCR Badge: "OCR Complete ✓" — small green chip
Expiry: "Valid until 2029" — 12px, muted
  
Action Row:
  "View" icon button
  "Re-upload" icon button
  "Delete" icon button (red)
```

*Missing Slot Card*
```
Border Radius: 16px
Border: 2px dashed #E2E8F0 / #334155
Background: #F8FAFC / #1E293B (dimmer)
Padding: 20px
Opacity: slightly subdued

Center: Upload cloud icon (48px, #94A3B8)
Doc Name: "Caste Certificate" — 15px, 600 weight, muted
Sub: "Required for 4 schemes" — 13px, #EF4444

Upload Button: "Upload" — outline button, border-radius 10px
"Learn what this is" — text link, 12px
```

*Expired Card*
```
Border: 1px solid #F59E0B
Background: #FFFBEB / #422006
Warning badge: "Expired" in amber

"Renew Document" — amber gradient button
```

**Upload Modal**
```
Overlay + center modal
Border Radius: 20px
Width: 520px
Background: #FFFFFF / #1E293B

Title: "Upload Income Certificate" — 20px, 600 weight

Dropzone Area:
  Height: 160px
  Border: 2px dashed #6366F1
  Border Radius: 16px
  Background: #EEF2FF / #1E1B4B
  Center: Upload icon + "Drag & drop or click to browse"
  Sub: "Supports PDF, JPG, PNG up to 5MB"
  On drag-over: border solid, background deeper tint

File format chips: [PDF] [JPG] [PNG] [HEIC] — small outlined pills

Progress Bar (after file select):
  Animated gradient fill
  File name + size shown
  Cancel X button right

Tips Box:
  "For best OCR accuracy, ensure the document is:"
  • Clear and not blurry
  • All 4 corners visible
  • Right-side up

Upload Button: "Upload & Extract Data" — full width, primary gradient
```

**OCR Results Panel (post-upload)**
```
Success toast: "✅ Data extracted successfully"

Review Card:
  Title: "We found the following in your document:"
  Table of extracted fields:
    Field name | Extracted Value | Confidence
    Name       | Rahul Kumar     | High ✅
    DOB        | 01 Jan 2003     | High ✅
    Address    | UP, India       | Medium ⚠️

  "Sync to profile?" — label
  [Sync Now] primary button | [Review & Edit] outline button
```

---

## SCREEN 9: AUTO FORM FILL PREVIEW

**Layout:** Full-width centered flow. Stepper at top (3 steps).

**Step 1: Document Approval Screen**
```
Title: "Documents for PM Scholarship" — 22px, 600 weight
Subtitle: "Review which documents will be used for this application"

Document List:
  Each row — Card style, border-radius 12px, padding 16px:
    Left: Doc icon in colored circle
    Center:
      Doc name — 14px, 600 weight
      "Uploaded 3 days ago | Verified" — 12px, muted
    Right: ✅ or ❌ status icon

  ✅ Row: border #10B981, bg tint green
  ❌ Row: border #EF4444, bg tint red, with inline "Upload Now" button

Partial Submit Note:
  Info card (blue bg tint, border #6366F1, border-radius 12px):
  "You can continue without Caste Certificate as it is optional for this scheme."

Bottom Row:
  "← Cancel" outline button
  "Approve & Continue →" primary gradient button, 52px
```

**Step 2: Auto Form Fill Preview**
```
Title: "Review your auto-filled application" — 22px, 600 weight
Subtitle: "Fields highlighted in yellow need your attention"

Form Fields (rendered as filled form):
  Each field row:
    Label: 12px, LABEL style, muted, all-caps
    Value input: 48px, border-radius 12px

  Confidence indicators:
    High ✅: normal border, lock icon right (auto-filled)
    Medium ⚠️: amber border (#F59E0B), warning icon — "Please verify"
    Empty ❌: red border, "Fill in required" placeholder

  Auto-fill info chip (top of form):
    "✨ 8 of 11 fields auto-filled from your profile and documents"
    Background: #EEF2FF, border: #6366F1, border-radius 10px, 13px text

  Legend bar:
    ✅ Auto-filled | ⚠️ Verify | ❌ Fill required
    Small colored dots with labels

Sticky bottom: field completion count + Submit button
```

**Step 3: Confirmation Screen**
```
Center layout, no sidebar feel

Success Animation:
  Animated checkmark in gradient circle (80px)
  Circles pulse outward on load (#10B981)

Title: "Application Submitted!" — 26px, 700 weight, #10B981
Scheme: "PM Scholarship 2026"
Submission ID: "#SGov-2026-00123" — monospace, 14px, bg chip

Details card:
  Submitted: Today, 3:42 PM
  Documents: 3 attached
  Status: "Under Review"

Next Steps:
  Numbered list
  "Track on official site" — external link button
  "Save to My Applications" — primary button

Back to Dashboard: muted link at bottom
```

---

## SCREEN 10: MY APPLICATIONS

**Layout:** Sidebar + table/card view.

**Tabs:** [All] [Pending] [Approved] [Rejected]

**Application Card/Row**
```
Border Radius: 14px
Background: #FFFFFF / #1E293B
Padding: 20px
Border Left: 4px solid (status color)

Left:
  Scheme name — 15px, 600 weight
  Ministry — 12px, muted
  Applied: date — 12px, muted

Center:
  Submission ID chip — monospace small
  Documents: "3 attached" — muted

Right:
  Status badge:
    Pending: #FEF9C3 bg, #CA8A04 text
    Approved: #DCFCE7 bg, #16A34A text
    Rejected: #FEE2E2 bg, #DC2626 text
    Under Review: #EEF2FF bg, #4F46E5 text
  "View Details" — outline button, 12px
  "Track Status →" — text link
```

---

## SCREEN 11: NOTIFICATION CENTER

**Layout:** Sidebar + list.

**Page Header**
```
Title: "Notifications" — 24px, 700 weight
"Mark all as read" — text link, right

Tabs: [All] [Action Required] [Informational] [Archived]
```

**Notification Item**
```
Row, border-bottom 1px solid #F1F5F9 / #1E293B
Padding: 16px 20px
Unread: left dot indicator (#6366F1 circle 8px), bg slightly tinted

Left: Colored icon circle (48px, border-radius 12px):
  New Scheme → gradient indigo
  Deadline → gradient red
  Doc Expiry → gradient amber
  Missing Doc → gradient orange
  General → gradient grey

Content:
  Title: 14px, 600 weight (bold if unread)
  Description: 13px, muted
  Time: 12px, muted, right

Right: Chevron → or action button (small)

Action types:
  "Apply Now" → green pill button
  "Upload" → amber pill button
  "View" → indigo text link
```

---

## SCREEN 12: MY PROFILE

**Layout:** Sidebar + centered profile card stack.

**Profile Header Card**
```
Background: linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)
Border Radius: 20px
Padding: 32px
Text: white

Avatar:
  96px circle
  Initials or photo
  Border: 3px solid white
  Shadow: 0 4px 16px rgba(0,0,0,0.2)

Name: 22px, 700 weight
Mobile / Email: 14px, white 80%
Profile completion: "72% complete" — white progress bar
Edit Profile button: white bg, #4F46E5 text, border-radius 10px, small
```

**Profile Sections (cards below)**
```
Each section card:
  Border Radius: 16px
  Background: #FFFFFF / #1E293B
  Padding: 24px
  Header row: Section name (600 weight) + Edit icon button (right)

Fields displayed as:
  Label: 12px, muted, all-caps
  Value: 14px, normal weight
  Layout: 2-column grid

Sections:
  Personal Information
  Economic Details
  Location Details
  Preferences & Notifications
```

---

## SCREEN 13: ADMIN PANEL

**Layout:** Distinct dark header with separate sidebar (admin-specific branding).

**Admin Top Bar**
```
Background: #1E1B4B (always dark even in light mode)
Height: 64px
Left: "SmartGov Admin" — white logo, small "Admin" badge in amber chip
Right: User info + logout
```

**Admin Sidebar**
```
Background: #111827
Nav Items:
  📊 Dashboard
  📋 Schemes Management
  👥 User Management
  📄 Document Verification Queue
  🔔 Notifications
  📈 Analytics

Active: left border #6366F1, text white, bg #1E1B4B
Inactive: text #94A3B8
```

**Admin Dashboard**
```
Stats Row (5 cards):
  DAU, Schemes Applied Today, Documents Uploaded, Pending Verifications, New Users

  Card style: border-radius 16px, bg #1E293B
  Values: large gradient text
  Mini sparkline chart below each value

Quick Action Buttons:
  "Add New Scheme" — primary gradient
  "Process Document Queue" — secondary
  "Send Bulk Notification" — outline
```

**Scheme Management Table**
```
Table:
  Header: sticky, #1E1B4B bg, white text, 12px uppercase
  Rows: alternating #1E293B / transparent
  Border Radius (table container): 16px
  
  Columns: Scheme Name | Category | Active | Applications | Last Updated | Actions
  
  Actions: Edit icon | Toggle switch | Delete icon (red)
  Active toggle: same pill style as profile toggles
```

**Document Verification Queue**
```
Card list view:
  Each card:
    Left: Document thumbnail preview (blurred until clicked)
    Center: User name + Doc type + Uploaded time
    Right:
      "Approve" — green gradient button, border-radius 10px
      "Reject" — red outline button
      Rejection reason dropdown appears if Reject clicked
```

---

## SCREEN 14: SETTINGS

**Layout:** Sidebar + settings panels.

**Settings Categories (left sub-nav)**
```
[Account] [Security] [Notifications] [Privacy] [Language] [Appearance]
```

**Appearance Settings**
```
Theme Toggle:
  3 options: [Light] [Dark] [System]
  Selected: gradient border + checkmark

Accent Color Picker:
  6 color swatches in a row (40px circles)
  Currently selected has gradient ring
  Colors: Indigo, Cyan, Emerald, Amber, Rose, Purple
```

**Security Settings**
```
Toggle rows:
  Two-Factor Auth
  Login Notifications
  Auto Logout after inactivity

Change Password:
  Compact form inside a card
  Current + New + Confirm password
  Update button
```

---

## MOBILE RESPONSIVE NOTES

- Sidebar collapses to bottom tab bar on mobile (5 tabs: Home, Schemes, Vault, Notifications, Profile)
- Bottom tab bar:
  Height: 64px + safe area
  Background: #FFFFFF / #1E293B
  Border Top: 1px solid #E2E8F0 / #334155
  Active icon: gradient color fill, label bold
  Inactive: grey icon, muted label
- Cards go full-width on mobile
- Form wizard shows step indicator as horizontal dots (not full stepper)
- All modals are bottom sheets on mobile (slide up from bottom, border-radius top corners only)
- Search expands to full width on mobile

---

## ACCESSIBILITY & MICRO-INTERACTIONS

**Focus States**
All interactive elements:
```
outline: 2px solid #6366F1
outline-offset: 2px
border-radius: matches element radius
```

**Loading States**
- Skeleton loaders: gradient shimmer animation (#E2E8F0 → #F8FAFC → #E2E8F0)
- Button loading: spinner replaces text, button disabled with 70% opacity

**Toast Notifications**
```
Position: top-right
Border Radius: 14px
Width: 360px
Background: #FFFFFF / #1E293B
Border Left: 4px solid (type color)
Shadow: 0 8px 32px rgba(0,0,0,0.12)
Auto-dismiss: 4 seconds with progress bar
Types: Success (green), Error (red), Warning (amber), Info (indigo)
```

**Hover Effects**
- Cards: translateY(-2px) + shadow increase + border color lightens
- Buttons: scale(1.02) or brightness increase
- All transitions: 200ms ease-out
