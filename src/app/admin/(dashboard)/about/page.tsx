import type { Metadata } from "next";
import { getAboutSettings } from "@/lib/settings";
import { AboutContentForm } from "@/components/admin/forms/about-content-form";

export const metadata: Metadata = {
  title: "About Content",
  robots: { index: false, follow: false },
};

export default async function AdminAboutContentPage() {
  const about = await getAboutSettings();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">About Page Content</h1>
        <p className="mt-1 text-sm text-slate-500">
          Edit the company overview, mission, vision, values, differentiators and approach shown
          on the public About page.
        </p>
      </div>
      <AboutContentForm initial={about} />
    </div>
  );
}
