import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { ContactForm } from "@/components/site/forms/contact-form";
import { getGeneralSettings } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Contact Us",
    description:
      "Get in touch with SAAJ Partners and Consult — construction, consulting and project management in Lagos, Nigeria.",
  };
}

export default async function ContactPage() {
  const general = await getGeneralSettings();

  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title="Let's Talk About Your Project"
        description="Tell us about your plans and our team will respond promptly with clear, honest guidance."
      />

      <section className="bg-slate-50 py-20 sm:py-24">
        <div className="container-site grid gap-10 lg:grid-cols-[1fr_400px]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Send Us a Message
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Fill in the form and our team will get back to you as soon as possible.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl bg-navy p-7 text-white">
              <h3 className="text-lg font-bold">Contact Details</h3>
              <ul className="mt-5 space-y-4 text-sm">
                <li>
                  <a
                    href={`tel:${general.phone}`}
                    className="flex items-start gap-3 transition-colors hover:text-brand-200"
                  >
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                    {general.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${general.email}`}
                    className="flex items-start gap-3 break-all transition-colors hover:text-brand-200"
                  >
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                    {general.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                  {general.address}
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                  Monday – Saturday: 8:00 AM – 6:00 PM
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-7">
              <h3 className="text-lg font-bold text-slate-900">Prefer a meeting?</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Book an appointment with our team to discuss your project in person or over a call.
              </p>
              <a
                href="/appointment"
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-brand-600 px-4 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:border-accent-500 hover:bg-accent-500 hover:text-white"
              >
                Book an Appointment
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}