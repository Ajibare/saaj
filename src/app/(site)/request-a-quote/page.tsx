import type { Metadata } from "next";
import { ClipboardList, FileQuestion, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { QuoteForm } from "@/components/site/forms/quote-form";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Request a Quote",
    description:
      "Request a detailed, honest quotation from SAAJ Partners and Consult for your construction, consulting or project management project.",
  };
}

export default async function RequestQuotePage() {
  let services: string[] = [];
  try {
    const rows = await prisma.service.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
      select: { title: true },
    });
    services = rows.map((service) => service.title);
  } catch {
    services = [];
  }

  return (
    <>
      <PageHero
        eyebrow="Request a Quote"
        title="Get a Clear, Honest Quote"
        description="Tell us about your project — the more detail you provide, the more accurate and useful your quotation will be."
      />

      <section className="bg-slate-50 py-20 sm:py-24">
        <div className="container-site grid gap-10 lg:grid-cols-[1fr_400px]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Project Details
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Fields marked with an asterisk (*) are required.
            </p>
            <div className="mt-6">
              <QuoteForm services={services} />
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl bg-navy p-7 text-white">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-600">
                <ClipboardList className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold">What happens next?</h3>
              <ol className="mt-4 list-decimal space-y-2.5 pl-5 text-sm text-slate-300">
                <li>We review your project details.</li>
                <li>Our team may reach out to clarify scope or schedule a site visit.</li>
                <li>You receive a detailed written quotation and plan.</li>
              </ol>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-7">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                <div>
                  <h3 className="font-semibold text-slate-900">No hidden costs</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    Our quotations are transparent and based on careful measurement and analysis.
                  </p>
                </div>
              </div>
              <div className="mt-5 flex items-start gap-3">
                <FileQuestion className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                <div>
                  <h3 className="font-semibold text-slate-900">Attach your documents</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    Upload designs, drawings or bills of materials to get a more accurate estimate.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}