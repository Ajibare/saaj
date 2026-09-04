import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { MediaManager } from "@/components/admin/media-manager";

export const metadata: Metadata = {
  title: "Media",
  robots: { index: false, follow: false },
};

export default async function AdminMediaPage() {
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Media Library</h1>
        <p className="mt-1 text-sm text-slate-500">
          Upload, view and manage images used across the website. Copy a URL to reuse an image.
        </p>
      </div>
      <MediaManager
        initial={media.map((m) => ({
          id: m.id,
          filename: m.filename,
          url: m.url,
          mimeType: m.mimeType,
          size: m.size,
          alt: m.alt,
          createdAt: m.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
