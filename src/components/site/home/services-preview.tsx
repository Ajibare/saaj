import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { ServiceCard, type ServiceCardData } from "@/components/site/service-card";
import { truncate } from "@/lib/utils";

export function ServicesPreview({ services }: { services: ServiceCardData[] }) {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="container-site">
        <SectionHeading
          eyebrow="What We Do"
          title="Integrated Services Across the Built Environment"
          description="From concept and cost planning to construction and handover, our services cover the full project lifecycle under expert, coordinated management."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard
              key={service.slug}
              service={{
                slug: service.slug,
                title: service.title,
                icon: service.icon,
                image: service.image,
                shortDescription: service.shortDescription
                  ? truncate(service.shortDescription, 130)
                  : undefined,
              }}
            />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-lg border border-brand-600 px-6 py-3 text-sm font-semibold text-brand-700 transition-colors hover:border-accent-500 hover:bg-accent-500 hover:text-white"
          >
            View All Services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}