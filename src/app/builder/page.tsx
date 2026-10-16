import React from "react";
import FormBuilder from "@/components/builder/FormBuilder";

export const metadata = {
  title: "Create Interactive Form | FormPulse Builder",
  description: "Design conversational chatbot forms with instant live preview.",
};

export default function NewFormBuilderPage() {
  return <FormBuilder isNew={true} />;
}
