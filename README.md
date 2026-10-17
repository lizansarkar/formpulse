# FormPulse — Interactive Form Builder with Chatbot Widget

> **Software Engineer Intern Project**  
> Build interactive conversational forms, embed a floating chatbot widget on any website, collect responses in real time, and manage submissions through an analytics dashboard.

---

## 🌟 Overview & Key Features

FormPulse transforms traditional, static, drop-off prone forms into engaging, conversational chatbot experiences. Instead of overwhelming respondents with long walls of input fields, FormPulse guides users through a friendly, one-question-at-a-time conversation that delivers **up to 3x higher completion rates**.

### 1. 🚀 High-Converting Landing Page
- **Hero Section**: Clear value proposition, conversion statistics, and direct call-to-actions.
- **Live Interactive Demo**: Real-time conversational chatbot widget running right in the hero section so visitors can test the experience immediately.
- **Features & How It Works**: 3-step breakdown from form creation to external embed and response analytics.
- **Integration Showcase**: Ready-to-copy code snippets for HTML, React/Next.js, and iframe embeds.

### 2. 📊 User Dashboard & Analytics
- **Overview KPIs**: Total Forms, Total Submissions, Active/Published Widgets, and Average Completion Rate.
- **Instant Template Presets**: 1-click generation of Customer Feedback, Lead Qualification, Product Waitlist, or Blank Forms.
- **Form Management**: Publish/Unpublish toggle, direct live links, quick edit, and deletion.
- **Responses & CSV Export**: Dedicated submissions table per form with expandable inspection modals showing the full conversation transcript, timestamps, user-agent metadata, and 1-click **Export to CSV**.

### 3. 🛠️ Visual Form Builder
- **Multi-Format Questions**:
  - `Text`: Short and long-form responses.
  - `Email`: Real-time email syntax validation.
  - `Multiple Choice`: Customizable options with add/remove/reorder controls.
  - `Yes / No`: High-converting binary choice buttons.
- **Custom Question Controls**: Reorder questions (Move Up / Move Down), toggle Required status, customize placeholders.
- **Bot Persona & Theme**: Custom Bot Name, Avatar (emoji/icon selector), Brand Accent Color picker (with presets and custom hex support), and conversational welcome/completion copy.
- **Live Side-by-Side Preview**: Tests the conversational flow in real-time as you construct the form.

### 4. 💬 Embeddable Floating Chatbot Widget
- **1-Line Script Embed**: Works on any external website (WordPress, Webflow, Shopify, custom HTML, Next.js, etc.) via:
  ```html
  <script
    src="https://your-domain.com/embed.js"
    data-form-id="YOUR_FORM_ID"
    data-color="#4f46e5"
    defer
  ></script>
  ```
- **Cross-Origin Sandbox**: Secure `postMessage` protocol between parent window and isolated iframe.
- **Interactive Embed Simulator**: Dedicated playground (`/embed-demo`) demonstrating the floating widget on a simulated client website.
- **Desktop & Mobile Optimized**: Responsive drawer on mobile viewports and floating card on desktop screens.
- **Celebration Effects**: Confetti bursts (`canvas-confetti`) upon submission completion.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router with Partial Prerendering & Cache Components)
- **UI & Components**: React 19, Tailwind CSS v4, Lucide React Icons
- **Animation & Effects**: Canvas Confetti
- **ORM & Database**: Prisma (PostgreSQL schema configured) with fallback resilient local JSON data engine for zero-config offline/demo portability
- **Validation**: Schema-level validation and email regex checking

---

## 📁 Project Architecture

```
formpulse/
├── data/
│   └── formpulse.json          # Persistent local storage & seed data
├── prisma/
│   └── schema.prisma           # Prisma PostgreSQL schema
├── public/
│   └── embed.js                # Universal floating chatbot script loader
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── forms/          # Form CRUD & publish endpoints
│   │   │   ├── stats/          # Dashboard KPI statistics
│   │   │   └── submissions/    # Response submission & deletion
│   │   ├── builder/            # Visual Form Builder page (/builder & /builder/[id])
│   │   ├── dashboard/          # Analytics dashboard & responses table
│   │   ├── embed/              # Dedicated iframe embed route (/embed/[id])
│   │   ├── embed-demo/         # External website simulation playground
│   │   ├── f/[id]/             # Standalone public form route
│   │   ├── globals.css         # Tailwind CSS styling
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Modern landing page
│   ├── components/
│   │   ├── builder/            # FormBuilder editor & live preview
│   │   ├── chatbot/            # ChatbotWidget conversational engine
│   │   ├── dashboard/          # DashboardClient, ResponsesClient, ShareEmbedModal
│   │   ├── embed/              # EmbedDemoClient simulation UI
│   │   └── landing/            # LandingClient homepage showcase
│   └── types/
│       └── form.ts             # TypeScript domain definitions
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.18+ or 20+
- npm, pnpm, or yarn

### 2. Installation
```bash
git clone https://github.com/lizansarkar/formpulse.git
cd formpulse
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to explore:
- **Landing Page**: [http://localhost:3000/](http://localhost:3000/)
- **User Dashboard**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- **Form Builder**: [http://localhost:3000/builder](http://localhost:3000/builder)
- **Embed Simulator**: [http://localhost:3000/embed-demo](http://localhost:3000/embed-demo)
- **Public Form**: [http://localhost:3000/f/customer-feedback](http://localhost:3000/f/customer-feedback)

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 📡 API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/forms` | `GET` | List all forms with submission counts |
| `/api/forms` | `POST` | Create a new conversational form |
| `/api/forms/[id]` | `GET` | Retrieve single form by ID or slug |
| `/api/forms/[id]` | `PUT` | Update form questions, theme, or metadata |
| `/api/forms/[id]` | `DELETE` | Delete form and all associated responses |
| `/api/forms/[id]/publish` | `POST` | Toggle publish / draft status |
| `/api/forms/[id]/submissions` | `GET` | Retrieve all submissions for a form |
| `/api/forms/[id]/submissions` | `POST` | Submit answers from chatbot widget |
| `/api/submissions/[id]` | `DELETE` | Delete an individual submission |
| `/api/stats` | `GET` | Dashboard KPI metrics |

---

## 💻 Website Embed Guide

### Option A: Floating Chatbot Widget (Recommended)
Add this snippet before the `</body>` tag of any HTML or CMS page:
```html
<script
  src="https://your-domain.com/embed.js"
  data-form-id="YOUR_FORM_ID"
  data-color="#4f46e5"
  defer
></script>
```

### Option B: Inline Iframe Embed
Embed the form directly into your page content:
```html
<iframe
  src="https://your-domain.com/embed/YOUR_FORM_ID"
  width="100%"
  height="620px"
  frameborder="0"
  style="border-radius: 16px; border: 1px solid #e2e8f0;"
></iframe>
```

---

## 📄 License
MIT License. Built with ❤️ for the FormPulse Software Engineer Intern Project.
