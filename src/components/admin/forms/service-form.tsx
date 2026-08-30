"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Wand2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { serviceSchema } from "@/lib/validators";
import { createService, updateService } from "@/lib/actions/content";
import { slugify } from "@/lib/utils";
import {
  FormField,
  FormInput,
  FormTextarea,
  SubmitButton,
} from "@/components/site/form-fields";
import { Toggle, TextArrayEditor, ObjectArrayEditor } from "@/components/admin/form-controls";

type FormValues = z.input<typeof serviceSchema>;

const DEFAULTS: Required<FormValues> = {
  title: "",
  slug: "",
  icon: "",
  image: "",
  shortDescription: "",
  description: "",
  benefits: [],
  process: [],
  isPublished: true,
  featured: false,
  sortOrder: 0,
};

export function ServiceForm({
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
    resolver: zodResolver(serviceSchema),
    defaultValues: initial ? { ...DEFAULTS, ...initial } : DEFAULTS,
  });

  async function onSubmit(data: FormValues) {
    setPending(true);
    try {
      const result = await (id ? updateService(id, data) : createService(data));
      if (!result.ok) {
        if (result.fieldErrors) {
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            setError(field as keyof FormValues, { message: messages?.[0] });
          }
        }
        toast.error(result.message ?? "Something went wrong.");
      } else {
        toast.success(result.message ?? "Service saved.");
        router.push("/admin/services");
        router.refresh();
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 lg:grid-cols-2">
        <FormField label="Title" htmlFor="svc-title" required error={errors.title?.message}>
          <FormInput
            id="svc-title"
            placeholder="e.g. Design & Build"
            aria-invalid={!!errors.title}
            {...register("title")}
          />
        </FormField>
        <FormField label="Slug" htmlFor="svc-slug" required error={errors.slug?.message}>
          <div className="flex gap-2">
            <FormInput
              id="svc-slug"
              placeholder="design-build"
              aria-invalid={!!errors.slug}
              {...register("slug")}
            />
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
        <FormField label="Icon key (optional)" htmlFor="svc-icon" error={errors.icon?.message} hint="lucide icon name, e.g. drafting-compass">
          <FormInput id="svc-icon" placeholder="drafting-compass" aria-invalid={!!errors.icon} {...register("icon")} />
        </FormField>
        <FormField label="Image URL (optional)" htmlFor="svc-image" error={errors.image?.message}>
          <FormInput id="svc-image" placeholder="/images/placeholders/service.svg" {...register("image")} />
        </FormField>
      </div>

      <FormField label="Short description" htmlFor="svc-short" required error={errors.shortDescription?.message}>
        <FormTextarea
          id="svc-short"
          rows={2}
          placeholder="One or two sentences shown on cards and listings."
          aria-invalid={!!errors.shortDescription}
          {...register("shortDescription")}
        />
      </FormField>

      <FormField label="Full description (markdown)" htmlFor="svc-desc" required error={errors.description?.message}>
        <FormTextarea
          id="svc-desc"
          rows={8}
          placeholder="Supports **markdown**."
          aria-invalid={!!errors.description}
          {...register("description")}
        />
      </FormField>

      <FormField label="Benefits checklist">
        <Controller
          name="benefits"
          control={control}
          render={({ field }) => (
            <TextArrayEditor
              value={field.value ?? []}
              onChange={field.onChange}
              placeholder="A benefit of this service"
              addLabel="Add benefit"
            />
          )}
        />
      </FormField>

      <FormField label="Process steps">
        <Controller
          name="process"
          control={control}
          render={({ field }) => (
            <ObjectArrayEditor
              value={field.value ?? []}
              onChange={field.onChange}
              addLabel="Add step"
            />
          )}
        />
      </FormField>

      <div className="grid gap-5 lg:grid-cols-3">
        <FormField label="Sort order" htmlFor="svc-order" error={errors.sortOrder?.message}>
          <FormInput id="svc-order" type="number" min={0} max={9999} {...register("sortOrder")} />
        </FormField>
      </div>

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
          href="/admin/services"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to services
        </Link>
        <SubmitButton pending={pending} className="w-auto px-8">
          {id ? "Save Changes" : "Create Service"}
        </SubmitButton>
      </div>
    </form>
  );
}