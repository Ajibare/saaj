import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { QuotesManager } from "@/components/admin/quotes-manager";

export const metadata: Metadata = {
  title: "Quote Requests",
  robots: { index: false, follow: false },
};

export default async function AdminQuotesPage() {
  const quotes = await prisma.quoteRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Quote Requests</h1>
        <p className="mt-1 text-sm text-slate-500">
          Project quotation requests submitted on the website.
        </p>
      </div>
      <QuotesManager
        quotes={quotes.map((q) => ({
          id: q.id,
          name: q.name,
          email: q.email,
          phone: q.phone,
          company: q.company,
          projectType: q.projectType,
          projectLocation: q.projectLocation,
          estimatedBudget: q.estimatedBudget,
          preferredStartDate: q.preferredStartDate?.toISOString() ?? null,
          serviceRequired: q.serviceRequired,
          projectDescription: q.projectDescription,
          attachmentUrl: q.attachmentUrl,
          attachmentName: q.attachmentName,
          status: q.status,
          adminNotes: q.adminNotes,
          createdAt: q.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}