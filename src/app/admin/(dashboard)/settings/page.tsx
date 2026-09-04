import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/settings";
import { SiteSettingsForm } from "@/components/admin/forms/site-settings-form";

export const metadata: Metadata = {
  title: "Site Settings",
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Site Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Company information, social links and SEO defaults. Each section saves independently.
        </p>
      </div>
      <SiteSettingsForm
        general={settings.general!}
        socials={settings.socials!}
        seo={settings.seo!}
      />
    </div>
  );
}
