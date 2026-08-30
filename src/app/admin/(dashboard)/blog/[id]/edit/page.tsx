import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { asStringArray } from "@/lib/utils";
import { BlogPostForm } from "@/components/admin/forms/blog-post-form";

export const metadata: Metadata = {
  title: "Edit Post",
  robots: { index: false, follow: false },
};

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  const categories = await prisma.blogCategory.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Edit Post</h1>
        <p className="mt-1 text-sm text-slate-500">{post.title}</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
        <BlogPostForm
          id={post.id}
          categories={categories.map((category) => ({ id: category.id, name: category.name }))}
          initial={{
            title: post.title,
            slug: post.slug,
            image: post.image ?? "",
            excerpt: post.excerpt,
            content: post.content,
            author: post.author ?? "",
            categoryId: post.categoryId ?? "",
            tags: asStringArray(post.tags),
            isPublished: post.isPublished,
            publishedAt: post.publishedAt ? post.publishedAt.toISOString().slice(0, 10) : "",
            seoTitle: post.seoTitle ?? "",
            seoDescription: post.seoDescription ?? "",
          }}
        />
      </div>
    </div>
  );
}