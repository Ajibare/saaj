import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { ServiceCard } from "@/components/site/service-card";
import { CtaBanner } from "@/components/site/home/cta-banner";
import { getHomeSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Our Services",
    description:
      "Explore the integrated services offered by SAAJ Partners and Consult — design, procurement, construction, general contracting, quantity surveying, design & build, project management and consultancy.",
  };
}

export default async function ServicesPage() {
  const home = await getHomeSettings();

  let services = await prisma.service.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
    select: {
      slug: true,
      title: true,
      icon: true,
      image: true,
      shortDescription: true,
    },
  });

  if (services.length === 0) {
    services = [
      {
        slug: "design",
        title: "Design",
        icon: "drafting-compass",
        image: null,
        shortDescription: "Architectural and engineering design services tailored to your brief, site and budget.",
      },
    ];
  }

  return (
    <>
      <PageHero
        eyebrow="What We Do"
        title="Our Services"
        description="Integrated, end-to-end services across the built environment — from concept and cost planning through procurement and construction to professional project delivery."
      />
      <section className="bg-slate-50 py-20 sm:py-24">
        <div className="container-site">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>
      <CtaBanner cta={home.cta} />
    </>
  );
}