"use client";

import React, { useState, useEffect } from "react";
import { Form } from "@/types/form";
import {
  X,
  Copy,
  Check,
  Code,
  Link as LinkIcon,
  Globe,
  ExternalLink,
  Sparkles,
} from "lucide-react";

interface ShareEmbedModalProps {
  form: Form | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareEmbedModal({
  form,
  isOpen,
  onClose,
}: ShareEmbedModalProps) {
  const [activeTab, setActiveTab] = useState<"script" | "link" | "iframe">(
    "script"
  );
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  if (!isOpen || !form) return null;

  const publicUrl = `${origin}/f/${form.slug || form.id}`;
  const embedScript = `<script\n  src="${origin}/embed.js"\n  data-form-id="${form.id}"\n  data-color="${form.theme.primaryColor}"\n  defer\n></script>`;
  const iframeCode = `<iframe\n  src="${origin}/embed/${form.id}"\n  width="100%"\n  height="600px"\n  frameborder="0"\n  style="border-radius: 16px; border: 1px solid #e2e8f0;"\n></iframe>`;

  const getCurrentSnippet = () => {
    if (activeTab === "script") return embedScript;
    if (activeTab === "link") return publicUrl;
    return iframeCode;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCurrentSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: form.theme.primaryColor }}
            >
              {form.theme.botAvatar}
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm sm:text-base">
                Share & Embed Form
              </h3>
              <p className="text-xs text-zinc-500 truncate max-w-xs sm:max-w-md">
                {form.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab("script")}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 ${
              activeTab === "script"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-zinc-900"
                : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            Floating Widget Script
          </button>

          <button
            onClick={() => setActiveTab("link")}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 ${
              activeTab === "link"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-zinc-900"
                : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            Direct Public URL
          </button>

          <button
            onClick={() => setActiveTab("iframe")}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 ${
              activeTab === "iframe"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-zinc-900"
                : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Inline Iframe
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-4">
          {activeTab === "script" && (
            <div className="space-y-2">
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Paste this script anywhere in your HTML document before the{" "}
                <code className="text-indigo-600 dark:text-indigo-400 font-mono">
                  &lt;/body&gt;
                </code>{" "}
                tag. A floating conversational bubble will appear on your site.
              </p>
            </div>
          )}

          {activeTab === "link" && (
            <div className="space-y-2">
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Share this unique direct link via email, social media, or QR code.
                Users will open a full-screen conversational chat form.
              </p>
            </div>
          )}

          {activeTab === "iframe" && (
            <div className="space-y-2">
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Embed the chatbot inline into a blog post, help doc, or landing
                page container using a standard HTML iframe.
              </p>
            </div>
          )}

          {/* Code display */}
          <div className="relative">
            <pre className="p-4 rounded-xl bg-zinc-950 text-indigo-200 text-xs font-mono overflow-x-auto border border-zinc-800 leading-relaxed max-h-48">
              {getCurrentSnippet()}
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-2.5 right-2.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <a
              href={`/embed-demo/${form.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Try in External Embed Simulator →
            </a>

            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open Standalone Form
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
