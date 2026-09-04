import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AppImage } from "@/components/site/app-image";
import { formatDate, truncate } from "@/lib/utils";

export type BlogCardData = {
  slug: string;
  title: string;
  excerpt?: string;
  image?: string | null;
  publishedAt?: Date | null;
  author?: string;
  category?: { name: string } | null;
};

export function BlogCard({ post }: { post: BlogCardData }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-600/5"
    >
      <div className="relative h-48 overflow-hidden">
        <AppImage
          src={post.image}
          alt={post.title}
          className="h-full w-full transition-transform duration-500 group-hover:scale-105"
        />
        {post.category ? (
          <span className="absolute left-4 top-4 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
            {post.category.name}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {post.publishedAt ? formatDate(post.publishedAt) : ""}
        </p>
        <h3 className="mt-2 text-lg font-semibold leading-snug text-slate-900 transition-colors group-hover:text-accent-600">
          {post.title}
        </h3>
        {post.excerpt ? (
          <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            {truncate(post.excerpt, 120)}
          </p>
        ) : null}
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600">
          Read article
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}