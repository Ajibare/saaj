"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Save, X } from "lucide-react";
import {
  createBlogCategory,
  deleteBlogCategory,
  updateBlogCategory,
} from "@/lib/actions/content";

type Category = { id: string; name: string; slug: string; postCount: number };

export function CategoriesManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [pending, setPending] = useState(false);

  async function run(action: () => Promise<{ ok?: boolean; message?: string }>, success: string) {
    setPending(true);
    try {
      const result = await action();
      if (result?.ok === false) {
        toast.error(result.message ?? "Something went wrong.");
      } else {
        toast.success(success);
        setEditingId(null);
        setName("");
        router.refresh();
      }
    } finally {
      setPending(false);
    }
  }

  function saveNew() {
    const clean = name.trim();
    if (!clean) return;
    const slug = clean.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    if (!slug) {
      toast.error("Please enter a valid category name.");
      return;
    }
    run(() => createBlogCategory({ name: clean, slug }), "Category created.");
  }

  function saveEdit(category: Category) {
    if (!name.trim()) return;
    run(() => updateBlogCategory(category.id, { name: name.trim(), slug: category.slug }), "Category updated.");
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">Categories</h2>
      </div>
      <ul className="divide-y divide-slate-100">
        {categories.length === 0 ? (
          <li className="px-5 py-6 text-sm text-slate-400">No categories yet.</li>
        ) : (
          categories.map((category) => (
            <li key={category.id} className="flex items-center gap-3 px-5 py-3">
              {editingId === category.id ? (
                <>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoFocus
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => saveEdit(category)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-accent-600 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setName("");
                    }}
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                    aria-label="Cancel"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                    {category.postCount}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800">{category.name}</p>
                    <p className="text-xs text-slate-400">/{category.slug}</p>
                  </div>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => {
                      setEditingId(category.id);
                      setName(category.name);
                    }}
                    className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
                  >
                    Rename
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => {
                      if (window.confirm("Delete this category? Posts in it become uncategorized.")) {
                        run(() => deleteBlogCategory(category.id), "Category deleted.");
                      }
                    }}
                    className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))
        )}
      </ul>
      <div className="flex items-center gap-2 border-t border-slate-100 px-5 py-4">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !editingId) saveNew();
          }}
          placeholder="New category name"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
        <button
          type="button"
          disabled={pending || editingId !== null}
          onClick={saveNew}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-accent-600 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>
    </div>
  );
}