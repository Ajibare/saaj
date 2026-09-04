import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppImage } from "@/components/site/app-image";
import { IconByName } from "@/components/site/icon";
import { truncate } from "@/lib/utils";

export type ServiceCardData = {
  slug: string;
  title: string;
  icon?: string | null;
  image?: string | null;
  shortDescription?: string;
};

export function ServiceCard({ service }: { service: ServiceCardData }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-600/5"
    >
      <div className="relative h-40 overflow-hidden">
        <AppImage
          src={service.image}
          alt={service.title}
          className="h-full w-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
        <div className="absolute bottom-3 left-4 flex h-11 w-11 items-center justify-center rounded-lg bg-brand-600 text-white shadow-md transition-colors group-hover:bg-accent-600">
          <IconByName name={service.icon} size={20} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-accent-600">
          {service.title}
        </h3>
        {service.shortDescription ? (
          <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            {truncate(service.shortDescription, 130)}
          </p>
        ) : null}
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600">
          Learn more
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}