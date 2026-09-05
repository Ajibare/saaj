"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Wand2, ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { PROJECT_CATEGORIES, PROJECT_STATUSES } from "@/lib/constants";
import { projectSchema } from "@/lib/validators";
import { createProject, updateProject } from "@/lib/actions/content";
import { slugify } from "@/lib/utils";
import {
  FormField,
  FormInput,
  FormSelect,
  FormTextarea,
  SubmitButton,
} from "@/components/site/form-fields";
import { Toggle } from "@/components/admin/form-controls";
import { ImagePicker } from "@/components/admin/image-picker";

type FormValues = z.input<typeof projectSchema>;

const DEFAULTS: Required<FormValues> = {
  name: "",
  slug: "",
  location: "",
  description: "",
  category: PROJECT_CATEGORIES[0],
  year: "",
  client: "",
  status: PROJECT_STATUSES[0].value,
  image: "",
  gallery: [],
  featured: false,
  isPublished: true,
};

export function ProjectForm({
  id,
  initial,
}: {
  id?: string;
  initial?: Partial<FormValues>;
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
    resolver: zodResolver(projectSchema),
    defaultValues: initial ? { ...DEFAULTS, ...initial } : DEFAULTS,
  });

  async function onSubmit(data: FormValues) {
    setPending(true);
    try {
      const result = await (id ? updateProject(id, data) : createProject(data));
      if (!result.ok) {
        if (result.fieldErrors) {
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            setError(field as keyof FormValues, { message: messages?.[0] });
          }
        }
        toast.error(result.message ?? "Something went wrong.");
      } else {
        toast.success(result.message ?? "Project saved.");
        router.push("/admin/projects");
        router.refresh();
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 lg:grid-cols-2">
        <FormField label="Project name" htmlFor="prj-name" required error={errors.name?.message}>
          <FormInput id="prj-name" placeholder="e.g. Lekki Continental Residence" aria-invalid={!!errors.name} {...register("name")} />
        </FormField>
        <FormField label="Slug" htmlFor="prj-slug" required error={errors.slug?.message}>
          <div className="flex gap-2">
            <FormInput id="prj-slug" placeholder="lekki-continental-residence" aria-invalid={!!errors.slug} {...register("slug")} />
            <button
              type="button"
              onClick={() => setValue("slug", slugify(getValues("name")), { shouldValidate: true })}
              className="shrink-0 rounded-lg border border-slate-300 px-3 text-sm font-medium text-slate-600 transition-colors hover:border-brand-400 hover:text-brand-700"
              title="Generate slug from name"
            >
              <Wand2 className="h-4 w-4" />
            </button>
          </div>
        </FormField>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <FormField label="Location" htmlFor="prj-location" required error={errors.location?.message}>
          <FormInput id="prj-location" placeholder="e.g. Lekki, Lagos" aria-invalid={!!errors.location} {...register("location")} />
        </FormField>
        <FormField label="Category" htmlFor="prj-category" required error={errors.category?.message}>
          <FormSelect id="prj-category" aria-invalid={!!errors.category} {...register("category")}>
            {PROJECT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </FormSelect>
        </FormField>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <FormField label="Status" htmlFor="prj-status" required error={errors.status?.message}>
          <FormSelect id="prj-status" aria-invalid={!!errors.status} {...register("status")}>
            {PROJECT_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </FormSelect>
        </FormField>
        <FormField label="Year (optional)" htmlFor="prj-year" error={errors.year?.message}>
          <FormInput id="prj-year" type="number" min={1950} max={2100} placeholder="2026" aria-invalid={!!errors.year} {...register("year")} />
        </FormField>
        <FormField label="Client (optional)" htmlFor="prj-client" error={errors.client?.message}>
          <FormInput id="prj-client" placeholder="Client name" {...register("client")} />
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

      <FormField label="Description" htmlFor="prj-desc" required error={errors.description?.message}>
        <FormTextarea id="prj-desc" rows={7} placeholder="Overview of the project…" aria-invalid={!!errors.description} {...register("description")} />
      </FormField>

      <FormField label="Gallery">
        <Controller
          name="gallery"
          control={control}
          render={({ field }) => (
            <GalleryEditor
              items={field.value ?? []}
              onChange={field.onChange}
            />
          )}
        />
      </FormField>

      <div className="flex flex-wrap items-start gap-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
        <Controller
          name="isPublished"
          control={control}
          render={({ field }) => (
            <Toggle checked={field.value ?? true} onChange={field.onChange} label="Published" />
          )}
        />
        <Controller
          name="featured"
          control={control}
          render={({ field }) => (
            <Toggle
              checked={field.value ?? false}
              onChange={field.onChange}
              label="Featured on homepage"
            />
          )}
        />
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-5">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to projects
        </Link>
        <SubmitButton pending={pending} className="w-auto px-8">
          {id ? "Save Changes" : "Create Project"}
        </SubmitButton>
      </div>
    </form>
  );
}

function GalleryEditor({
  items,
  onChange,
}: {
  items: string[];
  onChange: (items: string[]) => void;
}) {
  function update(index: number, value: string) {
    const next = [...items];
    next[index] = value;
    onChange(next);
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Image {index + 1}
            </span>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              aria-label="Remove image"
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-2">
            <ImagePicker
              value={item}
              onChange={(url) => update(index, url)}
              placeholder="Paste an image URL, upload, or pick from the media library"
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-brand-400 hover:text-brand-700"
      >
        <Plus className="h-4 w-4" />
        Add gallery image
      </button>
    </div>
  );
}