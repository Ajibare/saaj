import type { Metadata } from "next";
import { ProjectForm } from "@/components/admin/forms/project-form";

export const metadata: Metadata = {
  title: "New Project",
  robots: { index: false, follow: false },
};

export default async function NewProjectPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Add Project</h1>
        <p className="mt-1 text-sm text-slate-500">Showcase a completed, ongoing or planned project on the website.</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
        <ProjectForm />
      </div>
    </div>
  );
}