"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  CalendarClock,
  FileText,
  Images,
  Inbox,
      LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  Newspaper,
  Home,
  Info,
  Settings,
  Wrench,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/lib/actions/auth";
import { BwToggle } from "@/components/bw-toggle";
import { Logo } from "@/components/site/logo";
import type { AdminSession } from "@/lib/auth";

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/messages", label: "Messages", icon: Inbox },
  { href: "/admin/appointments", label: "Appointments", icon: CalendarClock },
  { href: "/admin/quotes", label: "Quotes", icon: FileText },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/projects", label: "Projects", icon: Building2 },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/media", label: "Media", icon: Images },
  { href: "/admin/home", label: "Website Content", icon: Home },
  { href: "/admin/about", label: "About", icon: Info },
  { href: "/admin/settings", label: "Settings", icon: Settings },
] as const;

export function AdminShell({
  admin,
  children,
}: {
  admin: AdminSession;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
      {NAV_LINKS.map((link) => {
        const active =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-brand-600 text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <link.icon className="h-4.5 w-4.5 shrink-0" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );

  const header = (
    <div className="border-b border-slate-200 p-4">
      <Logo
        className="[&_img]:h-9 [&_img]:w-9"
        text="SAAJ Admin"
        textClassName="text-navy [&>span]:font-bold [&>span]:text-sm"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-white shadow-sm lg:flex">
        {header}
        {nav}
        <AdminFooter admin={admin} />
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-4">
              <Logo
                className="[&_img]:h-9 [&_img]:w-9"
                text="SAAJ Admin"
                textClassName="text-navy [&>span]:font-bold [&>span]:text-sm"
              />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {nav}
            <AdminFooter admin={admin} />
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-sm font-semibold text-slate-700">
              {NAV_LINKS.find((link) =>
                link.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(link.href)
              )?.label ?? "Admin"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <BwToggle className="border-slate-200 text-slate-600 hover:bg-slate-100" />
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold leading-tight text-slate-800">{admin.name}</p>
              <p className="text-xs text-slate-500">{admin.email}</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
              {admin.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

function AdminFooter({ admin }: { admin: AdminSession }) {
  return (
    <div className="border-t border-slate-200 p-4">
      <form action={logoutAction}>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </form>
      <p className="mt-3 text-center text-xs text-slate-400">
        Signed in as {admin.role}
      </p>
    </div>
  );
}