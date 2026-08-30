"use client";

import { startTransition, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Building2, CalendarDays, Clock, Save, Trash2 } from "lucide-react";
import { APPOINTMENT_STATUSES } from "@/lib/constants";
import {
  deleteAppointment,
  saveAppointmentNotes,
  setAppointmentStatus,
} from "@/lib/actions/admin";
import {
  StatusBadge,
  FilterTabs,
  EmptyState,
  Avatar,
  ActionButton,
} from "@/components/admin/admin-ui";

type AppointmentItem = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string;
  projectType: string | null;
  preferredDate: string;
  preferredTime: string;
  message: string | null;
  status: string;
  adminNotes: string | null;
  createdAt: string;
};

export function AppointmentsManager({ appointments }: { appointments: AppointmentItem[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  const tabs = useMemo(() => {
    const counts = appointments.reduce<Record<string, number>>((acc, item) => {
      acc[item.status] = (acc[item.status] ?? 0) + 1;
      return acc;
    }, {});
    return [
      { value: "all", label: "All", count: appointments.length },
      ...APPOINTMENT_STATUSES.map((status) => ({
        value: status.value,
        label: status.label,
        count: counts[status.value] ?? 0,
      })),
    ];
  }, [appointments]);

  const visible =
    filter === "all" ? appointments : appointments.filter((item) => item.status === filter);

  function run(action: () => Promise<unknown>, success: string) {
    startTransition(async () => {
      setPending(true);
      try {
        const result = (await action()) as { ok?: boolean; message?: string };
        if (result?.ok === false) {
          toast.error(result.message ?? "Something went wrong.");
        } else {
          toast.success(success);
          router.refresh();
        }
      } finally {
        setPending(false);
      }
    });
  }

  function changeStatus(id: string, status: string) {
    run(() => setAppointmentStatus(id, status), "Appointment updated.");
  }

  function saveNotes(id: string, serverNotes: string | null) {
    const currentDraft = notesDraft[id] !== undefined ? notesDraft[id] : serverNotes ?? "";
    run(() => saveAppointmentNotes(id, currentDraft), "Notes saved.");
  }

  return (
    <div className="space-y-5">
      <FilterTabs tabs={tabs} active={filter} onSelect={setFilter} />

      {visible.length === 0 ? (
        <EmptyState title="No appointments here" hint="Appointments booked on the site will appear here." />
      ) : (
        <ul className="space-y-3">
          {visible.map((item) => (
            <li key={item.id} className="rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-sm">
              <button
                type="button"
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                className="flex w-full items-center gap-4 px-4 py-3.5 text-left sm:px-5"
              >
                <Avatar name={item.name} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {new Date(item.preferredDate).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {item.preferredTime}
                      </span>
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-slate-600">{item.service}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <StatusBadge status={item.status} />
                </div>
              </button>

              {expandedId === item.id ? (
                <div className="border-t border-slate-100 px-4 pb-4 pt-3 sm:px-5">
                  <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Email</dt>
                      <dd className="mt-0.5 text-slate-700">{item.email}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Phone</dt>
                      <dd className="mt-0.5 text-slate-700">{item.phone ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Company</dt>
                      <dd className="mt-0.5 text-slate-700">{item.company ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Project type</dt>
                      <dd className="mt-0.5 text-slate-700">{item.projectType ?? "—"}</dd>
                    </div>
                    {item.message ? (
                      <div className="sm:col-span-2">
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Message</dt>
                        <dd className="mt-0.5 whitespace-pre-wrap text-slate-700">{item.message}</dd>
                      </div>
                    ) : null}
                  </dl>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">
                        Status
                      </label>
                      <select
                        value={item.status}
                        onChange={(event) => changeStatus(item.id, event.target.value)}
                        disabled={pending}
                        className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 disabled:opacity-60"
                      >
                        {APPOINTMENT_STATUSES.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">
                        Admin notes
                      </label>
                      <div className="mt-1.5 flex items-start gap-2">
                        <textarea
                          value={notesDraft[item.id] !== undefined ? notesDraft[item.id] : item.adminNotes ?? ""}
                          onChange={(event) =>
                            setNotesDraft((draft) => ({ ...draft, [item.id]: event.target.value }))
                          }
                          rows={2}
                          placeholder="Internal notes…"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400"
                        />
                        <ActionButton
                          variant="primary"
                          disabled={pending}
                          onClick={() => saveNotes(item.id, item.adminNotes)}
                        >
                          <Save className="h-4 w-4" />
                          Save
                        </ActionButton>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <a
                      href={`mailto:${item.email}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline"
                    >
                      <Building2 className="h-4 w-4" />
                      Contact client
                    </a>
                    <ActionButton
                      variant="danger"
                      disabled={pending}
                      onClick={() => {
                        if (window.confirm("Delete this appointment permanently?")) {
                          run(() => deleteAppointment(item.id), "Appointment deleted.");
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </ActionButton>
                  </div>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}