import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, User } from "lucide-react";
import { AppImage } from "@/components/site/app-image";
import { MarkdownContent } from "@/components/site/markdown-content";
import { BlogCard } from "@/components/site/blog-card";
import { CtaBanner } from "@/components/site/home/cta-banner";
import { getHomeSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";
import { asStringArray, formatDate } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: { title: true, excerpt: true, seoTitle: true, seoDescription: true },
  });
  if (!post) return { title: "Article Not Found" };
  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const home = await getHomeSettings();

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!post) {
    notFound();
  }

  const tags = asStringArray(post.tags);

  const related = await prisma.blogPost.findMany({
    where: {
      isPublished: true,
      slug: { not: post.slug },
      ...(post.categoryId ? { categoryId: post.categoryId } : {}),
    },
    orderBy: [{ publishedAt: "desc" }],
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

  return (
    <>
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="container-site max-w-4xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-800"
          >
            <ArrowLeft className="h-4 w-4" />
            All Articles
          </Link>

          <article className="mt-8">
            {post.category ? (
              <Link
                href={`/blog?category=${post.category.slug}`}
                className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700"
              >
                {post.category.name}
              </Link>
            ) : null}
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
              {post.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <User className="h-4 w-4 text-brand-600" />
                {post.author}
              </span>
              {post.publishedAt ? (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-brand-600" />
                  {formatDate(post.publishedAt)}
                </span>
              ) : null}
            </div>

            {post.image ? (
              <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200">
                <AppImage
                  src={post.image}
                  alt={post.title}
                  className="aspect-[16/9] w-full"
                />
              </div>
            ) : null}

            <div className="mt-8">
              <MarkdownContent content={post.content} />
            </div>

            {tags.length > 0 ? (
              <div className="mt-10 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Tags:
                </span>
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </article>
        </div>
      </section>

      <CtaBanner cta={home.cta} />

      {related.length > 0 ? (
        <section className="bg-white py-16 sm:py-20">
          <div className="container-site">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Related Articles
              </h2>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((relatedPost) => (
                <BlogCard key={relatedPost.slug} post={relatedPost} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}