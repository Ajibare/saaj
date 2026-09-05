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
 * Merge the provided patch into the existing settings record for a given key,
 * then validate the complete merged record. The admin forms submit one section
 * at a time (e.g. only `hero`), so the patch is validated against the full
 * record after defaults/stored values are merged back in.
 */
async function updateSetting(
  key: string,
  patch: Record<string, unknown>,
  schema: z.ZodTypeAny,
): Promise<ActionResult> {
  try {
    const current = await getSiteSettings();
    const existing = ((current as unknown as Record<string, unknown>)[key] ?? {}) as Record<
      string,
      unknown
    >;
    const merged = { ...existing, ...patch };
    const parsed = schema.safeParse(merged);
    if (!parsed.success) {
      return actionError(
        "Please correct the errors below.",
        z.flattenError(parsed.error).fieldErrors,
      );
    }
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: json(parsed.data) },
      create: { key, value: json(parsed.data) },
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
