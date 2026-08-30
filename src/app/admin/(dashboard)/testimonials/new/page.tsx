import type { Metadata } from "next";
import { TestimonialForm } from "@/components/admin/forms/testimonial-form";

export const metadata: Metadata = {
  title: "New Testimonial",
  robots: { index: false, follow: false },
};

export default async function NewTestimonialPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Add Testimonial</h1>
        <p className="mt-1 text-sm text-slate-500">Share what clients say about working with SAAJ.</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
        <TestimonialForm />
      </div>
    </div>
  );
}