"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { GeneralSettings, SeoSettings, SocialSettings } from "@/lib/types";
import {
  updateGeneralSettings,
  updateSeoSettings,
  updateSocialSettings,
} from "@/lib/actions/settings";
import { FormField, FormInput, FormTextarea } from "@/components/site/form-fields";
import { ImagePicker } from "@/components/admin/image-picker";

export function SiteSettingsForm({
  general,
  socials,
  seo,
}: {
  general: GeneralSettings;
  socials: SocialSettings;
  seo: SeoSettings;
}) {
  const router = useRouter();
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const [generalForm, setGeneralForm] = useState({
    companyName: general.companyName,
    tagline: general.tagline,
    description: general.description,
    phone: general.phone,
    email: general.email,
    address: general.address,
    founded: general.founded ?? "",
    primaryContact: general.primaryContact ?? "",
    logo: general.logo ?? "",
    favicon: general.favicon ?? "",
  });

  const [socialForm, setSocialForm] = useState({
    facebook: socials.facebook ?? "",
    twitter: socials.twitter ?? "",
    instagram: socials.instagram ?? "",
    linkedin: socials.linkedin ?? "",
    youtube: socials.youtube ?? "",
  });

  const [seoForm, setSeoForm] = useState({
    titleTemplate: seo.titleTemplate ?? "",
    defaultTitle: seo.defaultTitle ?? "",
    defaultDescription: seo.defaultDescription ?? "",
    keywords: seo.keywords ?? [],
    ogImage: seo.ogImage ?? "",
  });

  async function run(key: string, action: () => Promise<{ ok: boolean; message?: string }>) {
    setPendingKey(key);
    try {
      const result = await action();
      if (!result.ok) {
        toast.error(result.message ?? "Something went wrong.");
      } else {
        toast.success("Settings saved.");
        router.refresh();
      }
    } finally {
      setPendingKey(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* General */}
      <Section
        label="General"
        pending={pendingKey === "general"}
        onSave={() =>
          run("general", () => updateGeneralSettings(generalForm))
        }
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Company name" required>
            <FormInput
              value={generalForm.companyName}
              onChange={(e) => setGeneralForm({ ...generalForm, companyName: e.target.value })}
            />
          </FormField>
          <FormField label="Founded">
            <FormInput
              value={generalForm.founded}
              onChange={(e) => setGeneralForm({ ...generalForm, founded: e.target.value })}
            />
          </FormField>
        </div>
        <FormField label="Tagline">
          <FormInput
            value={generalForm.tagline}
            onChange={(e) => setGeneralForm({ ...generalForm, tagline: e.target.value })}
          />
        </FormField>
        <FormField label="Description" required>
          <FormTextarea
            rows={4}
            value={generalForm.description}
            onChange={(e) => setGeneralForm({ ...generalForm, description: e.target.value })}
          />
        </FormField>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Phone" required>
            <FormInput
              value={generalForm.phone}
              onChange={(e) => setGeneralForm({ ...generalForm, phone: e.target.value })}
            />
          </FormField>
          <FormField label="Email" required>
            <FormInput
              type="email"
              value={generalForm.email}
              onChange={(e) => setGeneralForm({ ...generalForm, email: e.target.value })}
            />
          </FormField>
        </div>
        <FormField label="Address" required>
          <FormInput
            value={generalForm.address}
            onChange={(e) => setGeneralForm({ ...generalForm, address: e.target.value })}
          />
        </FormField>
        <FormField label="Primary contact">
          <FormInput
            value={generalForm.primaryContact}
            onChange={(e) => setGeneralForm({ ...generalForm, primaryContact: e.target.value })}
          />
        </FormField>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Logo">
            <ImagePicker
              value={generalForm.logo}
              onChange={(url) => setGeneralForm({ ...generalForm, logo: url })}
            />
          </FormField>
          <FormField label="Favicon">
            <ImagePicker
              value={generalForm.favicon}
              onChange={(url) => setGeneralForm({ ...generalForm, favicon: url })}
            />
          </FormField>
        </div>
      </Section>

      {/* Socials */}
      <Section
        label="Social Links"
        pending={pendingKey === "socials"}
        onSave={() => run("socials", () => updateSocialSettings(socialForm))}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {(["facebook", "twitter", "instagram", "linkedin", "youtube"] as const).map((key) => (
            <FormField key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}>
              <FormInput
                placeholder={`https://${key}.com/...`}
                value={socialForm[key]}
                onChange={(e) => setSocialForm({ ...socialForm, [key]: e.target.value })}
              />
            </FormField>
          ))}
        </div>
      </Section>

      {/* SEO */}
      <Section
        label="SEO Defaults"
        pending={pendingKey === "seo"}
        onSave={() =>
          run("seo", () =>
            updateSeoSettings({
              ...seoForm,
              keywords: seoForm.keywords.filter((k) => k.trim() !== ""),
            })
          )
        }
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Title template" hint="Use %s as the page title placeholder">
            <FormInput
              value={seoForm.titleTemplate}
              onChange={(e) => setSeoForm({ ...seoForm, titleTemplate: e.target.value })}
            />
          </FormField>
          <FormField label="Default title">
            <FormInput
              value={seoForm.defaultTitle}
              onChange={(e) => setSeoForm({ ...seoForm, defaultTitle: e.target.value })}
            />
          </FormField>
        </div>
        <FormField label="Default description">
          <FormTextarea
            rows={3}
            value={seoForm.defaultDescription}
            onChange={(e) => setSeoForm({ ...seoForm, defaultDescription: e.target.value })}
          />
        </FormField>
        <FormField label="Default OG image">
          <ImagePicker
            value={seoForm.ogImage}
            onChange={(url) => setSeoForm({ ...seoForm, ogImage: url })}
          />
        </FormField>
        <KeywordsEditor
          keywords={seoForm.keywords}
          onChange={(keywords) => setSeoForm({ ...seoForm, keywords })}
        />
      </Section>
    </div>
  );
}

function Section({
  label,
  pending,
  onSave,
  children,
}: {
  label: string;
  pending: boolean;
  onSave: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{label}</h2>
        <button
          type="button"
          onClick={onSave}
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          ) : null}
          Save {label.toLowerCase()}
        </button>
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function KeywordsEditor({
  keywords,
  onChange,
}: {
  keywords: string[];
  onChange: (keywords: string[]) => void;
}) {
  function update(index: number, value: string) {
    const next = [...keywords];
    next[index] = value;
    onChange(next);
  }
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-700">Keywords</p>
      {keywords.map((keyword, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            value={keyword}
            onChange={(e) => update(index, e.target.value)}
            placeholder="A keyword"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
          />
          <button
            type="button"
            onClick={() => onChange(keywords.filter((_, i) => i !== index))}
            aria-label="Remove keyword"
            className="shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...keywords, ""])}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-brand-400 hover:text-brand-700"
      >
        + Add keyword
      </button>
    </div>
  );
}
