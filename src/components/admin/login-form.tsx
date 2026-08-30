"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { loginSchema } from "@/lib/validators";
import { loginAction, type LoginInput } from "@/lib/actions/auth";
import {
  FormField,
  FormInput,
  SubmitButton,
} from "@/components/site/form-fields";

export function LoginForm({ next }: { next?: string }) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(data: LoginInput) {
    startTransition(async () => {
      const result = await loginAction(data, next);
      if (!result.ok) {
        if (result.fieldErrors) {
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            setError(field as keyof LoginInput, { message: messages?.[0] });
          }
        }
        toast.error(result.message ?? "Could not sign in.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <FormField label="Email address" htmlFor="admin-email" required error={errors.email?.message}>
        <FormInput
          id="admin-email"
          type="email"
          autoComplete="email"
          placeholder="admin@saajpartners.com"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
      </FormField>
      <FormField label="Password" htmlFor="admin-password" required error={errors.password?.message}>
        <FormInput
          id="admin-password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          aria-invalid={!!errors.password}
          {...register("password")}
        />
      </FormField>
      <SubmitButton pending={isPending}>
        <Lock className="h-4 w-4" />
        Sign In
      </SubmitButton>
    </form>
  );
}