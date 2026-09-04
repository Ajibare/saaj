import type { Metadata } from "next";
import { getHomeSettings } from "@/lib/settings";
import { HomeContentForm } from "@/components/admin/forms/home-content-form";

export const metadata: Metadata = {
  title: "Home Content",
  robots: { index: false, follow: false },
};

export default async function AdminHomeContentPage() {
  const home = await getHomeSettings();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Homepage Content</h1>
        <p className="mt-1 text-sm text-slate-500">
          Edit the sections shown on the public homepage. Each section saves independently.
        </p>
      </div>
      <HomeContentForm initial={home} />
    </div>
  );
}
