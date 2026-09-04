"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, Upload } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { homeSettingsSchema } from "@/lib/validators";
import { updateHomeSettings } from "@/lib/actions/settings";
import type { HomeSettings } from "@/lib/types";
import {
  FormField,
  FormInput,
  FormTextarea,
} from "@/components/site/form-fields";
import { ImagePicker } from "@/components/admin/image-picker";
import { cn } from "@/lib/utils";

type FormValues = z.input<typeof homeSettingsSchema>;

type WhyItem = { title: string; description: string; icon?: string };
type StatItem = { label: string; value: number; suffix?: string };
type ProcessStep = { title: string; description: string };
type HeroVideo = { url: string; poster?: string };
type PartnerLogo = { name: string; image?: string; url?: string };

export function HomeContentForm({ initial }: { initial: HomeSettings }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  // Keep all nested state in a single object so individual sections can be
  // submitted independently against the correct slice of the schema.
  const [form, setForm] = useState<FormValues>({
    hero: {
      title: initial.hero.title,
      subtitle: initial.hero.subtitle,
      image: initial.hero.image ?? "",
      videos: (initial.hero.videos ?? []).map((v) => ({
        url: v.url,
        poster: v.poster ?? "",
      })),
      primaryCtaLabel: initial.hero.primaryCtaLabel ?? "",
      secondaryCtaLabel: initial.hero.secondaryCtaLabel ?? "",
    },
    intro: {
      title: initial.intro.title,
      content: initial.intro.content,
      image: initial.intro.image ?? "",
      ctaLabel: initial.intro.ctaLabel ?? "",
    },
    whyChooseUs: {
      title: initial.whyChooseUs.title,
      heading: initial.whyChooseUs.heading,
      items: initial.whyChooseUs.items.map((i) => ({
        title: i.title,
        description: i.description,
        icon: i.icon ?? "",
      })),
    },
    stats: {
      title: initial.stats.title,
      heading: initial.stats.heading,
      items: initial.stats.items.map((i) => ({
        label: i.label,
        value: i.value,
        suffix: i.suffix ?? "",
      })),
    },
    process: {
      title: initial.process.title,
      heading: initial.process.heading,
      steps: initial.process.steps.map((s) => ({ title: s.title, description: s.description })),
    },
    partners: {
      title: initial.partners?.title ?? "",
      heading: initial.partners?.heading ?? "",
      logos: (initial.partners?.logos ?? []).map((l) => ({
        name: l.name,
        image: l.image ?? "",
        url: l.url ?? "",
      })),
    },
    cta: {
      title: initial.cta.title,
      content: initial.cta.content,
      primaryLabel: initial.cta.primaryLabel,
      secondaryLabel: initial.cta.secondaryLabel,
      tertiaryLabel: initial.cta.tertiaryLabel,
    },
  });

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function submitSection(section: keyof FormValues) {
    setPending(true);
    try {
      const result = await updateHomeSettings({ [section]: form[section] } as unknown as FormValues);
      if (!result.ok) {
        toast.error(result.message ?? "Something went wrong.");
      } else {
        toast.success("Home content saved.");
        router.refresh();
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <Section label="Hero Section">
        <FormField label="Hero title" required>
          <FormInput
            value={form.hero.title}
            onChange={(e) => set("hero", { ...form.hero, title: e.target.value })}
          />
        </FormField>
        <FormField label="Hero subtitle" required>
          <FormTextarea
            rows={3}
            value={form.hero.subtitle}
            onChange={(e) => set("hero", { ...form.hero, subtitle: e.target.value })}
          />
        </FormField>
        <FormField label="Hero image">
          <ImagePicker
            value={form.hero.image}
            onChange={(url) => set("hero", { ...form.hero, image: url })}
          />
        </FormField>
        <HeroVideosEditor
          videos={form.hero.videos ?? []}
          onChange={(videos) => set("hero", { ...form.hero, videos })}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Primary CTA label">
            <FormInput
              value={form.hero.primaryCtaLabel}
              onChange={(e) => set("hero", { ...form.hero, primaryCtaLabel: e.target.value })}
            />
          </FormField>
          <FormField label="Secondary CTA label">
            <FormInput
              value={form.hero.secondaryCtaLabel}
              onChange={(e) => set("hero", { ...form.hero, secondaryCtaLabel: e.target.value })}
            />
          </FormField>
        </div>
        <SectionSave pending={pending} onClick={() => submitSection("hero")} />
      </Section>

      {/* Intro */}
      <Section label="Company Introduction">
        <FormField label="Intro title">
          <FormInput
            value={form.intro.title}
            onChange={(e) => set("intro", { ...form.intro, title: e.target.value })}
          />
        </FormField>
        <FormField label="Intro content" required>
          <FormTextarea
            rows={5}
            value={form.intro.content}
            onChange={(e) => set("intro", { ...form.intro, content: e.target.value })}
          />
        </FormField>
        <FormField label="Intro image">
          <ImagePicker
            value={form.intro.image}
            onChange={(url) => set("intro", { ...form.intro, image: url })}
          />
        </FormField>
        <FormField label="CTA label">
          <FormInput
            value={form.intro.ctaLabel}
            onChange={(e) => set("intro", { ...form.intro, ctaLabel: e.target.value })}
          />
        </FormField>
        <SectionSave pending={pending} onClick={() => submitSection("intro")} />
      </Section>

      {/* Why choose us */}
      <Section label="Why Choose Us">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Section title">
            <FormInput
              value={form.whyChooseUs.title}
              onChange={(e) => set("whyChooseUs", { ...form.whyChooseUs, title: e.target.value })}
            />
          </FormField>
          <FormField label="Heading">
            <FormInput
              value={form.whyChooseUs.heading}
              onChange={(e) => set("whyChooseUs", { ...form.whyChooseUs, heading: e.target.value })}
            />
          </FormField>
        </div>
        <WhyItemsEditor
          items={form.whyChooseUs.items}
          onChange={(items) => set("whyChooseUs", { ...form.whyChooseUs, items })}
        />
        <SectionSave pending={pending} onClick={() => submitSection("whyChooseUs")} />
      </Section>

      {/* Stats */}
      <Section label="Statistics">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Section title">
            <FormInput
              value={form.stats.title}
              onChange={(e) => set("stats", { ...form.stats, title: e.target.value })}
            />
          </FormField>
          <FormField label="Heading">
            <FormInput
              value={form.stats.heading}
              onChange={(e) => set("stats", { ...form.stats, heading: e.target.value })}
            />
          </FormField>
        </div>
        <StatItemsEditor
          items={form.stats.items as unknown as StatItem[]}
          onChange={(items) => set("stats", { ...form.stats, items: items as FormValues["stats"]["items"] })}
        />
        <SectionSave pending={pending} onClick={() => submitSection("stats")} />
      </Section>

      {/* Process */}
      <Section label="Process Section">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Section title">
            <FormInput
              value={form.process.title}
              onChange={(e) => set("process", { ...form.process, title: e.target.value })}
            />
          </FormField>
          <FormField label="Heading">
            <FormInput
              value={form.process.heading}
              onChange={(e) => set("process", { ...form.process, heading: e.target.value })}
            />
          </FormField>
        </div>
        <ProcessStepsEditor
          steps={form.process.steps}
          onChange={(steps) => set("process", { ...form.process, steps })}
        />
        <SectionSave pending={pending} onClick={() => submitSection("process")} />
      </Section>

      {/* Partners */}
      <Section label="Partners / Clients">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Section title">
            <FormInput
              value={form.partners.title}
              onChange={(e) => set("partners", { ...form.partners, title: e.target.value })}
            />
          </FormField>
          <FormField label="Heading">
            <FormInput
              value={form.partners.heading}
              onChange={(e) => set("partners", { ...form.partners, heading: e.target.value })}
            />
          </FormField>
        </div>
        <PartnersEditor
          logos={form.partners.logos}
          onChange={(logos) => set("partners", { ...form.partners, logos })}
        />
        <SectionSave pending={pending} onClick={() => submitSection("partners")} />
      </Section>

      {/* CTA */}
      <Section label="CTA / Consultation Section">
        <FormField label="Title" required>
          <FormInput
            value={form.cta.title}
            onChange={(e) => set("cta", { ...form.cta, title: e.target.value })}
          />
        </FormField>
        <FormField label="Content">
          <FormTextarea
            rows={3}
            value={form.cta.content}
            onChange={(e) => set("cta", { ...form.cta, content: e.target.value })}
          />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label="Primary button">
            <FormInput
              value={form.cta.primaryLabel}
              onChange={(e) => set("cta", { ...form.cta, primaryLabel: e.target.value })}
            />
          </FormField>
          <FormField label="Secondary button">
            <FormInput
              value={form.cta.secondaryLabel}
              onChange={(e) => set("cta", { ...form.cta, secondaryLabel: e.target.value })}
            />
          </FormField>
          <FormField label="Tertiary button">
            <FormInput
              value={form.cta.tertiaryLabel}
              onChange={(e) => set("cta", { ...form.cta, tertiaryLabel: e.target.value })}
            />
          </FormField>
        </div>
        <SectionSave pending={pending} onClick={() => submitSection("cta")} />
      </Section>

      <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-5">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
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

function SectionSave({ pending, onClick }: { pending: boolean; onClick: () => void }) {
  return (
    <div className="pt-2">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        ) : null}
        Save section
      </button>
    </div>
  );
}

function WhyItemsEditor({
  items,
  onChange,
}: {
  items: WhyItem[];
  onChange: (items: WhyItem[]) => void;
}) {
  function update(index: number, patch: Partial<WhyItem>) {
    const next = [...items];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-slate-500">Feature items</p>
      {items.map((item, index) => (
        <div key={index} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Item {index + 1}
            </span>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              aria-label="Remove item"
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-2 space-y-2">
            <input
              value={item.title}
              onChange={(e) => update(index, { title: e.target.value })}
              placeholder="Title"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
            />
            <input
              value={item.icon ?? ""}
              onChange={(e) => update(index, { icon: e.target.value })}
              placeholder="Icon key (e.g. layers, shield-check)"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
            />
            <textarea
              value={item.description}
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
        onClick={() => onChange([...items, { title: "", description: "", icon: "" }])}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-brand-400 hover:text-brand-700"
      >
        <Plus className="h-4 w-4" />
        Add item
      </button>
    </div>
  );
}

function StatItemsEditor({
  items,
  onChange,
}: {
  items: StatItem[];
  onChange: (items: StatItem[]) => void;
}) {
  function update(index: number, patch: Partial<StatItem>) {
    const next = [...items];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-slate-500">Stat items</p>
      <div className="grid gap-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="grid items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[1fr_120px_80px_auto]"
          >
            <input
              value={item.label}
              onChange={(e) => update(index, { label: e.target.value })}
              placeholder="Label"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
            />
            <input
              type="number"
              value={item.value}
              onChange={(e) => update(index, { value: Number(e.target.value) })}
              placeholder="Value"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
            />
            <input
              value={item.suffix ?? ""}
              onChange={(e) => update(index, { suffix: e.target.value })}
              placeholder="Suffix"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              aria-label="Remove stat"
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, { label: "", value: 0, suffix: "" }])}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-brand-400 hover:text-brand-700"
      >
        <Plus className="h-4 w-4" />
        Add stat
      </button>
    </div>
  );
}

function ProcessStepsEditor({
  steps,
  onChange,
}: {
  steps: ProcessStep[];
  onChange: (steps: ProcessStep[]) => void;
}) {
  function update(index: number, patch: Partial<ProcessStep>) {
    const next = [...steps];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-slate-500">Process steps</p>
      {steps.map((step, index) => (
        <div key={index} className={cn("rounded-lg border border-slate-200 bg-slate-50 p-3")}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Step {index + 1}
            </span>
            <button
              type="button"
              onClick={() => onChange(steps.filter((_, i) => i !== index))}
              aria-label="Remove step"
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-2 space-y-2">
            <input
              value={step.title}
              onChange={(e) => update(index, { title: e.target.value })}
              placeholder="Title"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
            />
            <textarea
              value={step.description}
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
        onClick={() => onChange([...steps, { title: "", description: "" }])}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-brand-400 hover:text-brand-700"
      >
        <Plus className="h-4 w-4" />
        Add step
      </button>
    </div>
  );
}

const MAX_HERO_VIDEOS = 5;

function HeroVideosEditor({
  videos,
  onChange,
}: {
  videos: HeroVideo[];
  onChange: (videos: HeroVideo[]) => void;
}) {
  const [uploading, setUploading] = useState<number | null>(null);

  function update(index: number, patch: Partial<HeroVideo>) {
    const next = [...videos];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }

  async function uploadVideo(index: number, file: File) {
    setUploading(index);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("alt", `Hero clip ${index + 1}`);
      const res = await fetch("/api/media", { method: "POST", body: formData });
      const data = await res.json();
      if (!data.ok) {
        toast.error(data.message ?? "Could not upload the video.");
        return;
      }
      update(index, { url: data.url });
      toast.success("Video uploaded.");
    } catch {
      toast.error("Could not upload the video.");
    } finally {
      setUploading(null);
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-slate-500">
        Hero background videos ({videos.length}/{MAX_HERO_VIDEOS})
      </p>
      <p className="text-xs text-slate-400">
        Add up to {MAX_HERO_VIDEOS} short video clips. They will play one after
        the other in the home hero background. Upload a video from your device
        (mp4 / webm / mov) or paste a direct video URL.
      </p>
      {videos.map((video, index) => (
        <div
          key={index}
          className="grid items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[auto_1fr_auto_auto]"
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Clip {index + 1}
          </span>
          <input
            value={video.url}
            onChange={(e) => update(index, { url: e.target.value })}
            placeholder="https://example.com/video.mp4"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
          />
          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-brand-400 hover:text-brand-700">
            <Upload className="h-4 w-4" />
            {uploading === index ? "Uploading…" : "Upload"}
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime,video/x-m4v"
              className="sr-only"
              disabled={uploading === index}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadVideo(index, file);
                e.target.value = "";
              }}
            />
          </label>
          <button
            type="button"
            onClick={() => onChange(videos.filter((_, i) => i !== index))}
            aria-label="Remove video"
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      {videos.length < MAX_HERO_VIDEOS ? (
        <button
          type="button"
          onClick={() => onChange([...videos, { url: "", poster: "" }])}
          className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-brand-400 hover:text-brand-700"
        >
          <Plus className="h-4 w-4" />
          Add video
        </button>
      ) : null}
    </div>
  );
}

function PartnersEditor({
  logos,
  onChange,
}: {
  logos: PartnerLogo[];
  onChange: (logos: PartnerLogo[]) => void;
}) {
  function update(index: number, patch: Partial<PartnerLogo>) {
    const next = [...logos];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-slate-500">Partner / client logos</p>
      {logos.map((logo, index) => (
        <div
          key={index}
          className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Logo {index + 1}
            </span>
            <button
              type="button"
              onClick={() => onChange(logos.filter((_, i) => i !== index))}
              aria-label="Remove logo"
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              value={logo.name}
              onChange={(e) => update(index, { name: e.target.value })}
              placeholder="Company name"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
            />
            <input
              value={logo.url ?? ""}
              onChange={(e) => update(index, { url: e.target.value })}
              placeholder="Website URL (optional)"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
            />
          </div>
          <ImagePicker
            value={logo.image}
            onChange={(image) => update(index, { image })}
            placeholder="Paste a logo image URL or pick from the media library"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...logos, { name: "", image: "", url: "" }])}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-brand-400 hover:text-brand-700"
      >
        <Plus className="h-4 w-4" />
        Add logo
      </button>
    </div>
  );
}
