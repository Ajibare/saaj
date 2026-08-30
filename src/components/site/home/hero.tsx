import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppImage } from "@/components/site/app-image";
import type { HeroSettings } from "@/lib/types";

export function Hero({ hero }: { hero: HeroSettings }) {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <AppImage
        src={hero.image}
        alt=""
        className="absolute inset-0 h-full w-full opacity-[0.12]"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/95 to-brand-950" />
      <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-600/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl" />

      <div className="container-site relative flex min-h-[560px] flex-col justify-center py-24 lg:min-h-[620px]">
        <span className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-200">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
          Design • Construction • Consultancy
        </span>
        <h1 className="max-w-3xl animate-fade-up text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          {hero.title}
        </h1>
        <p className="mt-6 max-w-2xl animate-fade-up text-lg leading-relaxed text-slate-300">
          {hero.subtitle}
        </p>
        <div className="mt-10 flex flex-wrap gap-4 animate-fade-up">
          <Link
            href="/request-a-quote"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition-colors hover:bg-brand-500"
          >
            {hero.primaryCtaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
          >
            {hero.secondaryCtaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}