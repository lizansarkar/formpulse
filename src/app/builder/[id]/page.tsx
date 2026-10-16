import React, { Suspense } from "react";
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

async function EditFormContent({ params }: EditFormPageProps) {
  const { id } = await params;
  const form = await getFormByIdOrSlug(id);

  if (!form) {
    notFound();
  }

  return <FormBuilder initialForm={form} isNew={false} />;
}

export default function EditFormPage({ params }: EditFormPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white text-sm">
          Loading Form Builder...
        </div>
      }
    >
      <EditFormContent params={params} />
    </Suspense>
  );
}
