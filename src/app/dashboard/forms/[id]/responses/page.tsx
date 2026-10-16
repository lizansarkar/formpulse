import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import { getFormByIdOrSlug, getSubmissionsByFormId } from "@/lib/storage";
import ResponsesClient from "@/components/dashboard/ResponsesClient";
import { Metadata } from "next";

interface ResponsesPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ResponsesPageProps): Promise<Metadata> {
  const { id } = await params;
  const form = await getFormByIdOrSlug(id);

  if (!form) {
    return { title: "Form Not Found | FormPulse" };
  }

  return {
    title: `${form.title} - Submissions & Responses | FormPulse`,
    description: `Manage responses for ${form.title}`,
  };
}

async function FormResponsesContent({ params }: ResponsesPageProps) {
  const { id } = await params;
  const form = await getFormByIdOrSlug(id);

  if (!form) {
    notFound();
  }

  const submissions = await getSubmissionsByFormId(form.id);

  return <ResponsesClient form={form} initialSubmissions={submissions} />;
}

export default function FormResponsesPage({ params }: ResponsesPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white text-sm">
          Loading Responses...
        </div>
      }
    >
      <FormResponsesContent params={params} />
    </Suspense>
  );
}
