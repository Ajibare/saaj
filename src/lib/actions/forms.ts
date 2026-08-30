"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  actionError,
  actionSuccess,
  appointmentFormSchema,
  contactFormSchema,
  quoteRequestFormSchema,
  type ActionResult,
} from "@/lib/validators";

export type ContactInput = z.input<typeof contactFormSchema>;
export type AppointmentInput = z.input<typeof appointmentFormSchema>;
export type QuoteInput = z.input<typeof quoteRequestFormSchema> & {
  attachmentUrl?: string | null;
  attachmentName?: string | null;
};

export async function submitContact(input: ContactInput): Promise<ActionResult> {
  const parsed = contactFormSchema.safeParse(input);
  if (!parsed.success) {
    return actionError("Please review the highlighted fields.", z.flattenError(parsed.error).fieldErrors);
  }

  try {
    const data = parsed.data;
    await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject,
        message: data.message,
      },
    });
    return actionSuccess("Thank you! Your message has been received. We will get back to you shortly.");
  } catch (error) {
    console.error("submitContact failed:", error);
    return actionError("Something went wrong. Please try again.");
  }
}

export async function submitAppointment(input: AppointmentInput): Promise<ActionResult> {
  const parsed = appointmentFormSchema.safeParse(input);
  if (!parsed.success) {
    return actionError("Please review the highlighted fields.", z.flattenError(parsed.error).fieldErrors);
  }

  try {
    const data = parsed.data;
    await prisma.appointment.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        service: data.service,
        projectType: data.projectType || null,
        message: data.message || null,
      },
    });
    return actionSuccess("Your appointment request has been submitted. We will confirm your booking shortly.");
  } catch (error) {
    console.error("submitAppointment failed:", error);
    return actionError("Something went wrong. Please try again.");
  }
}

export async function submitQuote(input: QuoteInput): Promise<ActionResult> {
  const parsed = quoteRequestFormSchema.safeParse(input);
  if (!parsed.success) {
    return actionError("Please review the highlighted fields.", z.flattenError(parsed.error).fieldErrors);
  }

  try {
    const data = parsed.data;
    await prisma.quoteRequest.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        projectType: data.projectType || null,
        projectLocation: data.projectLocation || null,
        estimatedBudget: data.estimatedBudget || null,
        preferredStartDate: data.preferredStartDate ? new Date(data.preferredStartDate) : null,
        serviceRequired: data.serviceRequired || null,
        projectDescription: data.projectDescription,
        attachmentUrl: input.attachmentUrl || null,
        attachmentName: input.attachmentName || null,
      },
    });
    return actionSuccess("Your quote request has been submitted. Our team will review it and respond promptly.");
  } catch (error) {
    console.error("submitQuote failed:", error);
    return actionError("Something went wrong. Please try again.");
  }
}