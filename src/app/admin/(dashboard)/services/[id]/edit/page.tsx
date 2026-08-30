import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { asArray, asStringArray } from "@/lib/utils";
import { ServiceForm } from "@/components/admin/forms/service-form";

export const metadata: Metadata = {
  title: "Edit Service",
  robots: { index: false, follow: false },
};

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Edit Service</h1>
        <p className="mt-1 text-sm text-slate-500">{service.title}</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
        <ServiceForm
          id={service.id}
          initial={{
            title: service.title,
            slug: service.slug,
            icon: service.icon ?? "",
            image: service.image ?? "",
            shortDescription: service.shortDescription,
            description: service.description,
            benefits: asStringArray(service.benefits),
            process: asArray<{ title: string; description: string }>(service.process),
            isPublished: service.isPublished,
            featured: service.featured,
            sortOrder: service.sortOrder,
          }}
        />
      </div>
    </div>
  );
}