import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFormByIdOrSlug } from "@/lib/storage";
import ChatbotWidget from "@/components/chatbot/ChatbotWidget";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const form = await getFormByIdOrSlug(id);

  if (!form) {
    return {
      title: "Form Not Found | FormPulse",
      description: "The requested interactive form could not be found.",
    };
  }

  return {
    title: `${form.title} | FormPulse Interactive Form`,
    description: form.description || "Interactive conversational form powered by FormPulse.",
  };
}

export default async function PublicFormPage({ params }: PageProps) {
  const { id } = await params;
  const form = await getFormByIdOrSlug(id);

  if (!form) {
    notFound();
  }

  // Handle unpublished form state
  if (!form.isPublished) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-full max-w-md p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Form Currently Unavailable
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            &ldquo;{form.title}&rdquo; is currently in draft mode or closed for submissions by its creator.
          </p>
          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to FormPulse Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100/60 dark:bg-black py-0 md:py-8 sm:px-4 flex flex-col justify-center">
      <ChatbotWidget form={form} mode="fullscreen" />
    </div>
  );
}
