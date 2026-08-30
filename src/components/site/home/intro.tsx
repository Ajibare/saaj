import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { AppImage } from "@/components/site/app-image";

type IntroSettings = {
  title: string;
  content: string;
  image: string;
  ctaLabel: string;
};

export function Intro({ intro }: { intro: IntroSettings }) {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative order-2 lg:order-1">
          <AppImage
            src={intro.image}
            alt="About SAAJ Partners and Consult"
            className="aspect-[4/3] w-full rounded-2xl border border-slate-200"
          />
          <div className="absolute -bottom-6 -right-6 hidden rounded-xl bg-brand-600 px-6 py-5 text-white shadow-xl sm:block">
            <p className="text-3xl font-bold">2026</p>
            <p className="text-sm font-medium text-brand-100">Founded in Lagos, Nigeria</p>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
            Who We Are
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {intro.title}
          </h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-slate-600">
            {intro.content
              .split("\n")
              .filter(Boolean)
              .map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "Integrated design-to-delivery capability",
              "Cost & quality led by professionals",
              "Honest advice and clear reporting",
              "Built-environment expertise you can trust",
            ].map((item) => (
              <li key={item} className="inline-flex items-start gap-2 text-sm font-medium text-slate-700">
                <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                {item}
              </li>
            ))}
          </ul>
          <Link
            href="/about"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            {intro.ctaLabel || "About Us"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}