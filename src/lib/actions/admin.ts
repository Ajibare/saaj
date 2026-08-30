"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { APPOINTMENT_STATUSES, QUOTE_STATUSES } from "@/lib/constants";
import { actionError, actionSuccess, type ActionResult } from "@/lib/validators";

const statusValues = (list: readonly { value: string }[]) =>
  list.map((s) => s.value) as [string, ...string[]];

async function logActivity(action: string, detail?: string) {
  try {
    await prisma.activityLog.create({ data: { action, detail } });
  } catch {
    // activity logging must never block a mutation
  }
}

const idSchema = z.string().min(1);

// ---------------------------------------------------------------------------
// Contact messages
// ---------------------------------------------------------------------------

export async function markMessageRead(id: string, read: boolean): Promise<ActionResult> {
  if (!idSchema.safeParse(id).success) return actionError("Invalid message id.");
  try {
    await prisma.contactMessage.update({ where: { id }, data: { isRead: read } });
    revalidatePath("/admin/messages");
    revalidatePath("/admin");
    return actionSuccess();
  } catch {
    return actionError("Could not update the message.");
  }
}

export async function setMessageReplied(id: string, replied: boolean): Promise<ActionResult> {
  if (!idSchema.safeParse(id).success) return actionError("Invalid message id.");
  try {
    await prisma.contactMessage.update({ where: { id }, data: { isReplied: replied } });
    await logActivity("Message reply toggled", id);
    revalidatePath("/admin/messages");
    revalidatePath("/admin");
    return actionSuccess();
  } catch {
    return actionError("Could not update the message.");
  }
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  if (!idSchema.safeParse(id).success) return actionError("Invalid message id.");
  try {
    await prisma.contactMessage.delete({ where: { id } });
    await logActivity("Message deleted", id);
    revalidatePath("/admin/messages");
    revalidatePath("/admin");
    return actionSuccess();
  } catch {
    return actionError("Could not delete the message.");
  }
}

// ---------------------------------------------------------------------------
// Appointments
// ---------------------------------------------------------------------------

export async function setAppointmentStatus(id: string, status: string): Promise<ActionResult> {
  if (!idSchema.safeParse(id).success) return actionError("Invalid appointment id.");
  const parsed = z.enum(statusValues(APPOINTMENT_STATUSES)).safeParse(status);
  if (!parsed.success) return actionError("Invalid status.");
  try {
    await prisma.appointment.update({ where: { id }, data: { status: parsed.data } });
    await logActivity("Appointment status updated", parsed.data);
    revalidatePath("/admin/appointments");
    revalidatePath("/admin");
    return actionSuccess();
  } catch {
    return actionError("Could not update the appointment.");
  }
}

export async function saveAppointmentNotes(id: string, notes: string): Promise<ActionResult> {
  if (!idSchema.safeParse(id).success) return actionError("Invalid appointment id.");
  try {
    await prisma.appointment.update({ where: { id }, data: { adminNotes: notes.trim() || null } });
    await logActivity("Appointment notes saved", id);
    revalidatePath("/admin/appointments");
    return actionSuccess();
  } catch {
    return actionError("Could not save notes.");
  }
}

export async function deleteAppointment(id: string): Promise<ActionResult> {
  if (!idSchema.safeParse(id).success) return actionError("Invalid appointment id.");
  try {
    await prisma.appointment.delete({ where: { id } });
    await logActivity("Appointment deleted", id);
    revalidatePath("/admin/appointments");
    revalidatePath("/admin");
    return actionSuccess();
  } catch {
    return actionError("Could not delete the appointment.");
  }
}

// ---------------------------------------------------------------------------
// Quote requests
// ---------------------------------------------------------------------------

export async function setQuoteStatus(id: string, status: string): Promise<ActionResult> {
  if (!idSchema.safeParse(id).success) return actionError("Invalid quote id.");
  const parsed = z.enum(statusValues(QUOTE_STATUSES)).safeParse(status);
  if (!parsed.success) return actionError("Invalid status.");
  try {
    await prisma.quoteRequest.update({ where: { id }, data: { status: parsed.data } });
    await logActivity("Quote status updated", parsed.data);
    revalidatePath("/admin/quotes");
    revalidatePath("/admin");
    return actionSuccess();
  } catch {
    return actionError("Could not update the quote request.");
  }
}

export async function saveQuoteNotes(id: string, notes: string): Promise<ActionResult> {
  if (!idSchema.safeParse(id).success) return actionError("Invalid quote id.");
  try {
    await prisma.quoteRequest.update({ where: { id }, data: { adminNotes: notes.trim() || null } });
    await logActivity("Quote notes saved", id);
    revalidatePath("/admin/quotes");
    return actionSuccess();
  } catch {
    return actionError("Could not save notes.");
  }
}

export async function deleteQuote(id: string): Promise<ActionResult> {
  if (!idSchema.safeParse(id).success) return actionError("Invalid quote id.");
  try {
    await prisma.quoteRequest.delete({ where: { id } });
    await logActivity("Quote request deleted", id);
    revalidatePath("/admin/quotes");
    revalidatePath("/admin");
    return actionSuccess();
  } catch {
    return actionError("Could not delete the quote request.");
  }
}