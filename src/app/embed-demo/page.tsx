import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { getAllForms } from "@/lib/storage";

async function EmbedDemoRedirectContent() {
  const forms = await getAllForms();
  const firstPublished = forms.find((f) => f.isPublished) || forms[0];

  if (firstPublished) {
    redirect(`/embed-demo/${firstPublished.id}`);
  }

  redirect("/dashboard");
  return null;
}

export default function EmbedDemoRedirect() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-sm">
          Loading Embed Simulator...
        </div>
      }
    >
      <EmbedDemoRedirectContent />
    </Suspense>
  );
}
