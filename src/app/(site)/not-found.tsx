import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function SiteNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50">
          <Compass className="h-7 w-7 text-brand-700" />
        </div>
        <h2 className="text-5xl font-bold tracking-tight text-brand-700">404</h2>
        <p className="mt-2 text-xl font-semibold text-slate-900">Page not found</p>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          The page you are looking for doesn&apos;t exist or has been moved. Let&apos;s get
          you back on track.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to homepage
        </Link>
      </div>
    </div>
  );
}