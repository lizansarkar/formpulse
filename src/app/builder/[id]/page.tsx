import React from "react";
import { notFound } from "next/navigation";
import { getFormByIdOrSlug } from "@/lib/storage";
import FormBuilder from "@/components/builder/FormBuilder";
import { Metadata } from "next";

interface EditFormPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: EditFormPageProps): Promise<Metadata> {
  const { id } = await params;
  const form = await getFormByIdOrSlug(id);

  if (!form) {
    return { title: "Form Not Found | FormPulse" };
  }

  return {
    title: `Edit ${form.title} | FormPulse Builder`,
  };
}

export default async function EditFormPage({ params }: EditFormPageProps) {
  const { id } = await params;
  const form = await getFormByIdOrSlug(id);

  if (!form) {
    notFound();
  }

  return <FormBuilder initialForm={form} isNew={false} />;
}
