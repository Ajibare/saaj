"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Loader2, Trash2, Upload } from "lucide-react";
import { deleteMedia } from "@/lib/actions/media";
import { formatDate } from "@/lib/utils";

type MediaItem = {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  alt: string | null;
  createdAt: string;
};

export function MediaManager({ initial }: { initial: MediaItem[] }) {
  const [items, setItems] = useState<MediaItem[]>(initial);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function onUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (selected.length === 0) return;

    setUploading(true);
    try {
      const body = new FormData();
      for (const file of selected) body.append("file", file);
      const response = await fetch("/api/media", { method: "POST", body });
      const data = await response.json();
      if (data.ok && Array.isArray(data.items) && data.items.length > 0) {
        setItems((prev) => [...data.items, ...prev]);
        toast.success(
          data.message
            ? `${data.items.length} uploaded. ${data.message}`
            : `${data.items.length} file(s) uploaded to the media library.`
        );
      } else {
        toast.error(data.message ?? "Upload failed.");
      }
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function onDelete(id: string) {
    if (!window.confirm("Delete this media item permanently?")) return;
    setDeletingId(id);
    try {
      const result = await deleteMedia(id);
      if (result.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        toast.success("Media deleted.");
      } else {
        toast.error(result.message ?? "Could not delete.");
      }
    } finally {
      setDeletingId(null);
    }
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied.");
    } catch {
      toast.error("Could not copy URL.");
    }
  }

  const isImage = (mime: string) => mime.startsWith("image/");

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent-600">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? "Uploading…" : "Upload images"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp,image/avif,image/svg+xml"
            multiple
            className="sr-only"
            onChange={onUpload}
            disabled={uploading}
          />
        </label>
        <p className="mt-3 text-xs text-slate-400">
          Max 4 MB each. PNG, JPG, JPEG, WebP, GIF, AVIF or SVG. You can select multiple files at once.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <p className="text-sm font-medium text-slate-600">No media yet</p>
          <p className="mt-1 text-xs text-slate-400">Upload an image to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-md"
            >
              <div className="aspect-square w-full overflow-hidden bg-slate-100">
                {isImage(item.mimeType) ? (
                  // eslint-disable-next-line @next/next/no-img-element -- thumbnails may be SVGs
                  <img src={item.url} alt={item.alt ?? item.filename} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-4xl text-slate-300">
                    📄
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="truncate text-xs font-medium text-slate-700">{item.filename}</p>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  {formatDate(item.createdAt)}
                </p>
                <div className="mt-2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => copyUrl(item.url)}
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copy URL
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="ml-auto inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-50"
                  >
                    {deletingId === item.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
