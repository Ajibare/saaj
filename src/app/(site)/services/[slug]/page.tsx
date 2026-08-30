import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BadgeCheck } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { AppImage } from "@/components/site/app-image";
import { MarkdownContent } from "@/components/site/markdown-content";
import { CtaBanner } from "@/components/site/home/cta-banner";
import { getHomeSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";
import { asArray } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = await prisma.service.findUnique({
    where: { slug },
    select: { title: true, shortDescription: true },
  });
  if (!service) return { title: "Service Not Found" };
  return {
    title: service.title,
    description: service.shortDescription,
  };
}

export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params;
  const home = await getHomeSettings();

  const service = await prisma.service.findUnique({ where: { slug } });
  if (!service) {
    notFound();
  }

  const benefits = asArray<string>(service.benefits, []);
  const process = asArray<{ title: string; description: string }>(service.process, []);

  const otherServices = await prisma.service.findMany({
    where: { isPublished: true, slug: { not: service.slug } },
    orderBy: { sortOrder: "asc" },
    take: 3,
    select: { slug: true, title: true },
  });

  return (
    <>
      <PageHero
        eyebrow="Our Service"
        title={service.title}
        description={service.shortDescription}
        image={service.image}
      />

      <section className="bg-white py-20 sm:py-24">
        <div className="container-site grid gap-14 lg:grid-cols-[1fr_300px]">
          {/* Main content */}
          <div className="min-w-0">
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-800"
            >
              <ArrowLeft className="h-4 w-4" />
              All Services
            </Link>

            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200">
              <AppImage
                src={service.image}
                alt={service.title}
                className="aspect-[16/7] w-full"
              />
            </div>

            <div className="mt-10">
              <MarkdownContent content={service.description} />
            </div>

            {benefits.length > 0 ? (
              <div className="mt-12">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Key Benefits
                </h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700"
                    >
                      <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {process.length > 0 ? (
              <div className="mt-14">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  How It Works
                </h2>
                <div className="mt-6 space-y-0">
                  {process.map((step, index) => (
                    <div key={step.title} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                          {index + 1}
                        </span>
                        {index < process.length - 1 ? (
                          <span className="w-px flex-1 bg-slate-200" />
                        ) : null}
                      </div>
                      <div className="pb-8">
                        <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
                Other Services
              </h3>
              <ul className="mt-4 space-y-2">
                {otherServices.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/services/${s.slug}`}
                      className="group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-700"
                    >
                      {s.title}
                      <ArrowRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-brand-600" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-navy p-6 text-white">
              <h3 className="text-lg font-bold">Ready to get started?</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Tell us about your project and get a clear, honest plan and quotation from our team.
              </p>
              <Link
                href="/request-a-quote"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
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