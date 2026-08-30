"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export function DeleteButton({
  id,
  action,
  confirmMessage = "Delete this item permanently?",
  label = "Delete",
}: {
  id: string;
  action: (id: string) => Promise<{ ok?: boolean; message?: string }>;
  confirmMessage?: string;
  label?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onClick() {
    if (!window.confirm(confirmMessage)) return;
    setPending(true);
    try {
      const result = await action(id);
      if (result?.ok === false) {
        toast.error(result.message ?? "Something went wrong.");
      } else {
        toast.success("Deleted.");
        router.refresh();
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" />
      {pending ? "Deleting…" : label}
    </button>
  );
}