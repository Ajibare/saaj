import { prisma } from "@/lib/prisma";
import {
  COMPANY_DEFAULTS,
  DEFAULT_ABOUT_SETTINGS,
  DEFAULT_HOME_SETTINGS,
  DEFAULT_SEO_SETTINGS,
  DEFAULT_SOCIAL_SETTINGS,
} from "@/lib/constants";
import type {
  AboutSettings,
  GeneralSettings,
  HomeSettings,
  SeoSettings,
  SiteSettingsMap,
  SocialSettings,
} from "@/lib/types";

const GENERAL_FALLBACK: GeneralSettings = {
  companyName: COMPANY_DEFAULTS.name,
  tagline: COMPANY_DEFAULTS.tagline,
  description: COMPANY_DEFAULTS.description,
  phone: COMPANY_DEFAULTS.phone,
  email: COMPANY_DEFAULTS.email,
  address: COMPANY_DEFAULTS.address,
  founded: COMPANY_DEFAULTS.founded,
  primaryContact: COMPANY_DEFAULTS.primaryContact,
  logo: "/images/logo.svg",
};

function pick<T>(record: Record<string, unknown> | undefined, key: string, fallback: T): T {
  if (!record) return fallback;
  const value = record[key];
  if (value === undefined || value === null) return fallback;
  return { ...(fallback as object), ...(value as object) } as T;
}

export async function getSiteSettings(): Promise<Partial<SiteSettingsMap>> {
  try {
    const rows = await prisma.siteSetting.findMany();
    const record = Object.fromEntries(rows.map((row) => [row.key, row.value])) as Record<
      string,
      Record<string, unknown>
    >;
    return {
      general: pick(record, "general", GENERAL_FALLBACK),
      socials: pick(record, "socials", DEFAULT_SOCIAL_SETTINGS as SocialSettings),
      seo: pick(record, "seo", DEFAULT_SEO_SETTINGS as SeoSettings),
      home: pick(record, "home", DEFAULT_HOME_SETTINGS as HomeSettings),
      about: pick(record, "about", DEFAULT_ABOUT_SETTINGS as AboutSettings),
    };
  } catch {
    return {
      general: GENERAL_FALLBACK,
      socials: DEFAULT_SOCIAL_SETTINGS as SocialSettings,
      seo: DEFAULT_SEO_SETTINGS as SeoSettings,
      home: DEFAULT_HOME_SETTINGS as HomeSettings,
      about: DEFAULT_ABOUT_SETTINGS as AboutSettings,
    };
  }
}

export async function getGeneralSettings(): Promise<GeneralSettings> {
  const settings = await getSiteSettings();
  return settings.general ?? GENERAL_FALLBACK;
}

export async function getHomeSettings(): Promise<HomeSettings> {
  const settings = await getSiteSettings();
  return settings.home ?? (DEFAULT_HOME_SETTINGS as HomeSettings);
}

export async function getAboutSettings(): Promise<AboutSettings> {
  const settings = await getSiteSettings();
  return settings.about ?? (DEFAULT_ABOUT_SETTINGS as AboutSettings);
}

export async function getSeoSettings(): Promise<SeoSettings> {
  const settings = await getSiteSettings();
  return settings.seo ?? DEFAULT_SEO_SETTINGS;
}