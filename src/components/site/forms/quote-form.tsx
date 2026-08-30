"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FileText, X } from "lucide-react";
import type { z } from "zod";
import { ESTIMATED_BUDGETS, PROJECT_TYPES } from "@/lib/constants";
import { quoteRequestFormSchema, type ActionResult } from "@/lib/validators";
import { submitQuote, type QuoteInput } from "@/lib/actions/forms";
import {
  FormField,
  FormInput,
  FormSelect,
  FormTextarea,
  SubmitButton,
} from "@/components/site/form-fields";

type UploadResult = { ok: boolean; url?: string; name?: string; message?: string };
type QuoteFormValues = z.input<typeof quoteRequestFormSchema>;

export function QuoteForm({ services }: { services: string[] }) {
  const [isPending, startTransition] = useTransition();
  const [file, setFile] = useState<{ name: string; file: File } | null>(null);
  const [inputKey, setInputKey] = useState(0);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteRequestFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      projectType: "",
      projectLocation: "",
      estimatedBudget: "",
      preferredStartDate: "",
      serviceRequired: "",
      projectDescription: "",
    },
  });

  async function uploadFile(selected: File): Promise<UploadResult> {
    const body = new FormData();
    body.append("file", selected);
    try {
      const response = await fetch("/api/uploads", { method: "POST", body });
      return (await response.json()) as UploadResult;
    } catch {
      return { ok: false, message: "Upload failed. Please try again." };
    }
  }

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (!selected) return;
    setFile({ name: selected.name, file: selected });
  }

  function onSubmit(data: QuoteFormValues) {
    startTransition(async () => {
      const payload: QuoteInput = { ...data };
      if (file) {
        const uploaded = await uploadFile(file.file);
        if (!uploaded.ok || !uploaded.url) {
          toast.error(uploaded.message ?? "Could not upload your attachment.");
          return;
        }
        payload.attachmentUrl = uploaded.url;
        payload.attachmentName = uploaded.name ?? file.name;
      }

      const result = (await submitQuote(payload)) as ActionResult;
      if (result.ok) {
        toast.success(result.message ?? "Quote request submitted.");
        reset();
        setFile(null);
        setInputKey((key) => key + 1);
      } else {
        if (result.fieldErrors) {
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            setError(field as keyof QuoteFormValues, { message: messages?.[0] });
          }
        }
        toast.error(result.message ?? "Could not submit your request.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Full name" htmlFor="quote-name" required error={errors.name?.message}>
          <FormInput
            id="quote-name"
            placeholder="Your full name"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
        </FormField>
        <FormField label="Email address" htmlFor="quote-email" required error={errors.email?.message}>
          <FormInput
            id="quote-email"
            type="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
        </FormField>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Phone (optional)" htmlFor="quote-phone" error={errors.phone?.message}>
          <FormInput
            id="quote-phone"
            type="tel"
            placeholder="+234 803 000 0000"
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
        </FormField>
        <FormField label="Company (optional)" htmlFor="quote-company" error={errors.company?.message}>
          <FormInput id="quote-company" placeholder="Company name" {...register("company")} />
        </FormField>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Project type (optional)" htmlFor="quote-type" error={errors.projectType?.message}>
          <FormSelect
            id="quote-type"
            aria-invalid={!!errors.projectType}
            {...register("projectType")}
          >
            <option value="">Select project type</option>
            {PROJECT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </FormSelect>
        </FormField>
        <FormField label="Estimated budget (optional)" htmlFor="quote-budget" error={errors.estimatedBudget?.message}>
          <FormSelect
            id="quote-budget"
            aria-invalid={!!errors.estimatedBudget}
            {...register("estimatedBudget")}
          >
            <option value="">Select budget range</option>
            {ESTIMATED_BUDGETS.map((budget) => (
              <option key={budget} value={budget}>
                {budget}
              </option>
            ))}
          </FormSelect>
        </FormField>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Project location (optional)" htmlFor="quote-location" error={errors.projectLocation?.message}>
          <FormInput
            id="quote-location"
            placeholder="City, State"
            aria-invalid={!!errors.projectLocation}
            {...register("projectLocation")}
          />
        </FormField>
        <FormField label="Preferred start date (optional)" htmlFor="quote-date" error={errors.preferredStartDate?.message}>
          <FormInput
            id="quote-date"
            type="date"
            aria-invalid={!!errors.preferredStartDate}
            {...register("preferredStartDate")}
          />
        </FormField>
      </div>
      <FormField label="Service required (optional)" htmlFor="quote-service" error={errors.serviceRequired?.message}>
        <FormSelect
          id="quote-service"
          aria-invalid={!!errors.serviceRequired}
          {...register("serviceRequired")}
        >
          <option value="">Select a service</option>
          {services.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </FormSelect>
      </FormField>
      <FormField label="Project description" htmlFor="quote-desc" required error={errors.projectDescription?.message}>
        <FormTextarea
          id="quote-desc"
          rows={6}
          placeholder="Describe your project — scope, size, location details, and what you need from us."
          aria-invalid={!!errors.projectDescription}
          {...register("projectDescription")}
        />
      </FormField>

      <FormField
        label="Attachment (optional)"
        htmlFor="quote-file"
        hint="Designs, drawings, BOM or briefs (max 10 MB). PDF, images, Word, Excel or ZIP."
      >
        <input
          id="quote-file"
          key={inputKey}
          type="file"
          onChange={onFileChange}
          className="block w-full text-sm text-slate-600 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-brand-700 hover:file:bg-brand-100"
        />
        {file ? (
          <div className="mt-2 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <span className="inline-flex min-w-0 items-center gap-2">
              <FileText className="h-4 w-4 shrink-0 text-brand-600" />
              <span className="truncate">{file.name}</span>
            </span>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setInputKey((key) => key + 1);
              }}
              aria-label="Remove attachment"
              className="shrink-0 rounded p-1 text-slate-400 transition-colors hover:text-rose-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </FormField>

      <SubmitButton pending={isPending}>Request Quote</SubmitButton>
    </form>
  );
}