"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function SiteError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50">
          <AlertTriangle className="h-7 w-7 text-rose-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Something went wrong</h2>
        <p className="mt-2 text-sm text-slate-600">
          An unexpected error occurred while loading this page. Please try again.
        </p>
        <button
          type="button"
          onClick={retry}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
        >
          Try again
        </button>
      </div>
    </div>
  );
}