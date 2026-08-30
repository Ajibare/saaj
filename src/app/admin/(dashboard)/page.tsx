import Link from "next/link";
import {
  CalendarClock,
  FileText,
  Inbox,
  Mail,
  Phone,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [messages, appointments, quotes, unreadMessages, pendingAppointments, newQuotes, recent] =
    await Promise.all([
      prisma.contactMessage.count(),
      prisma.appointment.count(),
      prisma.quoteRequest.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.appointment.count({ where: { status: "pending" } }),
      prisma.quoteRequest.count({ where: { status: "new" } }),
      prisma.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    ]);
  const [recentMessages, recentAppointments, recentQuotes] = await Promise.all([
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 4 }),
    prisma.appointment.findMany({ orderBy: { createdAt: "desc" }, take: 4 }),
    prisma.quoteRequest.findMany({ orderBy: { createdAt: "desc" }, take: 4 }),
  ]);

  const stats = [
    {
      label: "Messages",
      value: messages,
      sub: `${unreadMessages} unread`,
      href: "/admin/messages",
      icon: Inbox,
    },
    {
      label: "Appointments",
      value: appointments,
      sub: `${pendingAppointments} pending`,
      href: "/admin/appointments",
      icon: CalendarClock,
    },
    {
      label: "Quotes",
      value: quotes,
      sub: `${newQuotes} new`,
      href: "/admin/quotes",
      icon: FileText,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Overview of your submissions and activity.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{stat.value}</p>
                <p className="mt-1 text-xs text-slate-400">{stat.sub}</p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <stat.icon className="h-5 w-5" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <RecentList
          title="Latest messages"
          href="/admin/messages"
          items={recentMessages.map((m) => ({
            key: m.id,
            name: m.name,
            detail: m.subject,
            meta: formatDate(m.createdAt),
            icon: Mail,
          }))}
          empty="No messages yet."
        />
        <RecentList
          title="Latest appointments"
          href="/admin/appointments"
          items={recentAppointments.map((a) => ({
            key: a.id,
            name: a.name,
            detail: a.service,
            meta: formatDate(a.createdAt),
            icon: CalendarClock,
          }))}
          empty="No appointments yet."
        />
        <RecentList
          title="Latest quotes"
          href="/admin/quotes"
          items={recentQuotes.map((q) => ({
            key: q.id,
            name: q.name,
            detail: q.projectType ?? q.projectLocation ?? q.serviceRequired ?? "Quote request",
            meta: formatDate(q.createdAt),
            icon: Phone,
          }))}
          empty="No quote requests yet."
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">Recent activity</h2>
        </div>
        <ul className="divide-y divide-slate-100">
          {recent.length === 0 ? (
            <li className="px-5 py-6 text-sm text-slate-400">No activity yet.</li>
          ) : (
            recent.map((log) => (
              <li key={log.id} className="flex items-center justify-between gap-4 px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">{log.action}</p>
                  {log.detail ? (
                    <p className="truncate text-xs text-slate-500">{log.detail}</p>
                  ) : null}
                </div>
                <span className="shrink-0 text-xs text-slate-400">{formatDate(log.createdAt)}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

function RecentList({
  title,
  href,
  items,
  empty,
}: {
  title: string;
  href: string;
  items: { key: string; name: string; detail: string; meta: string; icon: typeof Mail }[];
  empty: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        <Link href={href} className="text-xs font-medium text-brand-600 hover:underline">
          View all
        </Link>
      </div>
      <ul className="divide-y divide-slate-100">
        {items.length === 0 ? (
          <li className="px-5 py-6 text-sm text-slate-400">{empty}</li>
        ) : (
          items.map((item) => (
            <li key={item.key} className="flex items-start gap-3 px-5 py-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <item.icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800">{item.name}</p>
                <p className="truncate text-xs text-slate-500">{item.detail}</p>
              </div>
              <span className="shrink-0 text-xs text-slate-400">{item.meta}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}