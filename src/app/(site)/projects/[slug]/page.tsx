import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  MapPin,
  User,
} from "lucide-react";
import { AppImage } from "@/components/site/app-image";
import { statusBadge } from "@/lib/constants";
import { CtaBanner } from "@/components/site/home/cta-banner";
import { getHomeSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });
  if (!project) return { title: "Project Not Found" };
  return {
    title: project.name,
    description: project.description.slice(0, 160),
  };
}

export default async function ProjectDetailPage({ params }: Params) {
  const { slug } = await params;
  const home = await getHomeSettings();

  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!project) {
    notFound();
  }

  const badge = statusBadge(project.status);

  return (
    <>
      <section className="relative overflow-hidden bg-navy text-white">
        <AppImage
          src={project.image}
          alt=""
          className="absolute inset-0 h-full w-full opacity-[0.12]"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/95 to-brand-950" />
        <div className="container-site relative py-20 sm:py-24">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-200 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            All Projects
          </Link>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            {project.name}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-300">
            {project.location ? (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-brand-400" />
                {project.location}
              </span>
            ) : null}
            {project.category ? (
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-brand-400" />
                {project.category}
              </span>
            ) : null}
            {project.year ? (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-brand-400" />
                {project.year}
              </span>
            ) : null}
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${badge.className}`}
            >
              {badge.label}
            </span>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_300px]">
          <div className="min-w-0">
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <AppImage
                src={project.image}
                alt={project.name}
                className="aspect-[16/9] w-full"
              />
            </div>

            {project.images.length > 0 ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {project.images.map((image) => (
                  <div
                    key={image.id}
                    className="overflow-hidden rounded-xl border border-slate-200"
                  >
                    <AppImage
                      src={image.url}
                      alt={image.caption ?? project.name}
                      className="aspect-[4/3] w-full"
                    />
                  </div>
                ))}
              </div>
            ) : null}

            <h2 className="mt-10 text-2xl font-bold tracking-tight text-slate-900">
              Project Overview
            </h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-slate-600">
              {project.description
                .split("\n")
                .filter(Boolean)
                .map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
                Project Details
              </h3>
              <dl className="mt-4 space-y-4 text-sm">
                {project.client ? (
                  <div className="flex items-start gap-3">
                    <User className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                    <div>
                      <dt className="text-xs text-slate-500">Client</dt>
                      <dd className="font-medium text-slate-800">{project.client}</dd>
                    </div>
                  </div>
                ) : null}
                {project.location ? (
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                    <div>
                      <dt className="text-xs text-slate-500">Location</dt>
                      <dd className="font-medium text-slate-800">{project.location}</dd>
                    </div>
                  </div>
                ) : null}
                {project.year ? (
                  <div className="flex items-start gap-3">
                    <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                    <div>
                      <dt className="text-xs text-slate-500">Year</dt>
                      <dd className="font-medium text-slate-800">{project.year}</dd>
                    </div>
                  </div>
                ) : null}
                {project.category ? (
                  <div className="flex items-start gap-3">
                    <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                    <div>
                      <dt className="text-xs text-slate-500">Category</dt>
                      <dd className="font-medium text-slate-800">{project.category}</dd>
                    </div>
                  </div>
                ) : null}
              </dl>
            </div>
            <div className="rounded-xl bg-navy p-6 text-white">
              <h3 className="text-lg font-bold">Have a similar project?</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Let&apos;s plan, price and deliver it to the same professional standard.
              </p>
              <Link
                href="/request-a-quote"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
              >
                Request a Quote
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <CtaBanner cta={home.cta} />
    </>
  );
}