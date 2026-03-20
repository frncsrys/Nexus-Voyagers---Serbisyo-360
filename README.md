Serbisyo360 — Frontend Documentation

Registry · Verification · Accountability
An LGU-managed portal where agricultural extension workers are registered, verified, and reviewed — giving the government clean, trustworthy data on their workforce for project deployment and hiring decisions.


Table of Contents

Project Overview
Tech Stack
Project Structure
Installation & Setup
Environment Variables
Pages & Routes
User Roles & Flows
Components
Styling System
Mock Data
Backend Integration Points
Known Limitations
Next Steps — Backend


Project Overview
Serbisyo360 is a civic-tech platform built for Local Government Units (LGUs) in the Philippines. It solves the problem of unverified, untracked government extension workers by providing:

A registration and verification system for agricultural extension workers
A QR code-based identity system where any community member can scan and review a worker
OTP-verified reviews that prevent spam and duplicate submissions
An LGU admin dashboard with analytics, worker management, and approval workflows

Three User Types
RoleDescriptionLGU AdminManages and verifies workers, views analytics, approves/rejects profilesExtension WorkerRegisters, receives QR code, views their ratings and reviewsGeneral PublicScans QR code, submits OTP-verified review — no account needed

Tech Stack
TechnologyVersionPurposeNext.js15.x (App Router)Full-stack React frameworkTypeScript5.xType safetyTailwind CSS4.xUtility-first stylingshadcn/uiLatestBase UI componentslucide-react0.383.0Icon libraryzodLatestForm validation schemasreact-hook-formLatestForm state management@hookform/resolversLatestZod + RHF integrationPostgreSQL15.xDatabase (backend — not yet connected)
Fonts

Fraunces — display/heading font (serif, italic for emphasis)
DM Sans — body font (clean, readable)

Both loaded from Google Fonts via globals.css.

Project Structure
serbisyo360/
├── public/
│   └── serbisyo360-logo.png          # App logo — used everywhere
│
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── page.tsx                  # Landing page (/)
│   │   ├── not-found.tsx             # 404 page (auto-triggered)
│   │   ├── layout.tsx                # Root layout
│   │   ├── globals.css               # Global styles, fonts, animations
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx              # /login
│   │   ├── forgot-password/
│   │   │   └── page.tsx              # /forgot-password
│   │   ├── register/
│   │   │   ├── lgu/
│   │   │   │   └── page.tsx          # /register/lgu
│   │   │   └── worker/
│   │   │       └── page.tsx          # /register/worker
│   │   │
│   │   ├── worker/                   # Public-facing worker pages
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx          # /worker/[id] — public profile + review form
│   │   │   │   └── verify/
│   │   │   │       └── page.tsx      # /worker/[id]/verify — OTP verification
│   │   │   ├── success/
│   │   │   │   └── page.tsx          # /worker/success — review submitted
│   │   │   ├── already-reviewed/
│   │   │   │   └── page.tsx          # /worker/already-reviewed
│   │   │   ├── expired/
│   │   │   │   └── page.tsx          # /worker/expired — session expired
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx          # /worker/dashboard — worker portal
│   │   │   ├── qr-code/
│   │   │   │   └── page.tsx          # /worker/qr-code — view/download QR
│   │   │   └── edit-profile/
│   │   │       └── page.tsx          # /worker/edit-profile
│   │   │
│   │   ├── lgu/                      # LGU Admin pages (protected)
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx          # /lgu/dashboard
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx          # /lgu/analytics
│   │   │   ├── workers/
│   │   │   │   ├── page.tsx          # /lgu/workers — worker management table
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # /lgu/workers/[id] — worker detail + reviews
│   │   │   └── approvals/
│   │   │       └── page.tsx          # /lgu/approvals — pending approvals
│   │   │
│   │   └── unauthorized/
│   │       └── page.tsx              # /unauthorized
│   │
│   ├── components/
│   │   ├── shared/
│   │   │   └── PublicNav.tsx         # Top nav for public-facing pages
│   │   ├── lgu/
│   │   │   └── Sidebar.tsx           # LGU admin sidebar (shared across all LGU pages)
│   │   └── ui/                       # shadcn/ui base components
│   │
│   ├── lib/
│   │   ├── constants.ts              # App-wide constants (specializations, municipalities, etc.)
│   │   ├── logout.ts                 # Shared logout utility
│   │   └── utils.ts                  # cn() helper from shadcn
│   │
│   ├── types/
│   │   └── index.ts                  # Shared TypeScript interfaces
│   │
│   └── hooks/                        # Custom React hooks (empty — ready for use)

Installation & Setup
Prerequisites

Node.js v18.17 or higher
npm v9 or higher
Git

Step 1 — Clone the repository
bashgit clone https://github.com/your-org/serbisyo360.git
cd serbisyo360
Step 2 — Install dependencies
bashnpm install
Step 3 — Set up environment variables
bashcp .env.example .env.local
Fill in the required values (see Environment Variables section).
Step 4 — Run the development server
bashnpm run dev
Visit http://localhost:3000 to see the app.
Other Commands
bashnpm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint

Environment Variables
Create a .env.local file in the root directory. The following variables will be needed once the backend is connected:
env# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database (PostgreSQL — not yet connected)
DATABASE_URL=postgresql://user:password@localhost:5432/serbisyo360

# Auth (NextAuth.js — not yet set up)
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# SMS OTP Provider (Semaphore PH — not yet connected)
SEMAPHORE_API_KEY=your-semaphore-key
SEMAPHORE_SENDER_NAME=SERBISYO

# Email (for OTP fallback — not yet connected)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your-app-password

Note: The frontend currently runs entirely without any environment variables. All data is mocked. Env vars will only be required once the backend API routes are built.


Pages & Routes
Public Pages
RouteFileDescription/app/page.tsxLanding page — static marketing content/worker/[id]app/worker/[id]/page.tsxWorker public profile + review form/worker/[id]/verifyapp/worker/[id]/verify/page.tsxOTP verification (6-digit input)/worker/successapp/worker/success/page.tsxReview submitted confirmation/worker/already-reviewedapp/worker/already-reviewed/page.tsxDuplicate review prevention screen/worker/expiredapp/worker/expired/page.tsx30-minute session expired screen
Authentication Pages
RouteFileDescription/loginapp/login/page.tsxUnified login with LGU/Worker tab switcher/register/lguapp/register/lgu/page.tsxLGU admin registration (2-step)/register/workerapp/register/worker/page.tsxWorker registration (2-step)/forgot-passwordapp/forgot-password/page.tsxPassword reset email flow
LGU Admin Pages (will require auth)
RouteFileDescription/lgu/dashboardapp/lgu/dashboard/page.tsxMain dashboard — stats, activity, areas/lgu/analyticsapp/lgu/analytics/page.tsxCharts — reviews per month, by specialization, worker performance/lgu/workersapp/lgu/workers/page.tsxWorker table with search, filters, pagination/lgu/workers/[id]app/lgu/workers/[id]/page.tsxWorker detail — profile, ratings, reviews, approve/reject/lgu/approvalsapp/lgu/approvals/page.tsxPending approvals queue with approve/reject actions
Worker Pages (will require auth)
RouteFileDescription/worker/dashboardapp/worker/dashboard/page.tsxWorker portal — profile, ratings, recent reviews/worker/qr-codeapp/worker/qr-code/page.tsxView, download, and print QR code/worker/edit-profileapp/worker/edit-profile/page.tsxEdit personal and work details
System Pages
RouteFileDescription/unauthorizedapp/unauthorized/page.tsxAccess denied screen* (any unknown)app/not-found.tsx404 — auto-triggered by Next.js

User Roles & Flows
Flow 1 — Public Review (No Account Needed)
Worker shows QR code
  → Community member scans QR
  → /worker/[id]          — sees worker profile, fills review form
  → /worker/[id]/verify   — enters OTP sent via SMS
  → /worker/success       — review confirmed

Error cases:
  → /worker/already-reviewed   — same phone number used before
  → /worker/expired            — session older than 30 minutes
Flow 2 — LGU Admin
/register/lgu    → 2-step registration (LGU info → set password)
/login           → select LGU Admin tab → redirects to /lgu/dashboard

Dashboard features:
  → /lgu/dashboard     — stats overview, recent activity, areas covered
  → /lgu/workers       — search/filter workers, view profiles
  → /lgu/workers/[id]  — approve, reject, or deactivate a worker
  → /lgu/approvals     — pending queue, approve/reject with confirmation modal
  → /lgu/analytics     — charts, worker performance, specialization breakdown
Flow 3 — Extension Worker
/register/worker    → 2-step registration (personal info + security → work details)
/login              → select Local Worker tab → redirects to /worker/dashboard

Worker features:
  → /worker/dashboard      — view profile, ratings, recent reviews
  → /worker/edit-profile   — update details (triggers re-approval)
  → /worker/qr-code        — view/download/print QR (only if verified)

Components
src/components/shared/PublicNav.tsx
Top navigation bar used on all public-facing pages (worker profile, OTP, success, expired, already-reviewed).
Props:
tsxinterface PublicNavProps {
  rightLabel?: string; // default: "Verified Platform"
}
Logo redirect logic:

If logged in as LGU → /lgu/dashboard
If logged in as Worker → /worker/dashboard
If not logged in → /


Currently hardcoded to isLoggedIn = false. Will be replaced with real session once auth is connected.


src/components/lgu/Sidebar.tsx
Left sidebar used across all LGU admin pages. Handles:

Active nav highlighting using usePathname()
Logo redirect based on role
Logout via logout() utility
Mobile version (pass mobile prop + onClose handler)

Usage:
tsx// Desktop
<div className="hidden lg:flex flex-col w-64 shrink-0">
  <Sidebar />
</div>

// Mobile overlay
<Sidebar mobile onClose={() => setMobileOpen(false)} />

src/lib/logout.ts
Shared logout utility used by all pages with a logout button.
tsximport { logout } from "@/lib/logout";

<button onClick={logout}>Log out</button>

Currently just redirects to /login. Will be updated to call POST /api/auth/logout and clear the session cookie.


src/lib/constants.ts
App-wide constants:
tsxAPP_NAME           // "Serbisyo360"
APP_TAGLINE        // Full tagline string
SPECIALIZATIONS    // Array of worker specialization options
MUNICIPALITIES     // Array of municipality names
RATING_LABELS      // { 1: "Poor", 2: "Fair", ... 5: "Excellent" }
OTP_EXPIRY_MINUTES // 10
NAV_LINKS          // Public nav links array

src/types/index.ts
Shared TypeScript interfaces:
tsxUserRole          // "lgu_admin" | "worker" | "public"
WorkerStatus      // "pending" | "verified" | "rejected"
Worker            // Full worker object shape
Review            // Review object shape
LGUAdmin          // Admin object shape
OTPSession        // OTP session object shape
DashboardStats    // Dashboard summary card data

Styling System
Color Palette
TokenHexUsage--primary / brand-green-dark#0f4d2bPrimary buttons, headers, key UI--accent / brand-green-mid#1a7a45Hover states, accentsbrand-green-light#d4eddaBackgrounds, badges, success statesbrand-gold#f4c430Star ratings--background#f7f9f5Page background#0a2e18—Darkest green — sidebar, nav headers#a8e6bf—Light green text on dark backgrounds
Custom CSS Classes (defined in globals.css)
ClassDescription.font-displayFraunces serif font.auth-bgLight cream gradient — used on login/register pages.bg-meshDark green radial gradient — used on auth left panels.grid-overlaySubtle grid pattern overlay.input-fieldDark green form input — used inside dark panels.animate-fade-upFade + slide up entrance animation.animate-fade-inFade in entrance animation.animate-floatFloating loop animation.delay-1 through .delay-4Animation delay utilities
Design Principles

Two-panel auth layout — dark green left (branding) + white right (form)
Card-based content — white cards with border border-gray-100 shadow-sm rounded-2xl
Consistent green hierarchy — #0a2e18 (darkest) → #0f4d2b (primary) → #1a7a45 (accent) → #d4edda (light)
Form inputs on white backgrounds — light gray (bg-gray-50) with green focus border
Form inputs on dark backgrounds — use .input-field class (semi-transparent white)


Mock Data
All pages currently use hardcoded mock data. When the backend is ready, each mock will be replaced with a real API call. Mock data is located at the top of each page file, clearly marked with a // TODO comment.
PageMock DataWill Be Replaced Withworker/[id]/page.tsxMOCK_WORKERGET /api/workers/[id]worker/dashboard/page.tsxMOCK_WORKERGET /api/workers/melgu/dashboard/page.tsxSTATS, AREAS, COMMUNITY_METRICS, RECENT_ACTIVITYGET /api/lgu/dashboardlgu/workers/page.tsxMOCK_WORKERSGET /api/lgu/workerslgu/workers/[id]/page.tsxMOCK_WORKER, MOCK_REVIEWSGET /api/workers/[id]lgu/approvals/page.tsxPENDING_WORKERSGET /api/lgu/workers?status=pendinglgu/analytics/page.tsxMONTHLY_REVIEWS, WORKER_PERFORMANCEGET /api/lgu/analytics

Backend Integration Points
Every location where the backend needs to be connected is marked with a // TODO: comment in the code. Here is the complete list:
Auth
POST /api/auth/register/lgu        → src/app/register/lgu/page.tsx
POST /api/auth/register/worker     → src/app/register/worker/page.tsx
POST /api/auth/login               → src/app/login/page.tsx
POST /api/auth/logout              → src/lib/logout.ts
POST /api/auth/forgot-password     → src/app/forgot-password/page.tsx
Workers
GET   /api/workers/[id]            → src/app/worker/[id]/page.tsx
GET   /api/workers/me              → src/app/worker/dashboard/page.tsx
PATCH /api/workers/me              → src/app/worker/edit-profile/page.tsx
GET   /api/workers/me/qr           → src/app/worker/qr-code/page.tsx
PATCH /api/workers/[id]/status     → src/app/lgu/workers/[id]/page.tsx
                                   → src/app/lgu/approvals/page.tsx
OTP & Reviews
POST /api/otp/send                 → src/app/worker/[id]/page.tsx
POST /api/otp/verify               → src/app/worker/[id]/verify/page.tsx
POST /api/otp/resend               → src/app/worker/[id]/verify/page.tsx
POST /api/otp/send-email           → src/app/worker/[id]/verify/page.tsx
POST /api/reviews/submit           → src/app/worker/[id]/verify/page.tsx
LGU Dashboard & Analytics
GET /api/lgu/dashboard             → src/app/lgu/dashboard/page.tsx
GET /api/lgu/workers               → src/app/lgu/workers/page.tsx
GET /api/lgu/analytics             → src/app/lgu/analytics/page.tsx
Auth Session (Role-Aware Logic)
These two files have hardcoded isLoggedIn and userRole values that need to be replaced with real session data:
src/components/shared/PublicNav.tsx   → logo redirect logic
src/components/lgu/Sidebar.tsx        → logo redirect logic

Known Limitations
These are known gaps in the current frontend that will be addressed during or after backend integration:
IssueLocationFixisLoggedIn is hardcodedPublicNav.tsx, Sidebar.tsxReplace with useSession() from NextAuthNo route protectionAll /lgu/* and /worker/dashboard routesAdd Next.js middlewareWorker ID in success/already-reviewed pages is hardcoded to worker-001success/page.tsx, already-reviewed/page.tsxPass workerId through OTP flow via query params or sessionQR code is a placeholder iconworker/qr-code/page.tsxReplace with real QR image from GET /api/workers/me/qrLogout only redirects, doesn't clear sessionsrc/lib/logout.tsAdd POST /api/auth/logout callNo pagination on LGU worker detail reviewslgu/workers/[id]/page.tsxAdd pagination once real data is connectedAnalytics charts are CSS-only bar chartslgu/analytics/page.tsxOptionally replace with recharts or Chart.js for real dataEdit profile doesn't actually re-trigger pending statusworker/edit-profile/page.tsxBackend must set status = "pending" on PATCH

Next Steps — Backend
The frontend is complete and ready to connect. The recommended backend implementation order is:

Database schema — PostgreSQL + Prisma

users table (LGU admins + workers, role-based)
workers table (profile data, status, QR code URL)
reviews table (rating, comment, hashed phone, service date)
otp_sessions table (phone, worker_id, code, expires_at)


Auth — NextAuth.js with credentials provider

Role-based sessions (lgu_admin | worker)
Middleware to protect /lgu/* and /worker/dashboard, /worker/qr-code, /worker/edit-profile


API Routes — Next.js /app/api/ route handlers

Auth routes (register, login, logout, forgot password)
Worker routes (profile, QR generation, status updates)
OTP routes (send via Semaphore PH SMS, verify, resend)
Review routes (submit with duplicate check)
LGU dashboard routes (aggregated stats, worker list, analytics)


QR Code generation

Use qrcode npm package
Generate on worker approval
Store URL in workers table


SMS Integration

Semaphore for Philippine SMS OTP delivery
Fallback email OTP via Nodemailer




Contributing
This project follows a standard Git branching strategy:
main          → production-ready code
develop       → integration branch
feature/*     → individual feature branches
fix/*         → bug fix branches
When adding new pages:

Create the page file under src/app/
Add mock data at the top with // TODO: comments for API calls
Use existing Tailwind classes and color tokens from globals.css
Add the route to this README under Pages & Routes
Add any new API endpoints to Backend Integration Points


License
This project is proprietary. All rights reserved.

Last updated: March 20, 2026 — Frontend phase complete, backend pending.