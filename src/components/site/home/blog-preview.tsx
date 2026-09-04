import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { BlogCard, type BlogCardData } from "@/components/site/blog-card";

export function BlogPreview({ posts }: { posts: BlogCardData[] }) {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="container-site">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            align="left"
            eyebrow="Insights"
            title="From Our Blog"
            description="Practical guidance on planning, budgeting and delivering construction and consultancy projects."
          />
          <Link
            href="/blog"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-brand-600 px-5 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:border-accent-500 hover:bg-accent-500 hover:text-white"
          >
            View All Articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}