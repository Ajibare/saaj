import type { Metadata } from "next";
import { Hero } from "@/components/site/home/hero";
import { Intro } from "@/components/site/home/intro";
import { WhyChooseUs } from "@/components/site/home/why-choose-us";
import { OnSiteBand } from "@/components/site/home/on-site-band";
import { Stats } from "@/components/site/home/stats";
import { ServicesPreview } from "@/components/site/home/services-preview";
import { ProjectsPreview } from "@/components/site/home/projects-preview";
import { Process } from "@/components/site/home/process";
import { Partners } from "@/components/site/home/partners";
import { Testimonials } from "@/components/site/home/testimonials";
import { BlogPreview } from "@/components/site/home/blog-preview";
import { CtaBanner } from "@/components/site/home/cta-banner";
import { getHomeSettings, getSeoSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  return {
    title: seo.defaultTitle,
    description: seo.defaultDescription,
  };
}

export default async function HomePage() {
  const home = await getHomeSettings();

  let featuredServices: Awaited<ReturnType<typeof getFeaturedServices>> = [];
  let featuredProjects: Awaited<ReturnType<typeof getFeaturedProjects>> = [];
  let testimonials: Awaited<ReturnType<typeof getTestimonials>> = [];
  let latestPosts: Awaited<ReturnType<typeof getLatestPosts>> = [];

  try {
    [featuredServices, featuredProjects, testimonials, latestPosts] = await Promise.all([
      getFeaturedServices(),
      getFeaturedProjects(),
      getTestimonials(),
      getLatestPosts(),
    ]);
  } catch {
    // DB unavailable → render sections from settings only
  }

  return (
    <>
      <Hero hero={home.hero} />
      <Intro intro={home.intro} />
      <WhyChooseUs
        title={home.whyChooseUs.title}
        heading={home.whyChooseUs.heading}
        items={home.whyChooseUs.items}
      />
      <Stats title={home.stats.title} heading={home.stats.heading} items={home.stats.items} />
      <OnSiteBand />
      <ServicesPreview services={featuredServices} />
      <ProjectsPreview projects={featuredProjects} />
      <Process title={home.process.title} heading={home.process.heading} steps={home.process.steps} />
      <Partners
        title={home.partners?.title}
        heading={home.partners?.heading}
        logos={home.partners?.logos ?? []}
      />
      <Testimonials title="Testimonials" heading="What Our Clients Say" items={testimonials} />
      <BlogPreview posts={latestPosts} />
      <CtaBanner cta={home.cta} />
    </>
  );
}

async function getFeaturedServices() {
  return prisma.service.findMany({
    where: { isPublished: true, featured: true },
    orderBy: { sortOrder: "asc" },
    take: 6,
    select: {
      slug: true,
      title: true,
      icon: true,
      image: true,
      shortDescription: true,
    },
  });
}

async function getFeaturedProjects() {
  return prisma.project.findMany({
    where: { isPublished: true, featured: true },
    orderBy: { createdAt: "desc" },
    take: 4,
    select: {
      slug: true,
      name: true,
      category: true,
      location: true,
      status: true,
      image: true,
    },
  });
}

async function getTestimonials() {
  return prisma.testimonial.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    take: 3,
    select: {
      id: true,
      name: true,
      role: true,
      company: true,
      content: true,
      rating: true,
    },
  });
}

async function getLatestPosts() {
  return prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    take: 3,
    select: {
      slug: true,
      title: true,
      excerpt: true,
      image: true,
      publishedAt: true,
      author: true,
      category: { select: { name: true } },
    },
  });
}