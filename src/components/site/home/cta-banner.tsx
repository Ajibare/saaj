import Link from "next/link";
import { ArrowRight, CalendarCheck, MessageCircle } from "lucide-react";

type CtaSettings = {
  title: string;
  content: string;
  primaryLabel: string;
  secondaryLabel: string;
  tertiaryLabel: string;
};

export function CtaBanner({ cta }: { cta: CtaSettings }) {
  return (
    <section className="relative overflow-hidden bg-brand-700 py-20">
      <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-brand-500/30 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-navy/40 blur-3xl" />
      <div className="container-site relative text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{cta.title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-brand-100">
          {cta.content}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/request-a-quote"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-brand-800 shadow-lg transition-transform hover:-translate-y-0.5"
          >
            {cta.primaryLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/appointment"
            className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
          >
            <CalendarCheck className="h-4 w-4" />
            {cta.secondaryLabel}
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-transparent px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            <MessageCircle className="h-4 w-4" />
            {cta.tertiaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}