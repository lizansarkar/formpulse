import React, { Suspense } from "react";
import { getAllForms, getDashboardStats } from "@/lib/storage";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | FormPulse Interactive Forms",
  description: "Manage interactive chatbot forms, submissions, and website embeds.",
};

async function DashboardContent() {
  const forms = await getAllForms();
  const stats = await getDashboardStats();

  return <DashboardClient initialForms={forms} initialStats={stats} />;
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-sm">
          Loading Dashboard...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
