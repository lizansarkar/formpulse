import React from "react";
import { notFound } from "next/navigation";
import { getFormByIdOrSlug, getAllForms } from "@/lib/storage";
import EmbedDemoClient from "@/components/embed/EmbedDemoClient";

interface EmbedDemoPageProps {
  params: Promise<{ id: string }>;
}

export default async function EmbedDemoPage({ params }: EmbedDemoPageProps) {
  const { id } = await params;
  const currentForm = await getFormByIdOrSlug(id);
  const allForms = await getAllForms();

  if (!currentForm) {
    notFound();
  }

  return <EmbedDemoClient currentForm={currentForm} allForms={allForms} />;
}
