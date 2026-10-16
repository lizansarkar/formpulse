"use client";

import React, { useState } from "react";
import { Form, FormStats } from "@/types/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ShareEmbedModal from "@/components/dashboard/ShareEmbedModal";
import {
  Plus,
  Search,
  MessageSquare,
  BarChart3,
  ExternalLink,
  Code,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Globe,
  SlidersHorizontal,
  Flame,
} from "lucide-react";

interface DashboardClientProps {
  initialForms: Form[];
  initialStats: FormStats;
}

export default function DashboardClient({
  initialForms,
  initialStats,
}: DashboardClientProps) {
  const router = useRouter();
  const [forms, setForms] = useState<Form[]>(initialForms);
  const [stats, setStats] = useState<FormStats>(initialStats);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">(
    "all"
  );
  const [selectedFormForShare, setSelectedFormForShare] = useState<Form | null>(
    null
  );
  const [isCreating, setIsCreating] = useState(false);

  // Filter forms
  const filteredForms = forms.filter((form) => {
    const matchesSearch =
      form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && form.isPublished) ||
      (statusFilter === "draft" && !form.isPublished);

    return matchesSearch && matchesStatus;
  });

  // Toggle publish
  const handleTogglePublish = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const res = await fetch(`/api/forms/${id}/publish`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setForms((prev) =>
          prev.map((f) => (f.id === id ? { ...f, isPublished: data.form.isPublished } : f))
        );
        // refresh stats
        const statsRes = await fetch("/api/stats");
        const statsData = await statsRes.json();
        if (statsRes.ok) setStats(statsData.stats);
      }
    } catch (err) {
      console.error("Failed to toggle publish:", err);
    }
  };

  // Delete form
  const handleDeleteForm = async (id: string, title: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm(`Are you sure you want to delete "${title}" and all its submissions?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/forms/${id}`, { method: "DELETE" });
      if (res.ok) {
        setForms((prev) => prev.filter((f) => f.id !== id));
        const statsRes = await fetch("/api/stats");
        const statsData = await statsRes.json();
        if (statsRes.ok) setStats(statsData.stats);
      }
    } catch (err) {
      console.error("Failed to delete form:", err);
    }
  };

  // Create form from template
  const handleCreateFromTemplate = async (templateName: string) => {
    setIsCreating(true);

    let templatePayload: any = {
      title: "Interactive Form",
      description: "A modern conversational chatbot form.",
    };

    if (templateName === "feedback") {
      templatePayload = {
        title: "Product Feedback & Suggestions",
        description: "Gather feedback from active users on features and performance.",
        theme: {
          primaryColor: "#4f46e5",
          botName: "FeedbackBot",
          botAvatar: "✨",
          welcomeMessage: "Hey! We'd love your candid thoughts on how we can improve.",
          completionMessage: "Thanks for sharing your thoughts! We read every submission.",
        },
        questions: [
          {
            id: `q_1_${Date.now()}`,
            type: "text",
            title: "What is your name?",
            placeholder: "Alex Johnson",
            required: true,
            order: 1,
          },
          {
            id: `q_2_${Date.now()}`,
            type: "email",
            title: "What email should we reach you at?",
            placeholder: "alex@example.com",
            required: true,
            order: 2,
          },
          {
            id: `q_3_${Date.now()}`,
            type: "multiple_choice",
            title: "How satisfied are you with our product?",
            options: ["🌟 Very Satisfied", "👍 Somewhat Satisfied", "👎 Needs Improvement"],
            required: true,
            order: 3,
          },
          {
            id: `q_4_${Date.now()}`,
            type: "yes_no",
            title: "Would you be open to a 10-minute user feedback call with our team?",
            required: true,
            order: 4,
          },
        ],
      };
    } else if (templateName === "lead") {
      templatePayload = {
        title: "Inbound Lead Qualification",
        description: "Capture sales inquiries directly from website visitors.",
        theme: {
          primaryColor: "#0284c7",
          botName: "SalesBot",
          botAvatar: "💼",
          welcomeMessage: "Welcome! Let's get you connected with the right specialist.",
          completionMessage: "Got it! Our enterprise team will follow up shortly.",
        },
        questions: [
          {
            id: `q_1_${Date.now()}`,
            type: "text",
            title: "What is your name and company name?",
            placeholder: "Jane Doe at Acme Inc",
            required: true,
            order: 1,
          },
          {
            id: `q_2_${Date.now()}`,
            type: "email",
            title: "What is your work email?",
            placeholder: "jane@acme.com",
            required: true,
            order: 2,
          },
          {
            id: `q_3_${Date.now()}`,
            type: "multiple_choice",
            title: "What is your project budget?",
            options: ["Under $5,000", "$5,000 - $20,000", "$20,000+ Enterprise"],
            required: true,
            order: 3,
          },
          {
            id: `q_4_${Date.now()}`,
            type: "yes_no",
            title: "Are you ready to start within the next month?",
            required: true,
            order: 4,
          },
        ],
      };
    }

    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(templatePayload),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/builder/${data.form.id}`);
      }
    } catch (err) {
      console.error("Failed to create template form:", err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 flex flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-zinc-900/95 border-b border-zinc-200 dark:border-zinc-800 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition">
              ⚡
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                FormPulse
                <span className="text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded">
                  Dashboard
                </span>
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/builder"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-md transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Create New Form
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* KPI Overview Metrics */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Forms */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Total Forms
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
                {stats.totalForms}
              </div>
              <p className="text-xs text-zinc-500">
                {stats.publishedForms} published, {stats.totalForms - stats.publishedForms} drafts
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Total Responses */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Total Submissions
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
                {stats.totalSubmissions}
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                <TrendingUp className="w-3 h-3" />
                Live response sync active
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Active Widgets */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Active Widgets
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
                {stats.publishedForms}
              </div>
              <p className="text-xs text-zinc-500">
                Ready for website embeds
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Avg Completion Rate */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Completion Rate
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
                {stats.averageCompletionRate}%
              </div>
              <p className="text-xs text-zinc-500">
                3.2x higher than static forms
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
          </div>
        </section>

        {/* Quick Template Launchers Banner */}
        <section className="p-5 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <h3 className="font-bold text-sm sm:text-base">
                Instant Template Presets
              </h3>
            </div>
            <p className="text-xs text-indigo-200 max-w-xl">
              Launch pre-configured conversational chatbot forms in seconds.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleCreateFromTemplate("feedback")}
              disabled={isCreating}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/20 transition flex items-center gap-1.5"
            >
              <span>🌟</span> Customer Feedback
            </button>
            <button
              onClick={() => handleCreateFromTemplate("lead")}
              disabled={isCreating}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/20 transition flex items-center gap-1.5"
            >
              <span>💼</span> Lead Qualification
            </button>
            <Link
              href="/builder"
              className="px-3.5 py-2 rounded-xl bg-white text-indigo-950 hover:bg-indigo-50 text-xs font-bold transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Blank Form
            </Link>
          </div>
        </section>

        {/* Forms Management Section */}
        <section className="space-y-4">
          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1 bg-zinc-200/60 dark:bg-zinc-800/60 p-1 rounded-xl">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  statusFilter === "all"
                    ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                All Forms ({forms.length})
              </button>
              <button
                onClick={() => setStatusFilter("published")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  statusFilter === "published"
                    ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                Published ({forms.filter((f) => f.isPublished).length})
              </button>
              <button
                onClick={() => setStatusFilter("draft")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  statusFilter === "draft"
                    ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                Drafts ({forms.filter((f) => !f.isPublished).length})
              </button>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search forms by title..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          {/* Forms List / Table */}
          {filteredForms.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
                No forms match your search
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Try adjusting your search criteria or create a brand new conversational form.
              </p>
              <Link
                href="/builder"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Create New Form
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredForms.map((form) => (
                <div
                  key={form.id}
                  className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  {/* Left: Info */}
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-sm"
                      style={{ backgroundColor: form.theme.primaryColor }}
                    >
                      {form.theme.botAvatar}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          href={`/builder/${form.id}`}
                          className="font-bold text-base text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                        >
                          {form.title}
                        </Link>
                        {form.isPublished ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Published
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                            Draft
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 max-w-xl">
                        {form.description || "Conversational interactive form"}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-zinc-400 pt-1">
                        <span>{form.questions.length} questions</span>
                        <span>•</span>
                        <Link
                          href={`/dashboard/forms/${form.id}/responses`}
                          className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3" />
                          {form.submissionCount ?? 0} responses
                        </Link>
                        <span>•</span>
                        <span>
                          Updated {new Date(form.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-zinc-100 dark:border-zinc-800">
                    {/* View Responses Button */}
                    <Link
                      href={`/dashboard/forms/${form.id}/responses`}
                      className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-200 transition flex items-center gap-1.5"
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      Submissions ({form.submissionCount ?? 0})
                    </Link>

                    {/* Edit Builder */}
                    <Link
                      href={`/builder/${form.id}`}
                      className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-200 transition flex items-center gap-1.5"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </Link>

                    {/* Share & Embed Modal Trigger */}
                    <button
                      onClick={() => setSelectedFormForShare(form)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-xs font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition flex items-center gap-1.5"
                    >
                      <Code className="w-3.5 h-3.5" />
                      Share & Embed
                    </button>

                    {/* Standalone Link */}
                    <Link
                      href={`/f/${form.slug || form.id}`}
                      target="_blank"
                      className="p-2 rounded-xl text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                      title="Open Public Form"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>

                    {/* Toggle publish */}
                    <button
                      onClick={(e) => handleTogglePublish(form.id, e)}
                      className={`text-xs px-2.5 py-1.5 rounded-xl font-medium transition ${
                        form.isPublished
                          ? "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                          : "text-emerald-600 hover:text-emerald-700 font-semibold"
                      }`}
                      title={form.isPublished ? "Unpublish Form" : "Publish Form"}
                    >
                      {form.isPublished ? "Unpublish" : "Publish"}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={(e) => handleDeleteForm(form.id, form.title, e)}
                      className="p-2 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 transition"
                      title="Delete Form"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Share & Embed Modal */}
      <ShareEmbedModal
        form={selectedFormForShare}
        isOpen={!!selectedFormForShare}
        onClose={() => setSelectedFormForShare(null)}
      />
    </div>
  );
}
