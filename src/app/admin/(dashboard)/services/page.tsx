import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Pencil, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { truncate } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/admin-ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteService } from "@/lib/actions/content";

export const metadata: Metadata = {
  title: "Services",
  robots: { index: false, follow: false },
};

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Services</h1>
          <p className="mt-1 text-sm text-slate-500">
            {services.length} service{services.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/admin/services/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
        >
          <Plus className="h-4 w-4" />
          Add Service
        </Link>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <li key={service.id} className="flex flex-col rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-brand-700">
                  #{service.sortOrder}
                </p>
                <h2 className="mt-1 text-base font-bold text-slate-900">{service.title}</h2>
              </div>
              {service.featured ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
                  <Star className="h-3 w-3" />
                  Featured
                </span>
              ) : null}
            </div>
            <p className="mt-2 flex-1 text-sm text-slate-600">{truncate(service.shortDescription, 110)}</p>
            <div className="mt-4 flex items-center justify-between">
              <StatusBadge status={service.isPublished ? "published" : "unpublished"} />
              <div className="flex items-center gap-1">
                <Link
                  href={`/admin/services/${service.id}/edit`}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Link>
                <DeleteButton id={service.id} action={deleteService} confirmMessage="Delete this service permanently?" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}