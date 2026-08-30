import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PageHero } from "@/components/site/page-hero";
import { BlogCard } from "@/components/site/blog-card";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blog & Insights",
    description:
      "Practical advice and insight from SAAJ Partners and Consult on construction, cost management, quantity surveying, project delivery and more.",
  };
}

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export default async function BlogPage({ searchParams }: Props) {
  const { category } = await searchParams;

  const categories = await prisma.blogCategory.findMany({
    orderBy: { name: "asc" },
    select: { name: true, slug: true, _count: { select: { posts: { where: { isPublished: true } } } } },
  });

  const selectedCategory =
    categories.find((c) => c.slug === category)?.slug ?? undefined;

  const posts = await prisma.blogPost.findMany({
    where: {
      isPublished: true,
      ...(selectedCategory ? { category: { slug: selectedCategory } } : {}),
    },
    orderBy: [{ publishedAt: "desc" }],
    select: {
      slug: true,
      title: true,
      excerpt: true,
      image: true,
      publishedAt: true,
      author: true,
      category: { select: { name: true, slug: true } },
    },
  });

  const baseParams = (value: string | undefined) => (value ? `?category=${value}` : "");

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Blog & Insights"
        description="Practical guidance and honest advice on planning, budgeting and delivering construction and consultancy projects well."
      />

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="container-site">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/blog"
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                !selectedCategory
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-brand-400 hover:text-brand-700"
              )}
            >
              All
            </Link>
            {categories.map((c) => {
              const active = selectedCategory === c.slug;
              return (
                <Link
                  key={c.slug}
                  href={`/blog${baseParams(c.slug)}`}
                  aria-pressed={active}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "border-brand-600 bg-brand-600 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-brand-400 hover:text-brand-700"
                  )}
                >
                  {c.name}
                  <span className="ml-1.5 text-xs opacity-70">{c._count.posts}</span>
                </Link>
              );
            })}
          </div>

          {posts.length > 0 ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <p className="text-sm text-slate-600">
                No articles published in this category yet. Check back soon.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}