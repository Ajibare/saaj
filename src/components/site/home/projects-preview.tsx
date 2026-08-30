import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { ProjectCard, type ProjectCardData } from "@/components/site/project-card";

export function ProjectsPreview({ projects }: { projects: ProjectCardData[] }) {
  return (
    <section className="bg-slate-50 py-20 sm:py-24">
      <div className="container-site">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            align="left"
            eyebrow="Our Work"
            title="Featured Projects"
            description="A selection of projects delivered with discipline, professional management and an uncompromising standard of quality."
          />
          <Link
            href="/projects"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-brand-600 px-5 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-600 hover:text-white"
          >
            All Projects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}