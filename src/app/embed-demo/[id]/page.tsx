import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import { getFormByIdOrSlug, getAllForms } from "@/lib/storage";
import EmbedDemoClient from "@/components/embed/EmbedDemoClient";

interface EmbedDemoPageProps {
  params: Promise<{ id: string }>;
}

async function EmbedDemoContent({ params }: EmbedDemoPageProps) {
  const { id } = await params;
  const currentForm = await getFormByIdOrSlug(id);
  const allForms = await getAllForms();

  if (!currentForm) {
    notFound();
  }

  return <EmbedDemoClient currentForm={currentForm} allForms={allForms} />;
}

export default function EmbedDemoPage({ params }: EmbedDemoPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-sm">
          Loading Embed Simulator...
        </div>
      }
    >
      <EmbedDemoContent params={params} />
    </Suspense>
  );
}
