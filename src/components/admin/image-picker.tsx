"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Images, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Lets the admin either paste an image URL directly or pick one from the
 * uploaded media library. On selection it calls onChange with the chosen URL.
 */
export function ImagePicker({
  value,
  onChange,
  placeholder = "Paste an image URL or pick from the media library",
}: {
  value?: string;
  onChange: (url: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <input
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      />
      <div className="flex items-center gap-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element -- image URLs may be SVGs
          <img
            src={value}
            alt=""
            className="h-14 w-20 rounded-lg border border-slate-200 object-cover"
          />
        ) : null}
        <MediaPickerButton value={value} onSelect={onChange} />
      </div>
    </div>
  );
}

function MediaPickerButton({
  onSelect,
  value,
}: {
  onSelect: (url: string) => void;
  value?: string;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<{ id: string; url: string; alt: string | null }[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/media?limit=100");
      const data = await res.json();
      if (data.ok) setItems(data.items ?? []);
    } catch {
      toast.error("Could not load the media library.");
    } finally {
      setLoading(false);
    }
  }

  function openModal() {
    setOpen(true);
    load();
  }

  function choose(url: string) {
    onSelect(url);
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-brand-400 hover:text-brand-700"
      >
        <Images className="h-4 w-4" />
        Browse library
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setOpen(false)} />
          <div className="relative z-10 flex h-[80vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <ImagePlus className="h-4 w-4 text-brand-600" />
                Choose from media library
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <p className="py-16 text-center text-sm text-slate-400">Loading media…</p>
              ) : items.length === 0 ? (
                <p className="py-16 text-center text-sm text-slate-400">
                  No media uploaded yet. Add images in the Media section first.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => choose(item.url)}
                      className={cn(
                        "group overflow-hidden rounded-lg border border-slate-200 text-left transition-all hover:border-brand-400 hover:shadow-md",
                        value === item.url && "border-brand-500 ring-2 ring-brand-500/30"
                      )}
                    >
                      <div className="aspect-square w-full overflow-hidden bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element -- image URLs may be SVGs */}
                        <img
                          src={item.url}
                          alt={item.alt ?? ""}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <p className="truncate px-2 py-1.5 text-xs text-slate-500">
                        {item.alt ?? item.url.split("/").pop()}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
