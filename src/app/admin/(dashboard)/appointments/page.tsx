import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AppointmentsManager } from "@/components/admin/appointments-manager";

export const metadata: Metadata = {
  title: "Appointments",
  robots: { index: false, follow: false },
};

export default async function AdminAppointmentsPage() {
  const appointments = await prisma.appointment.findMany({
    orderBy: { preferredDate: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Appointments</h1>
        <p className="mt-1 text-sm text-slate-500">
          Consultation bookings requested on the website.
        </p>
      </div>
      <AppointmentsManager
        appointments={appointments.map((a) => ({
          id: a.id,
          name: a.name,
          email: a.email,
          phone: a.phone,
          company: a.company,
          service: a.service,
          projectType: a.projectType,
          preferredDate: a.preferredDate.toISOString(),
          preferredTime: a.preferredTime,
          message: a.message,
          status: a.status,
          adminNotes: a.adminNotes,
          createdAt: a.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}