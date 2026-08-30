import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { truncate } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/admin-ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { CategoriesManager } from "@/components/admin/categories-manager";
import { deleteBlogPost } from "@/lib/actions/content";

export const metadata: Metadata = {
  title: "Blog",
  robots: { index: false, follow: false },
};

export default async function AdminBlogPage() {
  const [posts, categories] = await Promise.all([
    prisma.blogPost.findMany({
      orderBy: { publishedAt: "desc" },
      include: { category: true },
    }),
    prisma.blogCategory.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { posts: true } } },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Blog</h1>
          <p className="mt-1 text-sm text-slate-500">
            {posts.length} post{posts.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" />
          Add Post
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {posts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <p className="text-sm font-medium text-slate-600">No posts yet</p>
              <p className="mt-1 text-xs text-slate-400">Write your first blog post to get started.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {posts.map((post) => (
                <li key={post.id} className="rounded-xl border border-slate-200 bg-white px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-brand-700">
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString("en-NG", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "Unpublished"}
                      </p>
                      <h2 className="mt-0.5 truncate text-base font-bold text-slate-900">{post.title}</h2>
                      <p className="mt-1 text-sm text-slate-600">{truncate(post.excerpt, 120)}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={post.isPublished ? "published" : "unpublished"} />
                      </div>
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/blog/${post.id}/edit`}
                          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Link>
                        <DeleteButton id={post.id} action={deleteBlogPost} confirmMessage="Delete this post permanently?" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span>{post.author}</span>
                    {post.category ? (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5">{post.category.name}</span>
                      </>
                    ) : null}
                    {post.tags ? (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{JSON.stringify(post.tags).slice(0, 60)}</span>
                      </>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="lg:col-span-1">
          <CategoriesManager
            categories={categories.map((category) => ({
              id: category.id,
              name: category.name,
              slug: category.slug,
              postCount: category._count.posts,
            }))}
          />
        </div>
      </div>
    </div>
  );
}