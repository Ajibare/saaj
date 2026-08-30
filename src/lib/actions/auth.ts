"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { compare } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, SESSION_DURATION, signSession } from "@/lib/auth";
import { actionError, loginSchema, type ActionResult } from "@/lib/validators";

export type LoginInput = z.input<typeof loginSchema>;

export async function loginAction(
  input: LoginInput,
  next?: string
): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors = z.flattenError(parsed.error).fieldErrors;
    return actionError("Please correct the errors below.", fieldErrors);
  }

  const admin = await prisma.adminUser.findUnique({
    where: { email: parsed.data.email.toLowerCase().trim() },
  });
  if (!admin || !admin.isActive) {
    return actionError("Invalid email or password.");
  }
  const valid = await compare(parsed.data.password, admin.passwordHash);
  if (!valid) {
    return actionError("Invalid email or password.");
  }

  const token = await signSession({
    sub: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
  });

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION,
  });

  const safeNext = next?.startsWith("/admin") ? next : "/admin";
  redirect(safeNext);
}

export async function logoutAction(): Promise<never> {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}