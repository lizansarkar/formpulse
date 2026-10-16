"use client";

import React, { useState, useEffect } from "react";
import { Form } from "@/types/form";
import Link from "next/link";
import {
  Code,
  Check,
  ExternalLink,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Globe,
  Sparkles,
} from "lucide-react";

interface EmbedDemoClientProps {
  currentForm: Form;
  allForms: Form[];
}

export default function EmbedDemoClient({
  currentForm,
  allForms,
}: EmbedDemoClientProps) {
  const [copied, setCopied] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const embedCode = `<script\n  src="${baseUrl || "https://formpulse.app"}/embed.js"\n  data-form-id="${currentForm.id}"\n  data-color="${currentForm.theme.primaryColor}"\n  defer\n></script>`;

  const copyCode = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Inject the embed script into this demo page
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Remove existing if any
    const existingScript = document.getElementById("formpulse-demo-script");
    if (existingScript) existingScript.remove();
    const existingWidget = document.getElementById("formpulse-root");
    if (existingWidget) existingWidget.remove();
    const existingStyle = document.getElementById("formpulse-widget-styles");
    if (existingStyle) existingStyle.remove();
    const existingFrames = document.querySelectorAll(".fp-widget-frame-wrapper");
    existingFrames.forEach((el) => el.remove());

    (window as any).__FORMPULSE_INITIALIZED__ = false;

    const script = document.createElement("script");
    script.id = "formpulse-demo-script";
    script.src = "/embed.js";
    script.setAttribute("data-form-id", currentForm.id);
    script.setAttribute("data-color", currentForm.theme.primaryColor);
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
      const root = document.getElementById("formpulse-root");
      if (root) root.remove();
      const style = document.getElementById("formpulse-widget-styles");
      if (style) style.remove();
      const frames = document.querySelectorAll(".fp-widget-frame-wrapper");
      frames.forEach((el) => el.remove());
      (window as any).__FORMPULSE_INITIALIZED__ = false;
    };
  }, [currentForm.id, currentForm.theme.primaryColor]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Test Control Toolbar */}
      <div className="sticky top-0 z-50 bg-indigo-950/90 border-b border-indigo-800/60 backdrop-blur-md px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Live Embed Simulator
          </span>
          <span className="text-xs text-indigo-200 hidden sm:inline">
            Testing form: <strong className="text-white">{currentForm.title}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Select another form */}
          <select
            value={currentForm.id}
            onChange={(e) => {
              window.location.href = `/embed-demo/${e.target.value}`;
            }}
            className="px-2.5 py-1.5 rounded-lg bg-indigo-900/60 border border-indigo-700 text-xs text-indigo-100 focus:outline-none"
          >
            {allForms.map((f) => (
              <option key={f.id} value={f.id} className="bg-slate-900 text-white">
                {f.title} ({f.isPublished ? "Active" : "Draft"})
              </option>
            ))}
          </select>

          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                Copied Snippet!
              </>
            ) : (
              <>
                <Code className="w-3.5 h-3.5" />
                Copy Embed Script
              </>
            )}
          </button>

          <Link
            href={`/f/${currentForm.slug || currentForm.id}`}
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Standalone Link
          </Link>

          <Link
            href="/dashboard"
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            ← Dashboard
          </Link>
        </div>
      </div>

      {/* Floating Widget Callout Notice */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border-b border-amber-500/30 px-4 py-2.5 text-center text-xs text-amber-200 flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong>Notice the floating widget in the bottom-right corner!</strong> Click the button to launch the embedded conversational chatbot.
        </span>
      </div>

      {/* Mock Client Website Content */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 w-full space-y-20">
        {/* Mock Nav */}
        <nav className="flex items-center justify-between py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-md">
              A
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              Acme Cloud Systems
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm text-slate-400 font-medium">
            <span className="hover:text-white cursor-pointer transition">Products</span>
            <span className="hover:text-white cursor-pointer transition">Solutions</span>
            <span className="hover:text-white cursor-pointer transition">Enterprise</span>
            <span className="hover:text-white cursor-pointer transition">Pricing</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:inline">Sign In</span>
            <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-sm transition">
              Get Started
            </button>
          </div>
        </nav>

        {/* Mock Hero */}
        <div className="text-center space-y-6 max-w-3xl mx-auto pt-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            Next-Gen Multi-Cloud Orchestration
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Build and scale cloud systems with{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              zero friction
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Acme provides real-time serverless telemetry and automated scaling across 32 global edge regions with 99.999% SLA.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2">
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const btn = document.querySelector(".fp-widget-button") as HTMLElement;
                if (btn) btn.click();
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition flex items-center justify-center gap-2"
            >
              💬 Trigger Chat Widget
            </button>
          </div>
        </div>

        {/* Embed Instructions Box */}
        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                How to embed this widget into any external website
              </h3>
              <p className="text-xs text-slate-400">
                Copy and paste this script snippet before the closing &lt;/body&gt; tag of your HTML or Webflow/WordPress site.
              </p>
            </div>
          </div>

          <div className="relative">
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-indigo-300 font-mono overflow-x-auto leading-relaxed">
              {embedCode}
            </pre>
            <button
              onClick={copyCode}
              className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Code className="w-3.5 h-3.5" />
                  Copy Snippet
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-semibold text-xs text-white">Cross-Origin Ready</h5>
                <p className="text-[11px] text-slate-400">
                  Fully sandbox isolated with secure iframe postMessage protocols.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-semibold text-xs text-white">Instant Response Sync</h5>
                <p className="text-[11px] text-slate-400">
                  Submissions appear immediately in your FormPulse response table.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-semibold text-xs text-white">Desktop & Mobile</h5>
                <p className="text-[11px] text-slate-400">
                  Responsive drawer on mobile phones and sleek floating card on desktops.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
