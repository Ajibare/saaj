"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { APPOINTMENT_TIMES, PROJECT_CATEGORIES } from "@/lib/constants";
import { appointmentFormSchema, type ActionResult } from "@/lib/validators";
import { submitAppointment, type AppointmentInput } from "@/lib/actions/forms";
import {
  FormField,
  FormInput,
  FormSelect,
  FormTextarea,
  SubmitButton,
} from "@/components/site/form-fields";

export function AppointmentForm({ services }: { services: string[] }) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<AppointmentInput>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      preferredDate: "",
      preferredTime: "",
      service: "",
      projectType: "",
      message: "",
    },
  });

  function onSubmit(data: AppointmentInput) {
    startTransition(async () => {
      const result = (await submitAppointment(data)) as ActionResult;
      if (result.ok) {
        toast.success(result.message ?? "Appointment requested.");
        reset();
      } else {
        if (result.fieldErrors) {
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            setError(field as keyof AppointmentInput, { message: messages?.[0] });
          }
        }
        toast.error(result.message ?? "Could not submit your request.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Full name" htmlFor="appt-name" required error={errors.name?.message}>
          <FormInput
            id="appt-name"
            placeholder="Your full name"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
        </FormField>
        <FormField label="Email address" htmlFor="appt-email" required error={errors.email?.message}>
          <FormInput
            id="appt-email"
            type="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
        </FormField>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Phone (optional)" htmlFor="appt-phone" error={errors.phone?.message}>
          <FormInput
            id="appt-phone"
            type="tel"
            placeholder="+234 803 000 0000"
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
        </FormField>
        <FormField label="Company (optional)" htmlFor="appt-company" error={errors.company?.message}>
          <FormInput id="appt-company" placeholder="Company name" {...register("company")} />
        </FormField>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Preferred date" htmlFor="appt-date" required error={errors.preferredDate?.message}>
          <FormInput
            id="appt-date"
            type="date"
            aria-invalid={!!errors.preferredDate}
            {...register("preferredDate")}
          />
        </FormField>
        <FormField label="Preferred time" htmlFor="appt-time" required error={errors.preferredTime?.message}>
          <FormSelect
            id="appt-time"
            aria-invalid={!!errors.preferredTime}
            {...register("preferredTime")}
          >
            <option value="">Select a time</option>
            {APPOINTMENT_TIMES.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </FormSelect>
        </FormField>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Service needed" htmlFor="appt-service" required error={errors.service?.message}>
          <FormSelect
            id="appt-service"
            aria-invalid={!!errors.service}
            {...register("service")}
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </FormSelect>
        </FormField>
        <FormField label="Project type (optional)" htmlFor="appt-project" error={errors.projectType?.message}>
          <FormSelect
            id="appt-project"
            aria-invalid={!!errors.projectType}
            {...register("projectType")}
          >
            <option value="">Select project type</option>
            {PROJECT_CATEGORIES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </FormSelect>
        </FormField>
      </div>
      <FormField label="Notes (optional)" htmlFor="appt-message" error={errors.message?.message}>
        <FormTextarea
          id="appt-message"
          rows={4}
          placeholder="Anything we should prepare for your visit?"
          {...register("message")}
        />
      </FormField>
      <SubmitButton pending={isPending}>Request Appointment</SubmitButton>
    </form>
  );
}