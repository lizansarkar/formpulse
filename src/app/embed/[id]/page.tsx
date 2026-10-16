import React from "react";
import { notFound } from "next/navigation";
import { getFormByIdOrSlug } from "@/lib/storage";
import EmbedWrapper from "@/components/chatbot/EmbedWrapper";

interface EmbedPageProps {
  params: Promise<{ id: string }>;
}

export default async function EmbedPage({ params }: EmbedPageProps) {
  const { id } = await params;
  const form = await getFormByIdOrSlug(id);

  if (!form) {
    notFound();
  }

  return <EmbedWrapper form={form} />;
}
