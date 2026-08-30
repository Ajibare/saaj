"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  Mail,
  Menu,
  MapPin,
  Phone,
  X,
} from "lucide-react";
import { Logo } from "@/components/site/logo";
import { NAV_LINKS } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import type { GeneralSettings } from "@/lib/types";

type SiteHeaderProps = {
  general: GeneralSettings;
};

export function SiteHeader({ general }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top bar */}
      <div className="hidden bg-navy text-white md:block">
        <div className="container-site flex items-center justify-between py-2 text-xs">
          <div className="flex items-center gap-5">
            <a
              href={`tel:${general.phone}`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-brand-300"
            >
              <Phone className="h-3.5 w-3.5 text-brand-400" />
              {general.phone}
            </a>
            <a
              href={`mailto:${general.email}`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-brand-300"
            >
              <Mail className="h-3.5 w-3.5 text-brand-400" />
              {general.email}
            </a>
          </div>
          <p className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-brand-400" />
            {general.address}
          </p>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-slate-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="container-site flex h-20 items-center justify-between gap-4">
          <Link href="/" className="group">
            <Logo
              src={general.logo}
              text="SAAJ Partners & Consult"
              textClassName="text-slate-900"
              imageClassName="h-11 w-11"
              className="max-w-[240px]"
            />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "text-brand-700"
                      : "text-slate-600 hover:text-brand-700"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                  {active ? (
                    <span className="absolute inset-x-3 -bottom-[1px] h-0.5 rounded-full bg-brand-600" />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/request-a-quote"
              className="hidden items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 sm:inline-flex"
            >
              Request a Quote
              <ChevronRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition-colors hover:bg-slate-50 lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open ? (
          <div className="border-t border-slate-200 bg-white lg:hidden">
            <nav className="container-site flex flex-col gap-1 py-4" aria-label="Mobile">
              {NAV_LINKS.map((link) => {
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                      active
                        ? "bg-brand-50 text-brand-800"
                        : "text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    {link.label}
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </Link>
                );
              })}
              <Link
                href="/request-a-quote"
                onClick={() => setOpen(false)}
                className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white"
              >
                Request a Quote
                <ChevronRight className="h-4 w-4" />
              </Link>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}