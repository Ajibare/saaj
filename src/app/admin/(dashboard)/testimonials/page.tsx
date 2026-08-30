import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Pencil, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { truncate } from "@/lib/utils";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteTestimonial } from "@/lib/actions/content";

export const metadata: Metadata = {
  title: "Testimonials",
  robots: { index: false, follow: false },
};

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Testimonials</h1>
          <p className="mt-1 text-sm text-slate-500">
            {testimonials.length} testimonial{testimonials.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" />
          Add Testimonial
        </Link>
      </div>

      {testimonials.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <p className="text-sm font-medium text-slate-600">No testimonials yet</p>
          <p className="mt-1 text-xs text-slate-400">Add client feedback to build trust with visitors.</p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <li key={testimonial.id} className="flex flex-col rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-0.5 text-amber-400">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    className={`h-4 w-4 ${index < (testimonial.rating ?? 0) ? "fill-current" : "text-slate-200"}`}
                  />
                ))}
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                &ldquo;{truncate(testimonial.content, 160)}&rdquo;
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                <div>
                  <p className="text-sm font-bold text-slate-900">{testimonial.name}</p>
                  <p className="text-xs text-slate-500">
                    {[testimonial.role, testimonial.company].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/testimonials/${testimonial.id}/edit`}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Link>
                  <DeleteButton id={testimonial.id} action={deleteTestimonial} confirmMessage="Delete this testimonial permanently?" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}