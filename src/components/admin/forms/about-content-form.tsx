"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { aboutSettingsSchema } from "@/lib/validators";
import { updateAboutSettings } from "@/lib/actions/settings";
import type { AboutSettings } from "@/lib/types";
import {
  FormField,
  FormInput,
  FormTextarea,
} from "@/components/site/form-fields";
import { ImagePicker } from "@/components/admin/image-picker";

type FormValues = z.input<typeof aboutSettingsSchema>;

export function AboutContentForm({ initial }: { initial: AboutSettings }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const [form, setForm] = useState<FormValues>({
    overview: {
      title: initial.overview.title,
      content: initial.overview.content,
      image: initial.overview.image ?? "",
    },
    mission: initial.mission,
    vision: initial.vision,
    values: initial.values.map((v) => ({ title: v.title, description: v.description })),
    differentiators: [...initial.differentiators],
    approach: initial.approach,
  });

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function submitAll() {
    setPending(true);
    try {
      const result = await updateAboutSettings(form);
      if (!result.ok) {
        toast.error(result.message ?? "Something went wrong.");
      } else {
        toast.success("About content saved.");
        router.refresh();
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Section label="Company Overview">
        <FormField label="Title" required>
          <FormInput
            value={form.overview.title}
            onChange={(e) => set("overview", { ...form.overview, title: e.target.value })}
          />
        </FormField>
        <FormField label="Content" required>
          <FormTextarea
            rows={8}
            value={form.overview.content}
            onChange={(e) => set("overview", { ...form.overview, content: e.target.value })}
          />
        </FormField>
        <FormField label="Image">
          <ImagePicker
            value={form.overview.image}
            onChange={(url) => set("overview", { ...form.overview, image: url })}
          />
        </FormField>
      </Section>

      {/* Mission / Vision */}
      <Section label="Mission & Vision">
        <FormField label="Mission" required>
          <FormTextarea
            rows={4}
            value={form.mission}
            onChange={(e) => set("mission", e.target.value)}
          />
        </FormField>
        <FormField label="Vision" required>
          <FormTextarea
            rows={4}
            value={form.vision}
            onChange={(e) => set("vision", e.target.value)}
          />
        </FormField>
      </Section>

      {/* Values */}
      <Section label="Core Values">
        <p className="text-xs text-slate-500">Each value has a title and a short description.</p>
        <ValuesEditor
          values={form.values}
          onChange={(values) => set("values", values)}
        />
      </Section>

      {/* Differentiators */}
      <Section label="What Makes Us Different">
        <p className="text-xs text-slate-500">
          Bullet points shown in the &quot;Why Clients Choose SAAJ&quot; list.
        </p>
        <DifferentiatorsEditor
          items={form.differentiators}
          onChange={(items) => set("differentiators", items)}
        />
      </Section>

      {/* Approach */}
      <Section label="Our Approach">
        <FormField label="Approach" required>
          <FormTextarea
            rows={4}
            value={form.approach}
            onChange={(e) => set("approach", e.target.value)}
          />
        </FormField>
      </Section>

      <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-5">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
        <button
          type="button"
          onClick={submitAll}
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          ) : null}
          Save all changes
        </button>
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
      <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </h2>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function ValuesEditor({
  values,
  onChange,
}: {
  values: { title: string; description: string }[];
  onChange: (values: { title: string; description: string }[]) => void;
}) {
  function update(index: number, patch: Partial<{ title: string; description: string }>) {
    const next = [...values];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {values.map((value, index) => (
        <div key={index} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Value {index + 1}
            </span>
            <button
              type="button"
              onClick={() => onChange(values.filter((_, i) => i !== index))}
              aria-label="Remove value"
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
            >
              ✕
            </button>
          </div>
          <div className="mt-2 space-y-2">
            <input
              value={value.title}
              onChange={(e) => update(index, { title: e.target.value })}
              placeholder="Value name"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
            />
            <textarea
              value={value.description}
              onChange={(e) => update(index, { description: e.target.value })}
              placeholder="Description"
              rows={2}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...values, { title: "", description: "" }])}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-brand-400 hover:text-brand-700"
      >
        + Add value
      </button>
    </div>
  );
}

function DifferentiatorsEditor({
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
        <div key={index} className="flex items-center gap-2">
          <input
            value={item}
            onChange={(e) => update(index, e.target.value)}
            placeholder="A differentiator"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
            aria-label="Remove"
            className="shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-brand-400 hover:text-brand-700"
      >
        + Add item
      </button>
    </div>
  );
}
