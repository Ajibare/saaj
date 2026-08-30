import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { MessagesManager } from "@/components/admin/messages-manager";

export const metadata: Metadata = {
  title: "Messages",
  robots: { index: false, follow: false },
};

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Messages</h1>
        <p className="mt-1 text-sm text-slate-500">
          Messages sent through the website contact form.
        </p>
      </div>
      <MessagesManager
        messages={messages.map((m) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          phone: m.phone,
          subject: m.subject,
          message: m.message,
          isRead: m.isRead,
          isReplied: m.isReplied,
          createdAt: m.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}