"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { testimonialSchema } from "@/lib/validators";
import { createTestimonial, updateTestimonial } from "@/lib/actions/content";
import {
  FormField,
  FormInput,
  FormTextarea,
  SubmitButton,
} from "@/components/site/form-fields";
import { Toggle } from "@/components/admin/form-controls";
import { ImagePicker } from "@/components/admin/image-picker";

type FormValues = z.input<typeof testimonialSchema>;

const DEFAULTS: Required<FormValues> = {
  name: "",
  role: "",
  company: "",
  content: "",
  rating: 5,
  image: "",
  isPublished: true,
  isDemo: false,
  sortOrder: 0,
};

export function TestimonialForm({
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
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: { ...DEFAULTS, ...initial },
  });

  async function onSubmit(data: FormValues) {
    setPending(true);
    try {
      const result = await (id ? updateTestimonial(id, data) : createTestimonial(data));
      if (!result.ok) {
        if (result.fieldErrors) {
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            setError(field as keyof FormValues, { message: messages?.[0] });
          }
        }
        toast.error(result.message ?? "Something went wrong.");
      } else {
        toast.success(result.message ?? "Testimonial saved.");
        router.push("/admin/testimonials");
        router.refresh();
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 lg:grid-cols-2">
        <FormField label="Full name" htmlFor="t-name" required error={errors.name?.message}>
          <FormInput id="t-name" placeholder="Client name" aria-invalid={!!errors.name} {...register("name")} />
        </FormField>
        <FormField label="Role (optional)" htmlFor="t-role" error={errors.role?.message}>
          <FormInput id="t-role" placeholder="e.g. Managing Director" {...register("role")} />
        </FormField>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <FormField label="Company (optional)" htmlFor="t-company" error={errors.company?.message}>
          <FormInput id="t-company" placeholder="Company name" {...register("company")} />
        </FormField>
        <FormField label="Rating" htmlFor="t-rating" error={errors.rating?.message}>
          <select
            id="t-rating"
            aria-invalid={!!errors.rating}
            {...register("rating", { valueAsNumber: true })}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-700"
          >
            {[5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>
                {"★".repeat(rating)}
                {"☆".repeat(5 - rating)} ({rating}/5)
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField label="Testimonial" htmlFor="t-content" required error={errors.content?.message}>
        <FormTextarea id="t-content" rows={5} placeholder="What did the client say?" aria-invalid={!!errors.content} {...register("content")} />
      </FormField>

      <div className="grid gap-5 lg:grid-cols-2">
        <FormField label="Photo (optional)" error={errors.image?.message}>
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <ImagePicker value={field.value ?? ""} onChange={field.onChange} placeholder="Paste a photo URL, upload, or pick from the media library" />
            )}
          />
        </FormField>
        <FormField label="Sort order" htmlFor="t-order" error={errors.sortOrder?.message}>
          <FormInput id="t-order" type="number" min={0} max={9999} {...register("sortOrder")} />
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
          name="isDemo"
          control={control}
          render={({ field }) => (
            <Toggle
              checked={field.value ?? false}
              onChange={field.onChange}
              label="Sample/demo content"
            />
          )}
        />
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-5">
        <Link
          href="/admin/testimonials"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to testimonials
        </Link>
        <SubmitButton pending={pending} className="w-auto px-8">
          {id ? "Save Changes" : "Create Testimonial"}
        </SubmitButton>
      </div>
    </form>
  );
}