import Link from "next/link";
import { SectionHeading } from "@/components/site/section-heading";
import type { PartnerLogo } from "@/lib/types";

type PartnersProps = {
  title?: string;
  heading?: string;
  logos: PartnerLogo[];
};

export function Partners({ title, heading, logos }: PartnersProps) {
  if (!logos.length) return null;

  const track = [...logos, ...logos];

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-site">
        <SectionHeading eyebrow={title || "Our Partners"} title={heading || "Trusted Partners"} />
      </div>
      <div className="relative mt-10 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />
        <div className="flex w-max animate-marquee gap-8 pr-8">
          {track.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="flex w-44 shrink-0 flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-5 py-6"
            >
              {logo.image ? (
                // eslint-disable-next-line @next/next/no-img-element -- partner logos may be SVGs
                <img
                  src={logo.image}
                  alt={logo.name}
                  className="h-12 w-auto max-w-full object-contain grayscale transition-all duration-300 hover:grayscale-0"
                />
              ) : (
                <span className="text-center text-sm font-bold uppercase tracking-wide text-brand-700">
                  {logo.name}
                </span>
              )}
              {logo.url ? (
                <Link
                  href={logo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 transition-colors hover:text-brand-700"
                >
                  {logo.name}
                </Link>
              ) : logo.image ? (
                <span className="text-xs text-slate-400">{logo.name}</span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
