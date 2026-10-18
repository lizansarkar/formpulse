# FormPulse — Interactive Form Builder with Chatbot Widget

[![Next.js](https://img.shields.io/badge/Next.js-16.4.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-blue?style=flat&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4.1-2d3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?style=flat&logo=supabase)](https://supabase.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-3.5_Flash_Lite-4285f4?style=flat&logo=google)](https://ai.google.dev/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat&logo=vercel)](https://vercel.com/)

> **Software Engineer Deliverable**  
> Build conversational chatbot forms, embed a floating widget on any external website, collect structured responses in real time, and manage submissions through an analytics dashboard.

---

## 🌐 Live URLs & Quick Links

- **GitHub Repository**: [https://github.com/lizansarkar/formpulse](https://github.com/lizansarkar/formpulse)
- **Live Embed Simulator**: [http://localhost:3000/embed-demo](http://localhost:3000/embed-demo) (or your Vercel deployment URL `/embed-demo`)
- **Visual Form Builder**: [http://localhost:3000/builder](http://localhost:3000/builder)
- **Responses Dashboard**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- **Live Database Status**: [http://localhost:3000/api/db-status](http://localhost:3000/api/db-status)
- **Submission PDF Report**: [`FormPulse_Project_Submission_Report.pdf`](./FormPulse_Project_Submission_Report.pdf)

---

## 🌟 Overview & Key Features

FormPulse transforms traditional, static, drop-off prone forms into engaging, conversational chatbot experiences. Instead of overwhelming respondents with long walls of input fields, FormPulse guides users through a friendly, one-question-at-a-time conversation that delivers **up to 3x higher completion rates**.

### 1. 🚀 High-Converting Landing Page
- **Agbalumo Branding**: Clean typography and aesthetic dark/light glassmorphic UI.
- **Hero Live Demo Widget**: Functional conversational widget running directly in the hero section so visitors can test the experience instantly.
- **Animated Performance Metrics**: Cubic-eased counters highlighting key conversion metrics (84.5% completion, 3.2x engagement, < 60s setup).
- **Integration Showcase**: Ready-to-copy code snippets for HTML, Webflow, WordPress, and React.

### 2. 🛠️ Visual Form Builder (`/builder`)
- **Multi-Question Types**:
  - `Text`: Short and long-form responses.
  - `Email`: Real-time email syntax regex validation.
  - `Multiple Choice`: Custom choice chips with dynamic addition and deletion.
  - `Yes / No`: High-converting binary decision buttons.
- **Form Controls**: Question reordering (Move Up / Move Down), required/optional toggles, custom placeholders.
- **Bot Persona & Theme**: Custom Bot Name, Avatar emoji selector, Brand Accent Color picker with presets and hex picker, and custom welcome/completion copy.
- **Real-Time Side-by-Side Preview**: Live testing of the conversational flow directly as the form is constructed.

### 3. 💬 Embeddable Floating Chatbot Widget (`public/embed.js`)
- **1-Line Script Embed**: Works on any external website via:
  ```html
  <script
    src="https://your-domain.com/embed.js"
    data-form-id="YOUR_FORM_ID"
    data-color="#4f46e5"
    defer
  ></script>
  ```
- **Cross-Origin Sandbox**: Secure `postMessage` protocol between parent window and isolated iframe (`/embed/[id]`).
- **Interactive Embed Simulator (`/embed-demo`)**: Demonstrates the floating widget on a simulated enterprise SaaS website (Acme Cloud Systems).
- **Desktop & Mobile Responsive**: Responsive full drawer on mobile viewports and floating card on desktops.
- **Celebration Effects**: Confetti bursts (`canvas-confetti`) upon completion.

### 4. 🧠 Google Gemini Conversational AI Concierge (`/api/ai/chat`)
- **Model**: Powered by Google's `gemini-3.5-flash-lite`.
- **Contextual Reflection**: Provides a natural, warm acknowledgment sentence after each response before smoothly advancing to the next question.
- **Sub-Second Latency**: Built with an intelligent client-side timeout fallback ensuring the form never delays or blocks respondents.
- **AI Indicator**: Displays a glowing `Gemini AI Concierge` badge in the chatbot header.

### 5. 📊 User Dashboard & Responses Analytics (`/dashboard`)
- **Real-Time KPIs**: Total Forms, Total Submissions, Active Widgets, and Completion Rates.
- **Submission Table**: View all responses per form, filter by date, inspect full question-and-answer transcripts, and view user-agent metadata.
- **1-Click CSV Export**: Download responses formatted for Excel, Google Sheets, or CRM imports.
- **Form Management**: Instant publish/unpublish toggle, edit, copy embed snippet, and delete.

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       FormPulse Platform Architecture                       │
└─────────────────────────────────────────────────────────────────────────────┘
  [ External Websites (WordPress, Webflow, Shopify, HTML) ]
         │
         │  1-line Script: <script src=".../embed.js" data-form-id="...">
         ▼
  [ Cross-Origin Sandboxed Iframe (/embed/[id]) ]
         │
         │  postMessage Protocol (Open, Close, Height Sync, State)
         ▼
  [ Conversational Chatbot Widget Engine ]
         ├─ Question Flow (Text, Email, Multiple Choice, Yes/No)
         ├─ Google Gemini AI Concierge (/api/ai/chat) (gemini-3.5-flash-lite)
         └─ Client-side Validation (Email regex, Required checks)
         │
         ▼
  [ Next.js 16 App Router Backend (Turbopack + Partial Prerendering) ]
         ├─ /api/forms & /api/forms/[id] (Form CRUD & Persona Config)
         ├─ /api/forms/[id]/submissions (Response Ingestion)
         ├─ /api/stats (Live Dashboard KPI Aggregation)
         └─ /api/db-status (PostgreSQL Health Monitor)
         │
         ▼
  [ Prisma ORM 6.4.1 (Dual-Engine Resilient Client) ]
         ├─ Live Engine: Supabase PostgreSQL (IPv4 Pooler aws-0-ap-south-1)
         └─ Fallback Engine: High-performance Persistent Local JSON Store
```

---

## 🗄️ Database Schema & Live Supabase Sync

FormPulse connects directly to **Supabase PostgreSQL** via Prisma 6.4.1.

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-3.0.x"]
}

model Form {
  id                String       @id @default(uuid())
  slug              String       @unique
  title             String
  description       String?
  isPublished       Boolean      @default(true)
  botName           String       @default("PulseBot")
  botAvatar         String       @default("🤖")
  welcomeMessage    String       @default("Hi there! 👋 Welcome. Let's get started.")
  completionMessage String       @default("Thank you! Your response has been recorded.")
  primaryColor      String       @default("#6366f1")
  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt
  questions         Question[]
  submissions       Submission[]
}

model Question {
  id          String   @id @default(uuid())
  formId      String
  form        Form     @relation(fields: [formId], references: [id], onDelete: Cascade)
  type        String   // text, email, multiple_choice, yes_no
  title       String
  placeholder String?
  required    Boolean  @default(true)
  options     String?  // JSON string array for choices
  order       Int      @default(0)
  createdAt   DateTime @default(now())
}

model Submission {
  id        String   @id @default(uuid())
  formId    String
  form      Form     @relation(fields: [formId], references: [id], onDelete: Cascade)
  answers   String   // JSON string of user answers { [questionId]: value }
  metadata  String?  // JSON string of userAgent, timestamps
  createdAt DateTime @default(now())
}
```

### Verify Database Connection:
Call `/api/db-status`:
```json
{
  "status": "connected",
  "databaseConfigured": true,
  "provider": "postgresql (Supabase)",
  "counts": {
    "forms": 2,
    "submissions": 0
  },
  "message": "Successfully connected to PostgreSQL database via Prisma."
}
```

---

## 🚀 Vercel Deployment Guide

Deploying FormPulse to Vercel takes under 2 minutes:

### 1. Import Repository
1. Go to **[vercel.com/new](https://vercel.com/new)**.
2. Sign in with GitHub and select repository **`lizansarkar/formpulse`**.

### 2. Configure Environment Variables
Add the following 4 environment variables under **Project Settings > Environment Variables**:

| Variable Name | Value | Purpose |
|---|---|---|
| `DATABASE_URL` | `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres` | Supabase IPv4 Pooler |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://[PROJECT-REF].supabase.co` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `[YOUR-SUPABASE-ANON-KEY]` | Supabase Public Key |
| `GEMINI_API_KEY` | `[YOUR-GOOGLE-GEMINI-API-KEY]` | Google Gemini AI Key |

### 3. Deploy
Click **Deploy**. Vercel will automatically run `npm run vercel-build` (`prisma generate && next build`) and produce your live URL.

---

## 📡 API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/forms` | `GET` | List all forms with live submission counts |
| `/api/forms` | `POST` | Create a new conversational form |
| `/api/forms/[id]` | `GET` | Retrieve single form by ID or slug |
| `/api/forms/[id]` | `PUT` | Update questions, theme, persona, or metadata |
| `/api/forms/[id]` | `DELETE` | Cascade delete form and all responses |
| `/api/forms/[id]/publish` | `POST` | Toggle publish / draft status |
| `/api/forms/[id]/submissions` | `GET` | Retrieve all submissions for a form |
| `/api/forms/[id]/submissions` | `POST` | Ingest answers submitted via chatbot widget |
| `/api/submissions/[id]` | `DELETE` | Delete individual submission |
| `/api/stats` | `GET` | Real-time dashboard KPI metrics |
| `/api/ai/chat` | `POST` | Google Gemini AI conversational concierge reaction |
| `/api/db-status` | `GET` | Health check for PostgreSQL connection & counts |

---

## 📦 Submission Deliverables

The project deliverables package includes:
1. **Executive Presentation Report**: [`FormPulse_Project_Submission_Report.pdf`](./FormPulse_Project_Submission_Report.pdf) (1.8 MB PDF covering architecture, features, database proof, and test results).
2. **High-Resolution Screenshots**: Saved in [`deliverables/screenshots/`](./deliverables/screenshots/):
   - `01_Landing_Page.png`
   - `02_Form_Builder.png`
   - `03_Embed_Simulator.png`
   - `04_Gemini_AI_Chatbot.png`
   - `05_Responses_Dashboard.png`
3. **Submission ZIP Archive**: `FormPulse_Submission_Deliverables.zip` (clean source code + PDF report + screenshots, under 15 MB).

---

## 💻 Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/lizansarkar/formpulse.git
cd formpulse

# 2. Install dependencies
npm install

# 3. Configure environment variables in .env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-SUPABASE-ANON-KEY]"
GEMINI_API_KEY="[YOUR-GOOGLE-GEMINI-API-KEY]"

# 4. Sync Prisma Schema to Supabase
npx prisma db push

# 5. Start dev server
npm run dev

# 6. Verify production build
npm run build
```

---

## 📄 License
MIT License. Built for the Software Engineer Intern Project.
