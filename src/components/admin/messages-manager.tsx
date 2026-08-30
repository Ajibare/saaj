"use client";

import { startTransition, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCheck, Mail, MailOpen, Phone, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  deleteMessage,
  markMessageRead,
  setMessageReplied,
} from "@/lib/actions/admin";
import { StatusBadge, FilterTabs, EmptyState, Avatar, ActionButton } from "@/components/admin/admin-ui";

type MessageItem = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  isRead: boolean;
  isReplied: boolean;
  createdAt: string;
};

export function MessagesManager({ messages }: { messages: MessageItem[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const unreadCount = useMemo(() => messages.filter((m) => !m.isRead).length, [messages]);

  const visible = filter === "unread" ? messages.filter((m) => !m.isRead) : messages;

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

  return (
    <div className="space-y-5">
      <FilterTabs
        tabs={[
          { value: "all", label: "All", count: messages.length },
          { value: "unread", label: "Unread", count: unreadCount },
        ]}
        active={filter}
        onSelect={setFilter}
      />

      {visible.length === 0 ? (
        <EmptyState
          title={filter === "unread" ? "No unread messages" : "No messages yet"}
          hint="Messages sent through the contact form will appear here."
        />
      ) : (
        <ul className="space-y-3">
          {visible.map((message) => (
            <li
              key={message.id}
              className={cn(
                "rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-sm",
                !message.isRead && "border-brand-200 bg-brand-50/40"
              )}
            >
              <button
                type="button"
                onClick={() => setExpandedId(expandedId === message.id ? null : message.id)}
                className="flex w-full items-center gap-4 px-4 py-3.5 text-left sm:px-5"
              >
                <div className="relative">
                  <Avatar name={message.name} />
                  {!message.isRead ? (
                    <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-brand-600 ring-2 ring-white" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <p className="text-sm font-semibold text-slate-900">{message.name}</p>
                    <span className="text-xs text-slate-400">
                      {new Date(message.createdAt).toLocaleString("en-NG", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-slate-600">{message.subject}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {!message.isRead ? <StatusBadge status="unread" /> : null}
                  {message.isReplied ? <StatusBadge status="replied" /> : null}
                </div>
              </button>

              {expandedId === message.id ? (
                <div className="border-t border-slate-100 px-4 pb-4 pt-3 sm:px-5">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                    {message.message}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                    <a
                      href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject)}`}
                      className="inline-flex items-center gap-1.5 font-medium text-brand-600 hover:underline"
                    >
                      <Mail className="h-4 w-4" />
                      {message.email}
                    </a>
                    {message.phone ? (
                      <a
                        href={`tel:${message.phone}`}
                        className="inline-flex items-center gap-1.5 font-medium text-slate-600 hover:underline"
                      >
                        <Phone className="h-4 w-4" />
                        {message.phone}
                      </a>
                    ) : null}
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <ActionButton
                      variant={message.isRead ? "default" : "primary"}
                      disabled={pending}
                      onClick={() =>
                        run(() => markMessageRead(message.id, !message.isRead), "Message updated.")
                      }
                    >
                      {message.isRead ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                      Mark as {message.isRead ? "unread" : "read"}
                    </ActionButton>
                    <ActionButton
                      disabled={pending}
                      onClick={() =>
                        run(() => setMessageReplied(message.id, !message.isReplied), "Reply status updated.")
                      }
                    >
                      <CheckCheck className="h-4 w-4" />
                      {message.isReplied ? "Mark not replied" : "Mark as replied"}
                    </ActionButton>
                    <ActionButton
                      variant="danger"
                      disabled={pending}
                      onClick={() => {
                        if (window.confirm("Delete this message permanently?")) {
                          run(() => deleteMessage(message.id), "Message deleted.");
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