"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  aboutSettingsSchema,
  actionError,
  actionSuccess,
  generalSettingsSchema,
  homeSettingsSchema,
  seoSettingsSchema,
  socialSettingsSchema,
  type ActionResult,
} from "@/lib/validators";
import { getSiteSettings } from "@/lib/settings";

export type HomeSettingsInput = z.input<typeof homeSettingsSchema>;
export type AboutSettingsInput = z.input<typeof aboutSettingsSchema>;
export type GeneralSettingsInput = z.input<typeof generalSettingsSchema>;
export type SocialSettingsInput = z.input<typeof socialSettingsSchema>;
export type SeoSettingsInput = z.input<typeof seoSettingsSchema>;

const json = (value: unknown): Prisma.InputJsonValue => value as unknown as Prisma.InputJsonValue;

/**
 * Merge the provided patch into the existing settings record for a given key.
 * Full-section updates keep the rest of each record intact when only a
 * subgroup is submitted.
 */
async function updateSetting(
  key: string,
  patch: Record<string, unknown>,
  schema: z.ZodTypeAny,
): Promise<ActionResult> {
  const parsed = schema.safeParse(patch);
  if (!parsed.success) {
    return actionError(
      "Please correct the errors below.",
      z.flattenError(parsed.error).fieldErrors,
    );
  }
  try {
    const current = await getSiteSettings();
    const existing = (current as unknown as Record<string, unknown>)[key] ?? {};
    const merged = { ...(existing as object), ...(parsed.data as object) };
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: json(merged) },
      create: { key, value: json(merged) },
    });
    revalidateAllSitePaths();
    return actionSuccess("Settings saved.");
  } catch (error) {
    console.error(`updateSetting(${key}) failed:`, error);
    return actionError("Could not save settings.");
  }
}

function revalidateAllSitePaths() {
  for (const path of ["/", "/about", "/services", "/projects", "/blog", "/contact", "/appointment", "/request-a-quote"]) {
    revalidatePath(path);
  }
}

// ---------------------------------------------------------------------------
// Home content
// ---------------------------------------------------------------------------

export async function updateHomeSettings(input: HomeSettingsInput): Promise<ActionResult> {
  return updateSetting("home", input as unknown as Record<string, unknown>, homeSettingsSchema);
}

// ---------------------------------------------------------------------------
// About content
// ---------------------------------------------------------------------------

export async function updateAboutSettings(input: AboutSettingsInput): Promise<ActionResult> {
  return updateSetting(
    "about",
    input as unknown as Record<string, unknown>,
    aboutSettingsSchema,
  );
}

// ---------------------------------------------------------------------------
// Site settings (general / socials / seo)
// ---------------------------------------------------------------------------

export async function updateGeneralSettings(input: GeneralSettingsInput): Promise<ActionResult> {
  return updateSetting(
    "general",
    input as unknown as Record<string, unknown>,
    generalSettingsSchema,
  );
}

export async function updateSocialSettings(input: SocialSettingsInput): Promise<ActionResult> {
  return updateSetting(
    "socials",
    input as unknown as Record<string, unknown>,
    socialSettingsSchema,
  );
}

export async function updateSeoSettings(input: SeoSettingsInput): Promise<ActionResult> {
  return updateSetting(
    "seo",
    input as unknown as Record<string, unknown>,
    seoSettingsSchema,
  );
}
