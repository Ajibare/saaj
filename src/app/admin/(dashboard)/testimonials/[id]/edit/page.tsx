import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TestimonialForm } from "@/components/admin/forms/testimonial-form";

export const metadata: Metadata = {
  title: "Edit Testimonial",
  robots: { index: false, follow: false },
};

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Edit Testimonial</h1>
        <p className="mt-1 text-sm text-slate-500">{testimonial.name}</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
        <TestimonialForm
          id={testimonial.id}
          initial={{
            name: testimonial.name,
            role: testimonial.role ?? "",
            company: testimonial.company ?? "",
            content: testimonial.content,
            rating: testimonial.rating,
            image: testimonial.image ?? "",
            isPublished: testimonial.isPublished,
            isDemo: testimonial.isDemo,
            sortOrder: testimonial.sortOrder,
          }}
        />
      </div>
    </div>
  );
}