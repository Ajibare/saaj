/**
 * Shared TypeScript shapes for content stored as JSON in the database.
 * The Prisma `Json` columns are typed as `Prisma.JsonValue`; these interfaces
 * describe the concrete shapes each setting record is expected to hold.
 */

export interface HeroSettings {
  title: string;
  subtitle: string;
  image: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
}

export interface WhyChooseUsItem {
  title: string;
  description: string;
  icon?: string;
}

export interface StatItem {
  label: string;
  value: number;
  suffix?: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface HomeSettings {
  hero: HeroSettings;
  intro: {
    title: string;
    content: string;
    image: string;
    ctaLabel: string;
  };
  whyChooseUs: {
    title: string;
    heading: string;
    items: WhyChooseUsItem[];
  };
  stats: {
    title: string;
    heading: string;
    items: StatItem[];
  };
  process: {
    title: string;
    heading: string;
    steps: ProcessStep[];
  };
  cta: {
    title: string;
    content: string;
    primaryLabel: string;
    secondaryLabel: string;
    tertiaryLabel: string;
    image?: string;
  };
}

export interface AboutSettings {
  overview: {
    title: string;
    content: string;
    image?: string;
  };
  mission: string;
  vision: string;
  values: { title: string; description: string }[];
  differentiators: string[];
  approach: string;
}

export interface GeneralSettings {
  companyName: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  founded: string;
  primaryContact: string;
  logo?: string;
  favicon?: string;
}

export interface SocialSettings {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
}

export interface SeoSettings {
  titleTemplate?: string;
  defaultTitle?: string;
  defaultDescription?: string;
  keywords?: string[];
  ogImage?: string;
}

export type SiteSettingsMap = {
  general: GeneralSettings;
  socials: SocialSettings;
  seo: SeoSettings;
  home: HomeSettings;
  about: AboutSettings;
};