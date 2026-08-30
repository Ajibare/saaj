import type { Metadata } from "next";
import { ServiceForm } from "@/components/admin/forms/service-form";

export const metadata: Metadata = {
  title: "New Service",
  robots: { index: false, follow: false },
};

export default async function NewServicePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Add Service</h1>
        <p className="mt-1 text-sm text-slate-500">Create a new service your clients can learn about on the website.</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
        <ServiceForm />
      </div>
    </div>
  );
}