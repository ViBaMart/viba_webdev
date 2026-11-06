# ViBa WebDevloper Platform

> **Official Domain:** [vibawebdev.com](https://vibawebdev.com)  
> **Brand Name:** ViBa WebDevloper  
> **Positioning:** High-performance web development agency specializing in Next.js, TypeScript, Tailwind CSS, Firebase cloud data services, and scalable multi-tenant SaaS architecture.

---

## 🚀 Technology Stack

- **Framework:** Next.js (App Router with SSR & Server Actions)
- **Language:** TypeScript 5.x (Strict type safety)
- **Styling:** Tailwind CSS (Light professional agency theme)
- **Database & Cloud:** Firebase Firestore & Firebase Admin SDK
- **Backend:** REST API Route Handlers under `/api`
- **Icons & UI:** Lucide React & Reusable UI Primitives
- **Deployment:** Vercel Edge Network
- **CI/CD:** GitHub Actions (`.github/workflows/ci.yml`)

---

## 🏛 Clean Folder Structure

```
viba-webdev/
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions CI build & verification
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── health/
│   │   │   │   └── route.ts   # System diagnostics & Firebase readiness
│   │   │   ├── inquiries/
│   │   │   │   └── route.ts   # Contact & consultation REST endpoint
│   │   │   ├── customers/
│   │   │   │   └── route.ts   # Multi-tenant customer provisioning
│   │   │   ├── services/
│   │   │   │   └── route.ts   # Agency service catalog endpoint
│   │   │   └── projects/
│   │   │       └── route.ts   # Case studies & portfolio API
│   │   ├── globals.css        # Light professional theme definitions
│   │   ├── layout.tsx         # Root layout with SEO metadata & navigation
│   │   ├── page.tsx           # ViBa WebDevloper landing platform
│   │   └── not-found.tsx      # Branded 404 handler
│   ├── components/
│   │   ├── common/            # Reusable UI primitives (Button, Input, Textarea, Badge, Card)
│   │   ├── layout/            # Layout components (Navbar, Footer)
│   │   └── sections/          # Modular page sections (Hero, Stats, Services, MultiTenant, etc.)
│   ├── config/
│   │   ├── agency.ts          # ViBa WebDevloper brand constants & service specs
│   │   └── env.ts             # Secure typed environment variable validation
│   ├── lib/
│   │   ├── firebase/          # Client & Admin Firebase SDK initializers
│   │   │   ├── admin.ts       # Server-side Firebase Admin with service credentials
│   │   │   ├── client.ts      # Browser-safe Firebase client app
│   │   │   └── config.ts      # Client configuration loader
│   │   └── utils.ts           # Classnames and utility helpers
│   ├── services/              # Decoupled database & business logic layer
│   │   ├── agencyService.ts   # Platform overview & health diagnostics
│   │   ├── customerService.ts # Multi-tenant customer isolation & settings
│   │   ├── inquiryService.ts  # Consultation inquiry persistence & validation
│   │   └── projectService.ts  # Showcase case studies data queries
│   └── types/                 # TypeScript entity definitions & DTOs
│       ├── agency.ts
│       ├── customer.ts
│       ├── inquiry.ts
│       └── project.ts
├── .env.example               # Complete environment variable template
├── .env.local                 # Local environment template
├── .gitignore                 # Secure Git exclusion rules
├── package.json               # Dependencies and build scripts
├── tsconfig.json              # TypeScript compilation configuration
└── vercel.json                # Vercel deployment headers & security rules
```

---

## 🔒 Separation of Concerns

1. **Frontend Presentation:** React components with modern Tailwind CSS light styling, mobile-responsive layout, client-side validation, and instant UX.
2. **REST API Handlers:** Next.js route handlers under `/api/*` validating incoming payloads with structured HTTP status codes (`200`, `201`, `400`, `500`, `503`).
3. **Database Services:** Dedicated service layer (`src/services/`) interacting with Firebase Firestore via the Firebase Admin SDK. If database credentials are not configured, the API cleanly returns a typed `503 Service Unavailable` response with diagnostic instructions rather than simulated success messages.

---

## 👥 Scalable Multi-Tenant Architecture

ViBa WebDevloper is designed to scale across multiple client organizations:
- **Tenant ID Partitioning:** Inquiries and customer entities store a unique `tenantId` to ensure logical data isolation.
- **Custom Domain Routing:** Customer records support custom domain mapping (`tenant.vibawebdev.com` or custom apex domains).
- **Tier-Based Provisioning:** Starter, Growth, and Enterprise tiers with configurable project limits and feature flags.

---

## 🛠 Local Development Setup

### 1. Clone & Install Dependencies
```bash
git clone <your-github-repo-url>
cd viba-webdev
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Supply your Firebase credentials:
```env
NEXT_PUBLIC_APP_NAME="ViBa WebDevloper"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

FIREBASE_PROJECT_ID="your-firebase-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the platform.

### 4. Verify API Endpoints
- **Health & Diagnostics:** [http://localhost:3000/api/health](http://localhost:3000/api/health)
- **Services Catalog:** [http://localhost:3000/api/services](http://localhost:3000/api/services)
- **Projects Showcase:** [http://localhost:3000/api/projects](http://localhost:3000/api/projects)

---

## 🌐 Deploy to Vercel

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: initial ViBa WebDevloper agency platform setup"
   git remote add origin <your-github-repo-url>
   git branch -M main
   git push -u origin main
   ```
2. Import the project into **[Vercel](https://vercel.com/new)**.
3. In the Vercel Project Settings, add the environment variables defined in `.env.example`.
4. Add the custom domain `vibawebdev.com` under **Project Settings > Domains**.
5. Deploy! Vercel automatically deploys with edge caching, automated SSL, and security headers configured in `vercel.json`.
