import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Eye, Lightbulb, Rocket } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { AppImage } from "@/components/site/app-image";
import { SectionHeading } from "@/components/site/section-heading";
import { getAboutSettings, getGeneralSettings, getSeoSettings } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  return {
    title: "About Us",
    description: seo.defaultDescription,
  };
}

export default async function AboutPage() {
  const about = await getAboutSettings();
  const general = await getGeneralSettings();

  return (
    <>
      <PageHero
        eyebrow="About Us"
        title={about.overview.title}
        description="Learn about our mission, values and the integrated approach that makes SAAJ Partners and Consult a dependable construction and consultancy partner."
      />

      {/* Overview */}
      <section className="bg-white py-20 sm:py-24">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <AppImage
              src={about.overview.image}
              alt={about.overview.title}
              className="aspect-[4/3] w-full rounded-2xl border border-slate-200"
            />
          </div>
          <div>
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
              Who We Are
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {about.overview.title}
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-slate-600">
              {about.overview.content
                .split("\n")
                .filter(Boolean)
                .map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Core values */}
      <section className="bg-slate-50 py-20 sm:py-24">
        <div className="container-site">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <Rocket className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-900">Our Mission</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{about.mission}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-900">Our Vision</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{about.vision}</p>
            </div>
          </div>

          <div className="mt-16">
            <SectionHeading
              eyebrow="Core Values"
              title="The Principles That Guide Us"
              description="The standards every SAAJ partner and project is held to — from first consultation to final handover."
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {about.values.map((value) => (
                <div
                  key={value.title}
                  className="rounded-xl border border-slate-200 bg-white p-6 transition-all hover:border-brand-300 hover:shadow-lg hover:shadow-brand-600/5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-white">
                    <BadgeCheck className="h-5 w-5" />
                  </div>
                  <h4 className="mt-4 text-lg font-semibold text-slate-900">{value.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="bg-white py-20 sm:py-24">
        <div className="container-site grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
              What Makes Us Different
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Why Clients Choose SAAJ
            </h2>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-800">
              <Lightbulb className="h-4 w-4" />
              {general.companyName}
            </div>
            <ul className="mt-6 space-y-3">
              {about.differentiators.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                  <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-7 sm:p-9">
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
              Our Approach
            </span>
            <h3 className="text-xl font-bold text-slate-900">A Disciplined Delivery Philosophy</h3>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-600">
              {about.approach
                .split("\n")
                .filter(Boolean)
                .map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
            </div>
            <Link
              href="/request-a-quote"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              Let&apos;s Work Together
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}