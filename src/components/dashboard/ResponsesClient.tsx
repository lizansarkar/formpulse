"use client";

import React, { useState } from "react";
import { Form, FormSubmission } from "@/types/form";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Trash2,
  Eye,
  ExternalLink,
  MessageSquare,
  Clock,
  Sparkles,
  CheckCircle2,
  X,
  FileSpreadsheet,
  Globe,
  Code,
  Edit,
} from "lucide-react";

interface ResponsesClientProps {
  form: Form;
  initialSubmissions: FormSubmission[];
}

export default function ResponsesClient({
  form,
  initialSubmissions,
}: ResponsesClientProps) {
  const [submissions, setSubmissions] =
    useState<FormSubmission[]>(initialSubmissions);
  const [selectedSubmission, setSelectedSubmission] =
    useState<FormSubmission | null>(null);

  const sortedQuestions = [...form.questions].sort((a, b) => a.order - b.order);

  // Delete submission
  const handleDelete = async (submissionId: string) => {
    if (!confirm("Are you sure you want to delete this submission?")) return;

    try {
      const res = await fetch(`/api/submissions/${submissionId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSubmissions((prev) => prev.filter((s) => s.id !== submissionId));
        if (selectedSubmission?.id === submissionId) {
          setSelectedSubmission(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete submission:", err);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (submissions.length === 0) {
      alert("No submissions to export yet.");
      return;
    }

    const headers = [
      "Submission ID",
      "Timestamp",
      ...sortedQuestions.map((q) => `"${q.title.replace(/"/g, '""')}"`),
    ];

    const rows = submissions.map((sub) => {
      const dateStr = `"${new Date(sub.createdAt).toLocaleString()}"`;
      const answersList = sortedQuestions.map((q) => {
        const val = sub.answers[q.id];
        if (val === undefined || val === null) return '""';
        if (typeof val === "boolean") return val ? '"Yes"' : '"No"';
        return `"${String(val).replace(/"/g, '""')}"`;
      });

      return [sub.id, dateStr, ...answersList].join(",");
    });

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `formpulse_${form.slug || form.id}_responses_${Date.now()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-zinc-900/95 border-b border-zinc-200 dark:border-zinc-800 backdrop-blur-md px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            title="Back to dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg text-zinc-900 dark:text-zinc-100">
                {form.title}
              </h1>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                  form.isPublished
                    ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800"
                    : "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800"
                }`}
              >
                {form.isPublished ? "Published" : "Draft"}
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              Form ID: <code className="font-mono">{form.id}</code>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            disabled={submissions.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700/80 transition disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            Export CSV
          </button>

          <Link
            href={`/builder/${form.id}`}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700/80 transition"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit Form
          </Link>

          <Link
            href={`/f/${form.slug || form.id}`}
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open Live Form
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Quick Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Total Submissions
            </span>
            <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">
              {submissions.length}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Questions per Response
            </span>
            <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">
              {form.questions.length}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Latest Submission
            </span>
            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-2 truncate">
              {submissions.length > 0
                ? new Date(submissions[0].createdAt).toLocaleString()
                : "No submissions yet"}
            </div>
          </div>
        </div>

        {/* Responses Table */}
        {submissions.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
              No submissions recorded yet
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Share the form link or embed the chatbot widget on your website to begin collecting real responses.
            </p>
            <div className="pt-2">
              <Link
                href={`/f/${form.slug || form.id}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Submit Test Response in Live Form
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Submitted At</th>
                    {sortedQuestions.slice(0, 3).map((q) => (
                      <th key={q.id} className="py-3 px-4 max-w-[200px] truncate">
                        {q.title}
                      </th>
                    ))}
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                  {submissions.map((sub, idx) => (
                    <tr
                      key={sub.id}
                      className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 transition"
                    >
                      <td className="py-3.5 px-4 font-mono text-zinc-400">
                        {submissions.length - idx}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-zinc-600 dark:text-zinc-300">
                        {new Date(sub.createdAt).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      {sortedQuestions.slice(0, 3).map((q) => {
                        const val = sub.answers[q.id];
                        const display =
                          typeof val === "boolean"
                            ? val
                              ? "Yes"
                              : "No"
                            : val || "—";
                        return (
                          <td
                            key={q.id}
                            className="py-3.5 px-4 max-w-[200px] truncate text-zinc-800 dark:text-zinc-200"
                          >
                            {display}
                          </td>
                        );
                      })}

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedSubmission(sub)}
                            className="px-2.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-medium transition flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Inspect
                          </button>
                          <button
                            onClick={() => handleDelete(sub.id)}
                            className="p-1.5 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 transition"
                            title="Delete submission"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Inspect Submission Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
                  Submission Details
                </h3>
                <p className="text-xs text-zinc-500">
                  Recorded on{" "}
                  {new Date(selectedSubmission.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {sortedQuestions.map((q, idx) => {
                const ans = selectedSubmission.answers[q.id];
                const formatted =
                  typeof ans === "boolean"
                    ? ans
                      ? "Yes"
                      : "No"
                    : ans || "— (No answer provided)";
                return (
                  <div
                    key={q.id}
                    className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/70 dark:border-zinc-800 space-y-1"
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
                      <span>Q{idx + 1}.</span>
                      <span className="uppercase text-[10px] tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.2 rounded">
                        {q.type.replace("_", " ")}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      {q.title}
                    </div>
                    <div className="text-sm font-bold text-indigo-950 dark:text-indigo-200 pt-1">
                      {formatted}
                    </div>
                  </div>
                );
              })}

              {/* Metadata */}
              {selectedSubmission.metadata && (
                <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-400 space-y-1">
                  <div>
                    User Agent:{" "}
                    <span className="font-mono">
                      {selectedSubmission.metadata.userAgent || "Unknown"}
                    </span>
                  </div>
                  <div>
                    Submission ID:{" "}
                    <span className="font-mono">{selectedSubmission.id}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-3.5 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
