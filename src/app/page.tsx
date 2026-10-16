import React from "react";
import { getAllForms } from "@/lib/storage";
import LandingClient from "@/components/landing/LandingClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FormPulse — Interactive Form Builder with Chatbot Widget",
  description:
    "Build conversational chatbot forms, embed interactive widgets on any website, collect responses and manage submissions through a real-time dashboard.",
};

export default async function HomePage() {
  const forms = await getAllForms();
  const demoForm =
    forms.find((f) => f.slug === "customer-feedback" || f.id === "fp_customer_feedback") ||
    forms[0];

  return <LandingClient demoForm={demoForm} />;
}
