import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import { getFormByIdOrSlug } from "@/lib/storage";
import EmbedWrapper from "@/components/chatbot/EmbedWrapper";

interface EmbedPageProps {
  params: Promise<{ id: string }>;
}

async function EmbedPageContent({ params }: EmbedPageProps) {
  const { id } = await params;
  const form = await getFormByIdOrSlug(id);

  if (!form) {
    notFound();
  }

  return <EmbedWrapper form={form} />;
}

export default function EmbedPage({ params }: EmbedPageProps) {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen bg-white dark:bg-zinc-950 flex items-center justify-center text-xs text-zinc-400">
          Loading Widget...
        </div>
      }
    >
      <EmbedPageContent params={params} />
    </Suspense>
  );
}
