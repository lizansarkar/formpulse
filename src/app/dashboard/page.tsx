import React from "react";
import { getAllForms, getDashboardStats } from "@/lib/storage";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | FormPulse Interactive Forms",
  description: "Manage interactive chatbot forms, submissions, and website embeds.",
};

export default async function DashboardPage() {
  const forms = await getAllForms();
  const stats = await getDashboardStats();

  return <DashboardClient initialForms={forms} initialStats={stats} />;
}
