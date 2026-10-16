"use client";

import React, { useState } from "react";
import { Form, Question, QuestionType } from "@/types/form";
import ChatbotWidget from "@/components/chatbot/ChatbotWidget";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Settings,
  Sparkles,
  ExternalLink,
  Code,
  Check,
  Palette,
  AlertCircle,
  Type,
  Mail,
  List,
  CheckSquare,
} from "lucide-react";

interface FormBuilderProps {
  initialForm?: Form;
  isNew?: boolean;
}

const COLOR_PRESETS = [
  { name: "Indigo", hex: "#4f46e5" },
  { name: "Sky", hex: "#0284c7" },
  { name: "Emerald", hex: "#059669" },
  { name: "Violet", hex: "#7c3aed" },
  { name: "Rose", hex: "#e11d48" },
  { name: "Amber", hex: "#d97706" },
  { name: "Zinc", hex: "#27272a" },
];

const AVATAR_PRESETS = ["✨", "🤖", "💼", "🚀", "💬", "⚡", "🎯", "🌟", "💡"];

const DEFAULT_BLANK_FORM: Form = {
  id: "",
  slug: "",
  title: "Untitled Interactive Form",
  description: "A modern conversational chatbot form.",
  isPublished: true,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  theme: {
    primaryColor: "#4f46e5",
    botName: "PulseBot",
    botAvatar: "✨",
    welcomeMessage:
      "Hi there! 👋 Welcome to our form. We'd love to ask you a few quick questions.",
    completionMessage:
      "Thank you! Your response has been securely recorded. 🎉",
  },
  questions: [
    {
      id: "q_init_1",
      type: "text",
      title: "To get started, what is your name?",
      placeholder: "e.g. Alex Morgan",
      required: true,
      order: 1,
    },
    {
      id: "q_init_2",
      type: "email",
      title: "Great! What is your email address?",
      placeholder: "alex@example.com",
      required: true,
      order: 2,
    },
  ],
  submissionCount: 0,
};

export default function FormBuilder({
  initialForm,
  isNew = false,
}: FormBuilderProps) {
  const router = useRouter();

  const [form, setForm] = useState<Form>(() => initialForm || DEFAULT_BLANK_FORM);

  const [activeTab, setActiveTab] = useState<"questions" | "theme" | "settings">(
    "questions"
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<"editor" | "preview">("editor");

  // Question editing handlers
  const addQuestion = (type: QuestionType) => {
    const timestamp = Date.now();
    const newId = `q_${timestamp}_${Math.random().toString(36).substring(2, 6)}`;
    const newOrder = form.questions.length + 1;

    let defaultTitle = "What is your answer?";
    let defaultPlaceholder = "Type your response...";
    let options: string[] | undefined = undefined;

    if (type === "text") {
      defaultTitle = "Please describe your thoughts";
      defaultPlaceholder = "Write your answer here...";
    } else if (type === "email") {
      defaultTitle = "What is your email address?";
      defaultPlaceholder = "name@company.com";
    } else if (type === "multiple_choice") {
      defaultTitle = "Which of the following best describes your requirement?";
      options = ["Option 1", "Option 2", "Option 3"];
    } else if (type === "yes_no") {
      defaultTitle = "Do you agree with the terms?";
    }

    const newQuestion: Question = {
      id: newId,
      type,
      title: defaultTitle,
      placeholder: defaultPlaceholder,
      required: true,
      options,
      order: newOrder,
    };

    setForm((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === id ? { ...q, ...updates } : q
      ),
    }));
  };

  const deleteQuestion = (id: string) => {
    if (form.questions.length <= 1) {
      alert("A form must have at least one question.");
      return;
    }
    setForm((prev) => {
      const filtered = prev.questions.filter((q) => q.id !== id);
      const reordered = filtered.map((q, idx) => ({ ...q, order: idx + 1 }));
      return { ...prev, questions: reordered };
    });
  };

  const moveQuestion = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= form.questions.length) return;

    setForm((prev) => {
      const copy = [...prev.questions];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;

      const reordered = copy.map((q, idx) => ({ ...q, order: idx + 1 }));
      return { ...prev, questions: reordered };
    });
  };

  const addOption = (questionId: string) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id === questionId) {
          const currentOpts = q.options || [];
          return {
            ...q,
            options: [...currentOpts, `Option ${currentOpts.length + 1}`],
          };
        }
        return q;
      }),
    }));
  };

  const updateOption = (
    questionId: string,
    optIndex: number,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id === questionId && q.options) {
          const copy = [...q.options];
          copy[optIndex] = value;
          return { ...q, options: copy };
        }
        return q;
      }),
    }));
  };

  const removeOption = (questionId: string, optIndex: number) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id === questionId && q.options) {
          if (q.options.length <= 2) {
            alert("Multiple choice questions require at least two options.");
            return q;
          }
          const copy = q.options.filter((_, idx) => idx !== optIndex);
          return { ...q, options: copy };
        }
        return q;
      }),
    }));
  };

  // Save handler
  const handleSave = async () => {
    if (!form.title.trim()) {
      setErrorMessage("Please enter a title for your form.");
      return;
    }
    if (form.questions.length === 0) {
      setErrorMessage("Please add at least one question.");
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      if (isNew || !form.id) {
        const res = await fetch("/api/forms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create form");
        setSaveSuccess(true);
        setTimeout(() => {
          router.push(`/builder/${data.form.id}`);
        }, 800);
      } else {
        const res = await fetch(`/api/forms/${form.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to save form");
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save form";
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col font-sans">
      {/* Top Header / Action Bar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-900/95 border-b border-zinc-200 dark:border-zinc-800 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            title="Back to dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Untitled Interactive Form"
              className="font-bold text-base sm:text-lg text-zinc-900 dark:text-zinc-100 bg-transparent border-b border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 focus:border-indigo-500 focus:outline-none transition px-1"
            />
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span>{form.questions.length} questions</span>
              <span>•</span>
              <span
                className={`font-medium ${
                  form.isPublished
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-amber-600 dark:text-amber-400"
                }`}
              >
                {form.isPublished ? "Published" : "Draft"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {form.id && (
            <>
              <Link
                href={`/f/${form.slug || form.id}`}
                target="_blank"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Live Form
              </Link>
              <Link
                href={`/embed-demo/${form.id}`}
                target="_blank"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                <Code className="w-3.5 h-3.5" />
                Embed Code
              </Link>
            </>
          )}

          {/* Toggle Publish State */}
          <button
            onClick={() =>
              setForm((prev) => ({ ...prev, isPublished: !prev.isPublished }))
            }
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              form.isPublished
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            }`}
          >
            {form.isPublished ? "● Published" : "○ Draft Mode"}
          </button>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition disabled:opacity-50"
          >
            {isSaving ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : saveSuccess ? (
              <Check className="w-4 h-4 text-emerald-300" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? "Saving..." : saveSuccess ? "Saved!" : "Save Form"}
          </button>
        </div>
      </header>

      {/* Error Message Toast */}
      {errorMessage && (
        <div className="bg-rose-500 text-white text-xs px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)}>✕</button>
        </div>
      )}

      {/* Mobile Switcher (Editor vs Preview) */}
      <div className="lg:hidden flex border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <button
          onClick={() => setMobileTab("editor")}
          className={`flex-1 py-2.5 text-xs font-semibold text-center transition ${
            mobileTab === "editor"
              ? "border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "text-zinc-500"
          }`}
        >
          Editor & Questions
        </button>
        <button
          onClick={() => setMobileTab("preview")}
          className={`flex-1 py-2.5 text-xs font-semibold text-center transition ${
            mobileTab === "preview"
              ? "border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "text-zinc-500"
          }`}
        >
          Live Chatbot Preview
        </button>
      </div>

      {/* Main Split-View Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Builder Panel */}
        <div
          className={`w-full lg:w-1/2 xl:w-7/12 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-col overflow-y-auto ${
            mobileTab === "preview" ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Editor Sub-Tabs */}
          <div className="flex items-center gap-1 p-3 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => setActiveTab("questions")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "questions"
                  ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Questions ({form.questions.length})
            </button>
            <button
              onClick={() => setActiveTab("theme")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "theme"
                  ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              Bot & Theme
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "settings"
                  ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              Settings
            </button>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            {/* Tab 1: Questions */}
            {activeTab === "questions" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                    Conversation Flow
                  </h3>
                  <span className="text-xs text-zinc-500">
                    Questions are asked in sequence
                  </span>
                </div>

                {/* Question List */}
                <div className="space-y-3">
                  {form.questions.map((q, idx) => (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3"
                    >
                      {/* Question Header */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-600 dark:text-zinc-300">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/40">
                            {q.type.replace("_", " ")}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          {/* Move Up */}
                          <button
                            onClick={() => moveQuestion(idx, "up")}
                            disabled={idx === 0}
                            className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-20"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          {/* Move Down */}
                          <button
                            onClick={() => moveQuestion(idx, "down")}
                            disabled={idx === form.questions.length - 1}
                            className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-20"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => deleteQuestion(q.id)}
                            className="p-1.5 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 transition"
                            title="Delete Question"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Question Title Prompt */}
                      <div>
                        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                          Question Prompt (What the bot will ask)
                        </label>
                        <input
                          type="text"
                          value={q.title}
                          onChange={(e) =>
                            updateQuestion(q.id, { title: e.target.value })
                          }
                          placeholder="e.g. What is your email?"
                          className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      {/* Question Type and Placeholder */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Response Type
                          </label>
                          <select
                            value={q.type}
                            onChange={(e) => {
                              const newType = e.target.value as QuestionType;
                              let newOptions = q.options;
                              if (newType === "multiple_choice" && !newOptions) {
                                newOptions = ["Option A", "Option B"];
                              }
                              updateQuestion(q.id, {
                                type: newType,
                                options: newOptions,
                              });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                          >
                            <option value="text">Short / Long Text</option>
                            <option value="email">Email Address</option>
                            <option value="multiple_choice">
                              Multiple Choice
                            </option>
                            <option value="yes_no">Yes / No Button</option>
                          </select>
                        </div>

                        {(q.type === "text" || q.type === "email") && (
                          <div>
                            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                              Input Placeholder
                            </label>
                            <input
                              type="text"
                              value={q.placeholder || ""}
                              onChange={(e) =>
                                updateQuestion(q.id, {
                                  placeholder: e.target.value,
                                })
                              }
                              placeholder="e.g. Type your answer..."
                              className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                            />
                          </div>
                        )}

                        <div className="flex items-center gap-2 pt-4">
                          <input
                            type="checkbox"
                            id={`req_${q.id}`}
                            checked={q.required}
                            onChange={(e) =>
                              updateQuestion(q.id, {
                                required: e.target.checked,
                              })
                            }
                            className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                          />
                          <label
                            htmlFor={`req_${q.id}`}
                            className="text-xs font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer"
                          >
                            Mark as Required
                          </label>
                        </div>
                      </div>

                      {/* Multiple Choice Options Editor */}
                      {q.type === "multiple_choice" && (
                        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                            Answer Choices
                          </label>
                          <div className="space-y-2">
                            {(q.options || []).map((opt, optIdx) => (
                              <div
                                key={optIdx}
                                className="flex items-center gap-2"
                              >
                                <span className="text-xs text-zinc-400 font-mono w-4">
                                  {optIdx + 1}.
                                </span>
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) =>
                                    updateOption(q.id, optIdx, e.target.value)
                                  }
                                  className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                                />
                                <button
                                  onClick={() => removeOption(q.id, optIdx)}
                                  className="p-1 text-zinc-400 hover:text-rose-500"
                                  title="Delete Option"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                          <button
                            onClick={() => addOption(q.id)}
                            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 pt-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add Choice Option
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Question Buttons */}
                <div className="pt-2">
                  <div className="text-xs font-medium text-zinc-500 mb-2">
                    Add new question:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      onClick={() => addQuestion("text")}
                      className="p-3 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-indigo-500 dark:hover:border-indigo-500 bg-white dark:bg-zinc-900 text-left transition group"
                    >
                      <Type className="w-4 h-4 text-zinc-500 group-hover:text-indigo-500 mb-1" />
                      <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        Text
                      </div>
                      <div className="text-[10px] text-zinc-400">Short / long answer</div>
                    </button>

                    <button
                      onClick={() => addQuestion("email")}
                      className="p-3 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-indigo-500 dark:hover:border-indigo-500 bg-white dark:bg-zinc-900 text-left transition group"
                    >
                      <Mail className="w-4 h-4 text-zinc-500 group-hover:text-indigo-500 mb-1" />
                      <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        Email
                      </div>
                      <div className="text-[10px] text-zinc-400">Validated email</div>
                    </button>

                    <button
                      onClick={() => addQuestion("multiple_choice")}
                      className="p-3 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-indigo-500 dark:hover:border-indigo-500 bg-white dark:bg-zinc-900 text-left transition group"
                    >
                      <List className="w-4 h-4 text-zinc-500 group-hover:text-indigo-500 mb-1" />
                      <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        Choices
                      </div>
                      <div className="text-[10px] text-zinc-400">Select options</div>
                    </button>

                    <button
                      onClick={() => addQuestion("yes_no")}
                      className="p-3 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-indigo-500 dark:hover:border-indigo-500 bg-white dark:bg-zinc-900 text-left transition group"
                    >
                      <CheckSquare className="w-4 h-4 text-zinc-500 group-hover:text-indigo-500 mb-1" />
                      <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        Yes / No
                      </div>
                      <div className="text-[10px] text-zinc-400">Quick binary</div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Theme & Bot Customization */}
            {activeTab === "theme" && (
              <div className="space-y-6">
                {/* Bot Profile */}
                <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                    Bot Persona & Identity
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Bot Name
                      </label>
                      <input
                        type="text"
                        value={form.theme.botName}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            theme: { ...prev.theme, botName: e.target.value },
                          }))
                        }
                        placeholder="PulseBot"
                        className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Bot Avatar (Emoji / Icon)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={form.theme.botAvatar}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              theme: { ...prev.theme, botAvatar: e.target.value },
                            }))
                          }
                          className="w-14 px-2 py-2 text-center rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-base focus:outline-none"
                        />
                        <div className="flex items-center gap-1 overflow-x-auto">
                          {AVATAR_PRESETS.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() =>
                                setForm((prev) => ({
                                  ...prev,
                                  theme: { ...prev.theme, botAvatar: emoji },
                                }))
                              }
                              className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm transition"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Primary Brand Color */}
                <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                    Brand Accent Color
                  </h4>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {COLOR_PRESETS.map((color) => (
                        <button
                          key={color.hex}
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              theme: { ...prev.theme, primaryColor: color.hex },
                            }))
                          }
                          className="w-8 h-8 rounded-full border-2 transition transform active:scale-90"
                          style={{
                            backgroundColor: color.hex,
                            borderColor:
                              form.theme.primaryColor === color.hex
                                ? "#ffffff"
                                : "transparent",
                            boxShadow:
                              form.theme.primaryColor === color.hex
                                ? `0 0 0 2px ${color.hex}`
                                : "none",
                          }}
                          title={color.name}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <span className="text-xs text-zinc-500">Custom Hex:</span>
                      <input
                        type="text"
                        value={form.theme.primaryColor}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            theme: {
                              ...prev.theme,
                              primaryColor: e.target.value,
                            },
                          }))
                        }
                        className="w-28 px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                    Conversational Copy
                  </h4>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Welcome Message (First message sent by the bot)
                    </label>
                    <textarea
                      rows={2}
                      value={form.theme.welcomeMessage}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          theme: {
                            ...prev.theme,
                            welcomeMessage: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Completion Message (Celebration text upon finishing)
                    </label>
                    <textarea
                      rows={2}
                      value={form.theme.completionMessage}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          theme: {
                            ...prev.theme,
                            completionMessage: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Settings */}
            {activeTab === "settings" && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                    Form Metadata & Publishing
                  </h4>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Form Description (for SEO and sharing preview)
                    </label>
                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Brief summary of what this form is for..."
                      className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={form.slug || ""}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, slug: e.target.value }))
                      }
                      placeholder="e.g. feedback-form"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Live Interactive Chatbot Preview */}
        <div
          className={`w-full lg:w-1/2 xl:w-5/12 bg-zinc-100 dark:bg-zinc-900 flex-col items-center justify-center p-4 sm:p-8 overflow-y-auto ${
            mobileTab === "editor" ? "hidden lg:flex" : "flex"
          }`}
        >
          <div className="w-full max-w-md space-y-3">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-300">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Live Conversational Preview
              </div>
              <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                <span>Updates in real-time</span>
              </div>
            </div>

            {/* Embedded Live Preview Widget */}
            <div className="rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
              <ChatbotWidget
                key={JSON.stringify({
                  theme: form.theme,
                  qCount: form.questions.length,
                })}
                form={form}
                isPreview={true}
                mode="card"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
