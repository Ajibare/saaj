import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { BlogPostForm } from "@/components/admin/forms/blog-post-form";

export const metadata: Metadata = {
  title: "New Post",
  robots: { index: false, follow: false },
};

export default async function NewBlogPostPage() {
  const categories = await prisma.blogCategory.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Add Post</h1>
        <p className="mt-1 text-sm text-slate-500">
          Create a blog post. Content supports markdown.
        </p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
        <BlogPostForm
          categories={categories.map((category) => ({ id: category.id, name: category.name }))}
        />
      </div>
    </div>
  );
}