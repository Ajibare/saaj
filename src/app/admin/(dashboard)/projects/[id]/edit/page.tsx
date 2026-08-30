import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "@/components/admin/forms/project-form";

export const metadata: Metadata = {
  title: "Edit Project",
  robots: { index: false, follow: false },
};

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Edit Project</h1>
        <p className="mt-1 text-sm text-slate-500">{project.name}</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
        <ProjectForm
          id={project.id}
          initial={{
            name: project.name,
            slug: project.slug,
            location: project.location,
            description: project.description,
            category: project.category,
            year: project.year ?? "",
            client: project.client ?? "",
            status: project.status,
            image: project.image ?? "",
            gallery: project.images.map((image) => image.url),
            featured: project.featured,
            isPublished: project.isPublished,
          }}
        />
      </div>
    </div>
  );
}