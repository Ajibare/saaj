"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Wand2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { blogPostSchema } from "@/lib/validators";
import { createBlogPost, updateBlogPost } from "@/lib/actions/content";
import { slugify } from "@/lib/utils";
import {
  FormField,
  FormInput,
  FormSelect,
  FormTextarea,
  SubmitButton,
} from "@/components/site/form-fields";
import { Toggle, TextArrayEditor } from "@/components/admin/form-controls";
import { ImagePicker } from "@/components/admin/image-picker";

type FormValues = z.input<typeof blogPostSchema>;

type CategoryOption = { id: string; name: string };

const DEFAULTS: Required<FormValues> = {
  title: "",
  slug: "",
  image: "",
  excerpt: "",
  content: "",
  author: "SAAJ Partners and Consult",
  categoryId: "",
  tags: [],
  isPublished: true,
  publishedAt: "",
  seoTitle: "",
  seoDescription: "",
};

export function BlogPostForm({
  id,
  initial,
  categories,
}: {
  id?: string;
  initial?: Partial<FormValues>;
  categories: CategoryOption[];
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: { ...DEFAULTS, ...initial },
  });

  async function onSubmit(data: FormValues) {
    setPending(true);
    try {
      const result = await (id ? updateBlogPost(id, data) : createBlogPost(data));
      if (!result.ok) {
        if (result.fieldErrors) {
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            setError(field as keyof FormValues, { message: messages?.[0] });
          }
        }
        toast.error(result.message ?? "Something went wrong.");
      } else {
        toast.success(result.message ?? "Post saved.");
        router.push("/admin/blog");
        router.refresh();
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 lg:grid-cols-2">
        <FormField label="Title" htmlFor="post-title" required error={errors.title?.message}>
          <FormInput id="post-title" placeholder="Post title" aria-invalid={!!errors.title} {...register("title")} />
        </FormField>
        <FormField label="Slug" htmlFor="post-slug" required error={errors.slug?.message}>
          <div className="flex gap-2">
            <FormInput id="post-slug" placeholder="why-cost-planning-matters" aria-invalid={!!errors.slug} {...register("slug")} />
            <button
              type="button"
              onClick={() => setValue("slug", slugify(getValues("title")), { shouldValidate: true })}
              className="shrink-0 rounded-lg border border-slate-300 px-3 text-sm font-medium text-slate-600 transition-colors hover:border-brand-400 hover:text-brand-700"
              title="Generate slug from title"
            >
              <Wand2 className="h-4 w-4" />
            </button>
          </div>
        </FormField>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <FormField label="Category" htmlFor="post-category" error={errors.categoryId?.message}>
          <FormSelect id="post-category" aria-invalid={!!errors.categoryId} {...register("categoryId")}>
            <option value="">Uncategorized</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </FormSelect>
        </FormField>
        <FormField label="Author" htmlFor="post-author" error={errors.author?.message}>
          <FormInput id="post-author" placeholder="SAAJ Partners and Consult" aria-invalid={!!errors.author} {...register("author")} />
        </FormField>
      </div>

      <FormField label="Cover image (optional)" error={errors.image?.message}>
        <Controller
          name="image"
          control={control}
          render={({ field }) => (
            <ImagePicker value={field.value ?? ""} onChange={field.onChange} placeholder="Paste an image URL, upload, or pick from the media library" />
          )}
        />
      </FormField>

      <FormField label="Excerpt" htmlFor="post-excerpt" required error={errors.excerpt?.message}>
        <FormTextarea id="post-excerpt" rows={2} placeholder="Short summary shown on blog cards and listings." aria-invalid={!!errors.excerpt} {...register("excerpt")} />
      </FormField>

      <FormField label="Content (markdown)" htmlFor="post-content" required error={errors.content?.message}>
        <FormTextarea id="post-content" rows={14} placeholder="Supports **markdown**, images, headings and lists." aria-invalid={!!errors.content} {...register("content")} />
      </FormField>

      <FormField label="Tags">
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <TextArrayEditor
              value={field.value ?? []}
              onChange={field.onChange}
              placeholder="e.g. cost-management"
              addLabel="Add tag"
            />
          )}
        />
      </FormField>

      <div className="grid gap-5 lg:grid-cols-2">
        <FormField
          label="Publish date (optional)"
          htmlFor="post-date"
          error={errors.publishedAt?.message}
          hint="Defaults to now when published."
        >
          <FormInput id="post-date" type="date" {...register("publishedAt")} />
        </FormField>
        <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <Controller
            name="isPublished"
            control={control}
            render={({ field }) => (
              <Toggle checked={field.value ?? true} onChange={field.onChange} label="Published" />
            )}
          />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <FormField label="SEO title (optional)" htmlFor="post-seo-title" error={errors.seoTitle?.message}>
          <FormInput id="post-seo-title" maxLength={70} placeholder="Optimised title for search engines" {...register("seoTitle")} />
        </FormField>
        <FormField label="SEO description (optional)" htmlFor="post-seo-desc" error={errors.seoDescription?.message}>
          <FormInput id="post-seo-desc" maxLength={200} placeholder="Optimised meta description" {...register("seoDescription")} />
        </FormField>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-5">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to blog
        </Link>
        <SubmitButton pending={pending} className="w-auto px-8">
          {id ? "Save Changes" : "Create Post"}
        </SubmitButton>
      </div>
    </form>
  );
}