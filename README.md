# 🏥 DocHome — Patient Enquiry & Notification System

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E?style=flat-square&logo=supabase)
![PWA](https://img.shields.io/badge/PWA-Installable-5A0FC8?style=flat-square)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel)

> A **production-grade, premium mini-CRM** for DocHome. Features a beautiful, mobile-first public enquiry form that instantly notifies the healthcare team via WhatsApp, paired with a powerful, real-time admin dashboard for seamless patient management.

---

## ✨ Key Features

### 👨‍⚕️ Patient Experience (Public Form)
- **Premium UI/UX:** Glassmorphism design, staggered entrance animations, and fully responsive mobile-first layout.
- **PWA Ready:** Fully installable as a native-like app on iOS and Android with a smart, non-intrusive "Install App" prompt.
- **Robust Validation:** Real-time form validation with clear, accessible error messages.
- **Instant Feedback:** Beautiful success screen with personalized confirmation.

### 🚀 Admin Dashboard (Team Portal)
- **Real-time Analytics:** Visual 7-day activity bar chart (timezone-proof) + 5-key metric stat cards (Total, New, Contacted, Converted, Not Interested).
- **Immersive Side Drawer:** Click any row to open a detailed side panel with patient info, status timeline, and quick Call/WhatsApp actions.
- **Smart Search & Filters:** Instantly filter by status or search across Name, Phone, City, and Specialty.
- **One-Click CSV Export:** Bulletproof, Excel-compatible CSV export of filtered data (handles commas, quotes, and phone number formatting perfectly).
- **Live Updates:** Supabase Realtime ensures the dashboard updates instantly across all open tabs when a new enquiry arrives or status changes.

### ⚙️ Technical Excellence
- **Fail-Safe WhatsApp Integration:** Enquiries are saved to the database *first*. WhatsApp notifications are fired asynchronously, ensuring zero data loss even if the API fails.
- **Secure Auth:** Role-based access to `/admin` via Supabase Auth with protected routes.
- **Optimized Performance:** Code-splitting, lazy loading, and optimized asset delivery via Vite.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite, TypeScript, Tailwind CSS |
| **Routing & State** | React Router, React Hooks (`useState`, `useMemo`, `useRef`) |
| **Backend & DB** | Supabase (PostgreSQL, Auth, Realtime) |
| **Notifications** | WhatsApp Cloud API (Meta) via Vercel Serverless Functions |
| **PWA** | Custom Service Worker (`sw.js`), Web App Manifest |
| **Hosting** | Vercel (Frontend + Serverless API) |

---

## 📂 Project Structure

```text
dochome/
├── api/
│   └── send-whatsapp.ts          # Vercel serverless function → WhatsApp Cloud API
├── public/
│   ├── icons/
│   │   ├── icon-192.png          # PWA Icon
│   │   └── icon-512.png          # PWA Icon
│   ├── manifest.json             # PWA Configuration
│   └── sw.js                     # Service Worker for offline/install support
├── src/
│   ├── components/
│   │   ├── EnquiryDrawer.tsx     # Premium side-panel for enquiry details
│   │   ├── EnquiryTable.tsx      # Responsive table (desktop) & cards (mobile)
│   │   ├── InstallAppButton.tsx  # Smart PWA install prompt (iOS/Android)
│   │   ├── LoadingSkeleton.tsx   # Premium loading state
│   │   ├── ProtectedRoute.tsx    # Auth guard for admin routes
│   │   ├── SplashScreen.tsx      # Animated app launch screen
│   │   ├── StatsBar.tsx          # Analytics cards + 7-day bar chart
│   │   ├── StatusBadge.tsx       # Color-coded status pills
│   │   └── WelcomeScreen.tsx     # First-time user onboarding
│   ├── lib/
│   │   ├── supabase.ts           # Supabase client initialization & types
│   │   └── validation.ts         # Zod-like form validation helpers
│   ├── pages/
│   │   ├── AdminDashboard.tsx    # Main admin hub with search, filters, export
│   │   ├── AdminLogin.tsx        # Secure team login page
│   │   └── Home.tsx              # Public patient enquiry form
│   ├── App.tsx                   # Main routing and layout composition
│   ├── main.tsx                  # Entry point + Service Worker registration
│   └── index.css                 # Global styles & Tailwind directives
├── supabase/
│   └── schema.sql                # Database schema and RLS policies
├── .env.example                  # Environment variable template
├── index.html                    # HTML shell with PWA meta tags
├── package.json
├── tailwind.config.js            # Tailwind configuration (custom brand colors)
└── vercel.json                   # Vercel deployment config
```

---

## 🚀 Setup & Installation

### 1. Clone & Install
```bash
git clone https://github.com/avneeshkum/dochome.git
cd dochome
yarn install
```

### 2. Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** → paste the contents of `supabase/schema.sql` → **Run**.
3. Go to **Authentication → Users** → Add a user (email + password) for admin access.
4. Go to **Project Settings → API** and copy:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` → `VITE_SUPABASE_ANON_KEY`

### 3. WhatsApp Cloud API Setup (Meta)
1. Create an app at [developers.facebook.com](https://developers.facebook.com) and add the **WhatsApp** product.
2. In **WhatsApp → API Setup**, get your **Phone Number ID** and a **Temporary Access Token**.
3. Add your personal number as a **Test Recipient** and verify via OTP.
4. Set these in your environment:
   - `WHATSAPP_PHONE_NUMBER_ID`
   - `WHATSAPP_ACCESS_TOKEN`
   - `WHATSAPP_TEAM_NUMBERS` (Comma-separated, e.g., `919876543210`)

### 4. Local Development
```bash
cp .env.example .env
# Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env
yarn dev
```
- Public Form: `http://localhost:5173`
- Admin Login: `http://localhost:5173/admin/login`

> 💡 **Note:** To test the WhatsApp API locally, use `vercel dev` instead of `yarn dev`, as serverless functions require the Vercel environment.

---

## 🌐 Deployment (Vercel)

1. Push your code to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Go to **Project Settings → Environment Variables** and add all 5 variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `WHATSAPP_PHONE_NUMBER_ID`
   - `WHATSAPP_ACCESS_TOKEN`
   - `WHATSAPP_TEAM_NUMBERS`
4. Click **Deploy**.

---

## ✅ Assignment Checkpoints Met

- [x] **Phase 1:** Form submission creates a `New` enquiry in Supabase.
- [x] **Phase 2:** Instant WhatsApp notification triggered via Cloud API.
- [x] **Phase 3:** Admin dashboard with filtering, searching, and 1-click status updates.
- [x] **Phase 4:** Fail-safe architecture (DB save precedes API call), mobile-first PWA design, and real-time dashboard counters.
- [x] **Bonus:** Premium UI, 7-day analytics graph, side-drawer details, and 1-click CSV export.

---

## ⚠️ Known Limitations (Out of Scope)
- **WhatsApp Sandbox:** Free-form messages can only be sent to verified test numbers within a 24-hour window. Production requires Meta Business Verification.
- **Admin Roles:** Currently uses a single shared admin login. Per-user RBAC is out of scope.
- **Fallbacks:** No SMS/Email fallback if WhatsApp fails (errors are safely logged).

---

*Built with ❤️ and precision by Avneesh*
