"use client";

import React, { useState } from "react";
import { Form } from "@/types/form";
import ChatbotWidget from "@/components/chatbot/ChatbotWidget";
import CountUp from "@/components/common/CountUp";
import Link from "next/link";
import {
  ArrowRight,
  Code,
  Globe,
  CheckCircle2,
  Sliders,
  MessageSquare,
  Bot,
  BarChart3,
} from "lucide-react";

interface LandingClientProps {
  demoForm: Form;
}

export default function LandingClient({ demoForm }: LandingClientProps) {
  const [activeCodeTab, setActiveCodeTab] = useState<"script" | "react" | "iframe">(
    "script"
  );
  const [liveOrigin, setLiveOrigin] = useState("https://formpulse-woad.vercel.app");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLiveOrigin(window.location.origin);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="font-agbalumo text-2xl tracking-normal text-white group-hover:text-indigo-300 transition">
              FormPulse
            </span>
            <span className="text-[10px] font-sans font-semibold bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 px-2 py-0.5 rounded-full">
              Interactive
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-400 font-medium">
            <a href="#features" className="hover:text-white transition">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-white transition">
              How It Works
            </a>
            <a href="#demo" className="hover:text-white transition">
              Live Demo
            </a>
            <Link href="/embed-demo" className="hover:text-white transition">
              Embed Simulator
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition"
            >
              Dashboard
            </Link>
            <Link
              href="/builder"
              className="flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition active:scale-95"
            >
              Build a Form
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-8 border-b border-slate-900">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[250px] bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
          {/* Left: Headline & Actions */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-indigo-300 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span>Next-Generation Conversational Forms</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">3x Higher Completion</span>
            </div>

            <h1 className="font-agbalumo text-3xl sm:text-5xl lg:text-6xl text-white leading-[1.2] tracking-normal">
              Turn boring forms into{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                interactive chatbots
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Engage users with smooth, one-question-at-a-time conversations.
              Embed on any website with a single line of script and manage
              submissions through a real-time dashboard.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/builder"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 transition flex items-center justify-center gap-2 active:scale-98"
              >
                Create Your First Form
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/embed-demo"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-sm transition flex items-center justify-center gap-2"
              >
                <Code className="w-4 h-4 text-indigo-400" />
                Live Embed Simulator
              </Link>
            </div>

            {/* Social Proof badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 border-t border-slate-900">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero Coding Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>1-Line Script Embed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Export to CSV</span>
              </div>
            </div>
          </div>

          {/* Right: Live Interactive Chatbot Widget Demo right on Landing Page! */}
          <div className="lg:col-span-6 flex justify-center relative">
            <div className="w-full max-w-md relative">
              {/* Decorative Card glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-3xl blur-lg opacity-30 animate-pulse" />

              <div className="relative rounded-2xl shadow-2xl overflow-hidden border border-slate-800 bg-slate-950">
                <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="font-mono text-[11px] text-slate-300 ml-2">
                      Live Chatbot Demo
                    </span>
                  </div>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-medium">
                    Try answering below!
                  </span>
                </div>

                <div className="h-[540px]">
                  <ChatbotWidget
                    form={demoForm}
                    isPreview={true}
                    mode="card"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-12 border-b border-slate-900 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-white">
              <CountUp end={84.5} decimals={1} suffix="%" />
            </div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              Avg Completion Rate
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400">
              <CountUp end={3.2} decimals={1} suffix="x" />
            </div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              More Submissions
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400">
              <CountUp end={60} prefix="< " suffix="s" />
            </div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              Setup & Embed Time
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">
              <CountUp end={100} suffix="%" />
            </div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              Mobile Responsive
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-8 border-b border-slate-900 relative">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              Platform Features
            </span>
            <h2 className="font-agbalumo text-2xl sm:text-4xl text-white tracking-normal leading-snug">
              Everything you need for conversational data collection
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Say goodbye to intimidating long forms. FormPulse breaks queries
              into friendly, conversational questions that feel natural.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">
                Conversational UX
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Presents questions one by one with realistic typing indicators
                and celebratory confetti on completion to maximize respondent delight.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Code className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">
                1-Line Universal Embed
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Add a floating chatbot launcher to any WordPress, Webflow,
                Shopify, React or vanilla HTML website with a single &lt;script&gt; tag.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">
                Visual Form Builder
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Add text, validated email, multiple choice, and yes/no questions.
                Reorder effortlessly with drag-and-drop ease and live side-by-side preview.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">
                Brand Customization
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Personalize your bot name, avatar, primary brand accent color,
                custom welcome greeting, and thank-you celebration copy.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">
                Instant Submissions & CSV
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Inspect every submission timestamp and full conversational answer
                transcript. Export your entire dataset to CSV in one click.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">
                Desktop & Mobile Native
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Flawless responsive behavior: elegant full-screen drawer on mobile
                phones and compact floating widget on laptops and desktops.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4 sm:px-8 border-b border-slate-900 bg-slate-950/40">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              Simple 3-Step Workflow
            </span>
            <h2 className="font-agbalumo text-2xl sm:text-4xl text-white tracking-normal leading-snug">
              From idea to embedded chatbot in under 2 minutes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4 relative">
              <span className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                1
              </span>
              <h3 className="font-bold text-lg text-white">
                Create & Customize
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Add your questions (text, email, choices, yes/no). Choose your
                brand color and bot persona. See live updates in real time.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4 relative">
              <span className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                2
              </span>
              <h3 className="font-bold text-lg text-white">
                Embed or Share
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Copy your unique direct public link or embed code snippet.
                Paste the snippet into any website header or footer.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4 relative">
              <span className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                3
              </span>
              <h3 className="font-bold text-lg text-white">
                Collect & Analyze
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                View responses live in your dashboard. Inspect full answers,
                monitor completion rates, and export to CSV anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Embed Code Showcase */}
      <section className="py-24 px-4 sm:px-8 border-b border-slate-900">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              Developer-Friendly Integration
            </span>
            <h2 className="font-agbalumo text-2xl sm:text-3xl text-white tracking-normal leading-snug">
              Embed on any website with one line of code
            </h2>
          </div>

          <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
            <div className="flex border-b border-slate-800 px-6 pt-3 gap-3 bg-slate-950">
              <button
                onClick={() => setActiveCodeTab("script")}
                className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 ${
                  activeCodeTab === "script"
                    ? "border-indigo-500 text-indigo-400 bg-slate-900"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                Floating Script Tag (Recommended)
              </button>
              <button
                onClick={() => setActiveCodeTab("react")}
                className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 ${
                  activeCodeTab === "react"
                    ? "border-indigo-500 text-indigo-400 bg-slate-900"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                Next.js / React
              </button>
              <button
                onClick={() => setActiveCodeTab("iframe")}
                className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 ${
                  activeCodeTab === "iframe"
                    ? "border-indigo-500 text-indigo-400 bg-slate-900"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                Inline Iframe
              </button>
            </div>

            <div className="p-6">
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-indigo-300 leading-relaxed overflow-x-auto">
                {activeCodeTab === "script" &&
                  `<!-- Add to your index.html or WordPress / Webflow footer -->
<script
  src="${liveOrigin}/embed.js"
  data-form-id="fp_customer_feedback"
  data-color="#4f46e5"
  defer
></script>`}
                {activeCodeTab === "react" &&
                  `// In your Next.js app/layout.tsx or React App
import Script from "next/script";

export default function Layout({ children }) {
  return (
    <>
      {children}
      <Script
        src="${liveOrigin}/embed.js"
        data-form-id="fp_customer_feedback"
        strategy="lazyOnload"
      />
    </>
  );
}`}
                {activeCodeTab === "iframe" &&
                  `<!-- Embed inline anywhere inside your page container -->
<iframe
  src="${liveOrigin}/embed/fp_customer_feedback"
  width="100%"
  height="600px"
  frameborder="0"
  style="border-radius: 16px; border: 1px solid #1e293b;"
></iframe>`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="py-20 px-4 sm:px-8 bg-gradient-to-b from-slate-950 via-indigo-950/40 to-slate-950">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="font-agbalumo text-3xl sm:text-4xl text-white tracking-normal leading-snug">
            Ready to upgrade from static forms?
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Build conversational chatbot forms that users actually enjoy filling out.
            Start now without writing a single line of backend code.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/builder"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 transition flex items-center justify-center gap-2"
            >
              Get Started for Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-sm transition"
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-12 px-4 sm:px-8 bg-slate-950 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-agbalumo text-xl tracking-normal text-white">FormPulse</span>
            <span className="text-slate-600">© 2026 FormPulse. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-white transition">
              Dashboard
            </Link>
            <Link href="/builder" className="hover:text-white transition">
              Form Builder
            </Link>
            <Link href="/embed-demo" className="hover:text-white transition">
              Embed Simulator
            </Link>
            <a
              href="https://github.com/lizansarkar/formpulse"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition flex items-center gap-1.5"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
