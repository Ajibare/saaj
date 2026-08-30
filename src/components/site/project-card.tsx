import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { AppImage } from "@/components/site/app-image";
import { statusBadge } from "@/lib/constants";

export type ProjectCardData = {
  slug: string;
  name: string;
  category?: string;
  location?: string;
  status?: string;
  image?: string | null;
};

export function ProjectCard({ project }: { project: ProjectCardData }) {
  const badge = statusBadge(project.status ?? "completed");
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative block overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-600/5"
    >
      <div className="relative h-64 overflow-hidden">
        <AppImage
          src={project.image}
          alt={project.name}
          className="h-full w-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          {project.category ? (
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800">
              {project.category}
            </span>
          ) : null}
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${badge.className}`}
          >
            {badge.label}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="text-lg font-semibold text-white transition-colors group-hover:text-brand-200">
            {project.name}
          </h3>
          {project.location ? (
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-slate-300">
              <MapPin className="h-3.5 w-3.5 text-brand-300" />
              {project.location}
            </p>
          ) : null}
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-3 text-sm font-semibold text-brand-600">
        <span>View project</span>
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  );
}