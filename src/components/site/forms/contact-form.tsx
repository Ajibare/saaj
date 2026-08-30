"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { contactFormSchema, type ActionResult } from "@/lib/validators";
import { submitContact, type ContactInput } from "@/lib/actions/forms";
import {
  FormField,
  FormInput,
  FormTextarea,
  SubmitButton,
} from "@/components/site/form-fields";

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "" },
  });

  function onSubmit(data: ContactInput) {
    startTransition(async () => {
      const result = (await submitContact(data)) as ActionResult;
      if (result.ok) {
        toast.success(result.message ?? "Message sent.");
        reset();
      } else {
        if (result.fieldErrors) {
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            setError(field as keyof ContactInput, { message: messages?.[0] });
          }
        }
        toast.error(result.message ?? "Could not send your message.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Full name" htmlFor="contact-name" required error={errors.name?.message}>
          <FormInput
            id="contact-name"
            placeholder="Your full name"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
        </FormField>
        <FormField label="Email address" htmlFor="contact-email" required error={errors.email?.message}>
          <FormInput
            id="contact-email"
            type="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
        </FormField>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Phone (optional)" htmlFor="contact-phone" error={errors.phone?.message}>
          <FormInput
            id="contact-phone"
            type="tel"
            placeholder="+234 803 000 0000"
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
        </FormField>
        <FormField label="Subject" htmlFor="contact-subject" required error={errors.subject?.message}>
          <FormInput
            id="contact-subject"
            placeholder="How can we help?"
            aria-invalid={!!errors.subject}
            {...register("subject")}
          />
        </FormField>
      </div>
      <FormField label="Message" htmlFor="contact-message" required error={errors.message?.message}>
        <FormTextarea
          id="contact-message"
          rows={6}
          placeholder="Tell us about your question or project…"
          aria-invalid={!!errors.message}
          {...register("message")}
        />
      </FormField>
      <SubmitButton pending={isPending}>Send Message</SubmitButton>
    </form>
  );
}