Serbisyo360
Registry · Verification · Accountability
An LGU-managed portal where agricultural extension workers are registered, verified, and reviewed — giving the government clean, trustworthy data on their workforce for project deployment and hiring decisions.

Table of Contents

Project Overview
Tech Stack
Project Structure
Installation and Setup
Environment Variables
Pages and Routes
User Roles and Flows
Components
Styling System
Mock Data
Backend Integration Points
Known Limitations
Next Steps — Backend
Contributing


Project Overview
Serbisyo360 is a civic-tech platform built for Local Government Units (LGUs) in the Philippines. It solves the problem of unverified, untracked government extension workers by providing:

A registration and verification system for agricultural extension workers
A QR code-based identity system where any community member can scan and review a worker
OTP-verified reviews that prevent spam and duplicate submissions
An LGU admin dashboard with analytics, worker management, and approval workflows

Three User Types
RoleDescriptionLGU AdminManages and verifies workers, views analytics, approves or rejects profilesExtension WorkerRegisters, receives QR code, views their ratings and reviewsGeneral PublicScans QR code, submits OTP-verified review — no account needed

Tech Stack
TechnologyVersionPurposeNext.js15.x App RouterFull-stack React frameworkTypeScript5.xType safetyTailwind CSS4.xUtility-first stylingshadcn/uiLatestBase UI componentslucide-react0.383.0Icon libraryzodLatestForm validation schemasreact-hook-formLatestForm state management@hookform/resolversLatestZod + RHF integrationPostgreSQL15.xDatabase (backend — not yet connected)
Fonts

Fraunces — display/heading font (serif, italic for emphasis)
DM Sans — body font (clean, readable)

Both loaded from Google Fonts via globals.css.

Project Structure
serbisyo360/
├── public/
│   └── serbisyo360-logo.png
│
└── src/
    ├── app/
    │   ├── page.tsx                        # Landing page (/)
    │   ├── not-found.tsx                   # 404 page
    │   ├── layout.tsx                      # Root layout
    │   ├── globals.css                     # Global styles, fonts, animations
    │   │
    │   ├── login/
    │   │   └── page.tsx                    # /login
    │   │
    │   ├── forgot-password/
    │   │   └── page.tsx                    # /forgot-password
    │   │
    │   ├── register/
    │   │   ├── lgu/
    │   │   │   └── page.tsx                # /register/lgu
    │   │   └── worker/
    │   │       └── page.tsx                # /register/worker
    │   │
    │   ├── worker/
    │   │   ├── [id]/
    │   │   │   ├── page.tsx                # /worker/[id] — public profile + review form
    │   │   │   └── verify/
    │   │   │       └── page.tsx            # /worker/[id]/verify — OTP verification
    │   │   ├── success/
    │   │   │   └── page.tsx                # /worker/success
    │   │   ├── already-reviewed/
    │   │   │   └── page.tsx                # /worker/already-reviewed
    │   │   ├── expired/
    │   │   │   └── page.tsx                # /worker/expired
    │   │   ├── dashboard/
    │   │   │   └── page.tsx                # /worker/dashboard
    │   │   ├── qr-code/
    │   │   │   └── page.tsx                # /worker/qr-code
    │   │   └── edit-profile/
    │   │       └── page.tsx                # /worker/edit-profile
    │   │
    │   ├── lgu/
    │   │   ├── dashboard/
    │   │   │   └── page.tsx                # /lgu/dashboard
    │   │   ├── analytics/
    │   │   │   └── page.tsx                # /lgu/analytics
    │   │   ├── workers/
    │   │   │   ├── page.tsx                # /lgu/workers
    │   │   │   └── [id]/
    │   │   │       └── page.tsx            # /lgu/workers/[id]
    │   │   └── approvals/
    │   │       └── page.tsx                # /lgu/approvals
    │   │
    │   └── unauthorized/
    │       └── page.tsx                    # /unauthorized
    │
    ├── components/
    │   ├── shared/
    │   │   └── PublicNav.tsx               # Top nav for public-facing pages
    │   ├── lgu/
    │   │   └── Sidebar.tsx                 # LGU admin sidebar
    │   └── ui/                             # shadcn/ui base components
    │
    ├── lib/
    │   ├── constants.ts                    # App-wide constants
    │   ├── logout.ts                       # Shared logout utility
    │   └── utils.ts                        # cn() helper from shadcn
    │
    ├── types/
    │   └── index.ts                        # Shared TypeScript interfaces
    │
    └── hooks/                              # Custom React hooks (empty — ready for use)

Installation and Setup
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
Fill in the required values. See the Environment Variables section.
Step 4 — Run the development server
bashnpm run dev
Visit http://localhost:3000 to see the app.
Other Commands
bashnpm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint

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

# Email OTP Fallback (not yet connected)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your-app-password

The frontend currently runs entirely without any environment variables. All data is mocked. Env vars will only be required once the backend API routes are built.


Pages and Routes
Public Pages
RouteFileDescription/app/page.tsxLanding page — static marketing content/worker/[id]app/worker/[id]/page.tsxWorker public profile and review form/worker/[id]/verifyapp/worker/[id]/verify/page.tsxOTP verification — 6-digit input/worker/successapp/worker/success/page.tsxReview submitted confirmation/worker/already-reviewedapp/worker/already-reviewed/page.tsxDuplicate review prevention screen/worker/expiredapp/worker/expired/page.tsx30-minute session expired screen
Authentication Pages
RouteFileDescription/loginapp/login/page.tsxUnified login with LGU/Worker tab switcher/register/lguapp/register/lgu/page.tsxLGU admin registration — 2 steps/register/workerapp/register/worker/page.tsxWorker registration — 2 steps/forgot-passwordapp/forgot-password/page.tsxPassword reset email flow
LGU Admin Pages
RouteFileDescription/lgu/dashboardapp/lgu/dashboard/page.tsxMain dashboard — stats, activity, areas covered/lgu/analyticsapp/lgu/analytics/page.tsxCharts — reviews per month, specialization, performance/lgu/workersapp/lgu/workers/page.tsxWorker table with search, filters, pagination/lgu/workers/[id]app/lgu/workers/[id]/page.tsxWorker detail — profile, ratings, reviews, actions/lgu/approvalsapp/lgu/approvals/page.tsxPending approvals queue
Worker Pages
RouteFileDescription/worker/dashboardapp/worker/dashboard/page.tsxWorker portal — profile, ratings, recent reviews/worker/qr-codeapp/worker/qr-code/page.tsxView, download, and print QR code/worker/edit-profileapp/worker/edit-profile/page.tsxEdit personal and work details
System Pages
RouteFileDescription/unauthorizedapp/unauthorized/page.tsxAccess denied screenany unknown routeapp/not-found.tsx404 page — auto-triggered by Next.js

User Roles and Flows
Flow 1 — Public Review (No Account Needed)
Worker shows QR code
  → Community member scans QR
  → /worker/[id]              View worker profile, fill in review form
  → /worker/[id]/verify       Enter OTP sent via SMS
  → /worker/success           Review confirmed and recorded

Error cases:
  → /worker/already-reviewed  Same phone number already reviewed this worker
  → /worker/expired           Session is older than 30 minutes
Flow 2 — LGU Admin
/register/lgu    2-step registration (LGU info → set password)
/login           Select LGU Admin tab → redirects to /lgu/dashboard

Dashboard features:
  /lgu/dashboard       Stats overview, recent activity, areas covered
  /lgu/workers         Search and filter workers, view profiles
  /lgu/workers/[id]    Approve, reject, or deactivate a worker
  /lgu/approvals       Pending queue with approve/reject and confirmation modal
  /lgu/analytics       Charts, worker performance, specialization breakdown
Flow 3 — Extension Worker
/register/worker    2-step registration (personal info + security → work details)
/login              Select Local Worker tab → redirects to /worker/dashboard

Worker features:
  /worker/dashboard      View profile, ratings, and recent reviews
  /worker/edit-profile   Update details — triggers re-approval by LGU
  /worker/qr-code        View, download, and print QR (only available if verified)

Components
PublicNav
File: src/components/shared/PublicNav.tsx
Top navigation bar used on all public-facing pages.
tsx<PublicNav rightLabel="Verified Platform" />
PropTypeDefaultDescriptionrightLabelstring"Verified Platform"Text shown on the right side of the nav
Logo redirect logic:

Logged in as LGU → /lgu/dashboard
Logged in as Worker → /worker/dashboard
Not logged in → /


Currently hardcoded to isLoggedIn = false. Replace with useSession() once auth is connected.


Sidebar
File: src/components/lgu/Sidebar.tsx
Left sidebar shared across all LGU admin pages. Handles active nav highlighting using usePathname(), role-aware logo redirect, logout, and mobile support.
tsx// Desktop
<Sidebar />

// Mobile overlay
<Sidebar mobile onClose={() => setMobileOpen(false)} />
PropTypeDefaultDescriptionmobilebooleanfalseRenders mobile version without fixed widthonClosefunctionundefinedCallback for close button in mobile mode

logout utility
File: src/lib/logout.ts
Shared logout function used by all pages with a logout button.
tsximport { logout } from "@/lib/logout";

<button onClick={logout}>Log out</button>

Currently redirects to /login. Update to call POST /api/auth/logout and clear the session cookie once auth is connected.


Styling System
Color Palette
NameHexUsagebrand-green-dark#0f4d2bPrimary buttons, headers, key UIbrand-green-mid#1a7a45Hover states, accentsbrand-green-light#d4eddaBackgrounds, badges, success statesbrand-gold#f4c430Star ratingsbackground#f7f9f5Page backgrounddarkest green#0a2e18Sidebar, nav headerslight text on dark#a8e6bfText on dark green backgrounds
Custom CSS Classes
Defined in src/app/globals.css:
ClassDescription.font-displayFraunces serif font.auth-bgLight cream gradient — login and register pages.bg-meshDark green radial gradient — auth left panels.grid-overlaySubtle grid pattern overlay.input-fieldForm input style for dark panel backgrounds.animate-fade-upFade and slide up entrance animation.animate-fade-inFade in entrance animation.animate-floatFloating loop animation.delay-1 to .delay-4Animation delay utilities (0.1s to 0.4s)
Design Principles

Two-panel auth layout — dark green left panel for branding, white right panel for forms
Card-based content — white cards with border border-gray-100 shadow-sm rounded-2xl
Green hierarchy — #0a2e18 darkest, #0f4d2b primary, #1a7a45 accent, #d4edda lightest
Light form inputs — bg-gray-50 with green focus ring on white backgrounds
Dark form inputs — .input-field class for inputs inside dark green panels


Mock Data
All pages currently use hardcoded mock data. When the backend is ready, each mock will be replaced with a real API call. Mock data is at the top of each page file, marked with a // TODO: comment.
PageMock VariableReplace Withworker/[id]/page.tsxMOCK_WORKERGET /api/workers/[id]worker/dashboard/page.tsxMOCK_WORKERGET /api/workers/melgu/dashboard/page.tsxSTATS, AREAS, COMMUNITY_METRICS, RECENT_ACTIVITYGET /api/lgu/dashboardlgu/workers/page.tsxMOCK_WORKERSGET /api/lgu/workerslgu/workers/[id]/page.tsxMOCK_WORKER, MOCK_REVIEWSGET /api/workers/[id]lgu/approvals/page.tsxPENDING_WORKERSGET /api/lgu/workers?status=pendinglgu/analytics/page.tsxMONTHLY_REVIEWS, WORKER_PERFORMANCEGET /api/lgu/analytics

Backend Integration Points
Every location where the backend needs to connect is marked with a // TODO: comment in the source code.
Auth
EndpointFilePOST /api/auth/register/lguapp/register/lgu/page.tsxPOST /api/auth/register/workerapp/register/worker/page.tsxPOST /api/auth/loginapp/login/page.tsxPOST /api/auth/logoutsrc/lib/logout.tsPOST /api/auth/forgot-passwordapp/forgot-password/page.tsx
Workers
EndpointFileGET /api/workers/[id]app/worker/[id]/page.tsxGET /api/workers/meapp/worker/dashboard/page.tsxPATCH /api/workers/meapp/worker/edit-profile/page.tsxGET /api/workers/me/qrapp/worker/qr-code/page.tsxPATCH /api/workers/[id]/statusapp/lgu/workers/[id]/page.tsx, app/lgu/approvals/page.tsx
OTP and Reviews
EndpointFilePOST /api/otp/sendapp/worker/[id]/page.tsxPOST /api/otp/verifyapp/worker/[id]/verify/page.tsxPOST /api/otp/resendapp/worker/[id]/verify/page.tsxPOST /api/otp/send-emailapp/worker/[id]/verify/page.tsxPOST /api/reviews/submitapp/worker/[id]/verify/page.tsx
LGU Dashboard and Analytics
EndpointFileGET /api/lgu/dashboardapp/lgu/dashboard/page.tsxGET /api/lgu/workersapp/lgu/workers/page.tsxGET /api/lgu/analyticsapp/lgu/analytics/page.tsx
Session Logic to Update
These two files have hardcoded isLoggedIn values that must be replaced with real session data once auth is connected:

src/components/shared/PublicNav.tsx
src/components/lgu/Sidebar.tsx


Known Limitations
IssueLocationFixisLoggedIn is hardcodedPublicNav.tsx, Sidebar.tsxReplace with useSession() from NextAuthNo route protectionAll /lgu/* and authenticated worker routesAdd Next.js middlewareWorker ID hardcoded to worker-001worker/success/page.tsx, worker/already-reviewed/page.tsxPass workerId through OTP flow via query params or sessionQR code is a placeholder iconworker/qr-code/page.tsxReplace with real QR image from GET /api/workers/me/qrLogout only redirects, does not clear sessionsrc/lib/logout.tsAdd POST /api/auth/logout callNo pagination on worker detail reviewslgu/workers/[id]/page.tsxAdd pagination once real data is connectedAnalytics uses CSS-only bar chartslgu/analytics/page.tsxOptionally replace with recharts for real dataEdit profile does not trigger pending statusworker/edit-profile/page.tsxBackend must set status = pending on PATCH

Next Steps — Backend
The frontend is complete and ready to connect. Recommended implementation order:
1. Database schema — PostgreSQL + Prisma

users table — LGU admins and workers with role field
workers table — profile data, status, QR code URL
reviews table — rating, comment, hashed phone, service date
otp_sessions table — phone, worker_id, code, expires_at

2. Auth — NextAuth.js with credentials provider

Role-based sessions for lgu_admin and worker
Middleware to protect /lgu/*, /worker/dashboard, /worker/qr-code, /worker/edit-profile

3. API Routes — Next.js app/api/ route handlers

Auth routes — register, login, logout, forgot password
Worker routes — profile CRUD, QR generation, status updates
OTP routes — send via Semaphore PH SMS, verify, resend, email fallback
Review routes — submit with duplicate phone number check
LGU routes — aggregated stats, worker list, analytics data

4. QR Code generation

Use qrcode npm package
Generate on worker approval by LGU admin
Store URL in workers table

5. SMS Integration

Semaphore for Philippine SMS OTP delivery
Fallback email OTP via Nodemailer


Contributing
Standard Git branching strategy:
main        Production-ready code
develop     Integration branch
feature/*   Individual feature branches
fix/*       Bug fix branches
When adding new pages:

Create the page file under src/app/
Add mock data at the top with // TODO: comments marking where API calls go
Use existing Tailwind classes and color tokens from globals.css
Add the route to the Pages and Routes section in this README
Add any new API endpoints to the Backend Integration Points section


Last updated: March 20, 2026 — Frontend phase complete, backend pending.
