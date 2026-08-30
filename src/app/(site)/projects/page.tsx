import type { Metadata } from "next";
import Link from "next/link";
import { PROJECT_CATEGORIES, PROJECT_STATUSES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { PageHero } from "@/components/site/page-hero";
import { ProjectCard } from "@/components/site/project-card";
import { CtaBanner } from "@/components/site/home/cta-banner";
import { getHomeSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Our Projects",
    description:
      "Browse a selection of projects delivered by SAAJ Partners and Consult across residential, commercial, industrial, infrastructure and renovation sectors.",
  };
}

type Props = { searchParams: Promise<{ status?: string; category?: string }> };

export default async function ProjectsPage({ searchParams }: Props) {
  const home = await getHomeSettings();
  const { status, category } = await searchParams;

  const selectedStatus = PROJECT_STATUSES.some((s) => s.value === status) ? status : undefined;
  const selectedCategory = (PROJECT_CATEGORIES as readonly string[]).includes(category ?? "")
    ? category
    : undefined;

  const projects = await prisma.project.findMany({
    where: {
      isPublished: true,
      ...(selectedStatus ? { status: selectedStatus } : {}),
      ...(selectedCategory ? { category: selectedCategory } : {}),
    },
    orderBy: { createdAt: "desc" },
    select: {
      slug: true,
      name: true,
      category: true,
      location: true,
      status: true,
      image: true,
    },
  });

  return (
    <>
      <PageHero
        eyebrow="Our Work"
        title="Projects & Deliveries"
        description="A showcase of the residential, commercial, industrial, infrastructure and renovation work we have planned, costed, managed and delivered."
      />

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="container-site">
          {/* Status filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Status:
            </span>
            <FilterChip
              href="/projects"
              active={!selectedStatus}
              label={selectedStatus ? "All" : "All"}
            />
            {PROJECT_STATUSES.map((s) => {
              const active = selectedStatus === s.value;
              const params = new URLSearchParams();
              if (s.value !== undefined) params.set("status", s.value);
              if (selectedCategory) params.set("category", selectedCategory);
              return (
                <FilterChip
                  key={s.value}
                  href={`/projects${params.toString() ? `?${params}` : ""}`}
                  active={active}
                  label={s.label}
                />
              );
            })}
          </div>

          {/* Category filter */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Category:
            </span>
            <FilterChip href="/projects" active={!selectedCategory} label="All" />
            {PROJECT_CATEGORIES.map((c) => {
              const params = new URLSearchParams();
              if (c !== undefined) params.set("category", c);
              if (selectedStatus) params.set("status", selectedStatus);
              return (
                <FilterChip
                  key={c}
                  href={`/projects${params.toString() ? `?${params}` : ""}`}
                  active={selectedCategory === c}
                  label={c}
                />
              );
            })}
          </div>

          {projects.length > 0 ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <p className="text-sm text-slate-600">
                No projects match the selected filters. Try clearing a filter to see more work.
              </p>
              <Link
                href="/projects"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
              >
                Clear all filters
              </Link>
            </div>
          )}
        </div>
      </section>

      <CtaBanner cta={home.cta} />
    </>
  );
}

function FilterChip({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-brand-600 bg-brand-600 text-white"
          : "border-slate-300 bg-white text-slate-700 hover:border-brand-400 hover:text-brand-700"
      )}
    >
      {label}
    </Link>
  );
}