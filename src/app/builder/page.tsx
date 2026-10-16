import React, { Suspense } from "react";
import FormBuilder from "@/components/builder/FormBuilder";

export const metadata = {
  title: "Create Interactive Form | FormPulse Builder",
  description: "Design conversational chatbot forms with instant live preview.",
};

export default function NewFormBuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white text-sm">
          Loading Form Builder...
        </div>
      }
    >
      <FormBuilder isNew={true} />
    </Suspense>
  );
}
