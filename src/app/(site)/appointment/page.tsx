import type { Metadata } from "next";
import { CalendarCheck, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { AppointmentForm } from "@/components/site/forms/appointment-form";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Book an Appointment",
    description:
      "Book an appointment with SAAJ Partners and Consult to discuss your construction, consulting or project management needs.",
  };
}

export default async function AppointmentPage() {
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
        eyebrow="Appointments"
        title="Book an Appointment"
        description="Schedule a consultation with our team to discuss your project — in person or over a call."
      />

      <section className="bg-slate-50 py-20 sm:py-24">
        <div className="container-site grid gap-10 lg:grid-cols-[1fr_400px]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Appointment Details
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Choose a time that suits you and we&apos;ll confirm your booking.
            </p>
            <div className="mt-6">
              <AppointmentForm services={services} />
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl bg-navy p-7 text-white">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-600">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold">What to expect</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                {[
                  "A conversation about your project goals and constraints",
                  "Clarification of scope, budget and site details",
                  "Clear next steps and, where useful, a follow-up plan or quotation",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-7">
              <h3 className="text-lg font-bold text-slate-900">Good to know</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Appointments are usually held within 1–2 business days of your request.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}