import { z } from "zod";
import {
  APPOINTMENT_TIMES,
  DEFAULT_SERVICE_OPTIONS,
  ESTIMATED_BUDGETS,
  PROJECT_CATEGORIES,
  PROJECT_STATUSES,
  PROJECT_TYPES,
} from "@/lib/constants";

// ---------------------------------------------------------------------------
// Public form submissions
// ---------------------------------------------------------------------------

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(120),
  email: z.email("Please enter a valid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{7,20}$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  subject: z.string().trim().min(3, "Please enter a subject").max(200),
  message: z.string().trim().min(10, "Please tell us a little more (at least 10 characters)").max(5000),
});

export const appointmentFormSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(120),
  email: z.email("Please enter a valid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{7,20}$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  company: z.string().trim().max(150).optional().or(z.literal("")),
  preferredDate: z.coerce.date("Please choose a date"),
  preferredTime: z.string().refine((v) => (APPOINTMENT_TIMES as readonly string[]).includes(v), {
    message: "Please choose a time slot",
  }),
  service: z.string().refine((v) => (DEFAULT_SERVICE_OPTIONS as readonly string[]).includes(v), {
    message: "Please choose a service",
  }),
  projectType: z
    .string()
    .refine((v) => (PROJECT_CATEGORIES as readonly string[]).includes(v) || v.length === 0, {
      message: "Please choose a project type",
    })
    .optional()
    .or(z.literal("")),
  message: z.string().trim().max(5000).optional().or(z.literal("")),
});

export const quoteRequestFormSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(120),
  email: z.email("Please enter a valid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{7,20}$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  company: z.string().trim().max(150).optional().or(z.literal("")),
  projectType: z
    .string()
    .refine((v) => (PROJECT_TYPES as readonly string[]).includes(v) || v.length === 0, {
      message: "Please choose a project type",
    })
    .optional()
    .or(z.literal("")),
  projectLocation: z.string().trim().max(200).optional().or(z.literal("")),
  estimatedBudget: z
    .string()
    .refine((v) => (ESTIMATED_BUDGETS as readonly string[]).includes(v) || v.length === 0, {
      message: "Please choose a budget range",
    })
    .optional()
    .or(z.literal("")),
  preferredStartDate: z.coerce.date().optional().or(z.literal("")),
  serviceRequired: z
    .string()
    .refine((v) => (DEFAULT_SERVICE_OPTIONS as readonly string[]).includes(v) || v.length === 0, {
      message: "Please choose a service",
    })
    .optional()
    .or(z.literal("")),
  projectDescription: z
    .string()
    .trim()
    .min(10, "Please describe your project (at least 10 characters)")
    .max(10000),
});

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// ---------------------------------------------------------------------------
// Admin mutations
// ---------------------------------------------------------------------------

export const serviceSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers and hyphens")
    .max(120),
  icon: z.string().trim().max(60).optional().or(z.literal("")),
  image: z.string().trim().max(500).optional().or(z.literal("")),
  shortDescription: z.string().trim().min(10).max(400),
  description: z.string().trim().min(10),
  benefits: z.array(z.string().trim().min(1)).optional().default([]),
  process: z
    .array(z.object({ title: z.string().trim().min(1), description: z.string().trim().min(1) }))
    .optional()
    .default([]),
  isPublished: z.boolean().optional().default(true),
  featured: z.boolean().optional().default(false),
  sortOrder: z.coerce.number().int().min(0).max(9999).optional().default(0),
});

export const projectSchema = z.object({
  name: z.string().trim().min(2).max(200),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers and hyphens")
    .max(200),
  location: z.string().trim().min(2).max(200),
  description: z.string().trim().min(10),
  category: z.enum(PROJECT_CATEGORIES as unknown as [string, ...string[]]),
  year: z.coerce.number().int().min(1950).max(2100).optional().nullable(),
  client: z.string().trim().max(200).optional().or(z.literal("")),
  status: z.enum(PROJECT_STATUSES.map((s) => s.value) as unknown as [string, ...string[]]),
  image: z.string().trim().max(500).optional().or(z.literal("")),
  gallery: z.array(z.string().trim().min(1)).optional().default([]),
  featured: z.boolean().optional().default(false),
  isPublished: z.boolean().optional().default(true),
});

export const blogCategorySchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers and hyphens")
    .max(120),
});

export const blogPostSchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers and hyphens")
    .max(200),
  image: z.string().trim().max(500).optional().or(z.literal("")),
  excerpt: z.string().trim().min(10).max(500),
  content: z.string().trim().min(10),
  author: z.string().trim().min(2).max(120).optional().or(z.literal("")),
  categoryId: z.string().trim().max(40).optional().or(z.literal("")),
  tags: z.array(z.string().trim().min(1)).optional().default([]),
  isPublished: z.boolean().optional().default(true),
  publishedAt: z.coerce.date().optional().nullable(),
  seoTitle: z.string().trim().max(70).optional().or(z.literal("")),
  seoDescription: z.string().trim().max(200).optional().or(z.literal("")),
});

export const testimonialSchema = z.object({
  name: z.string().trim().min(2).max(120),
  role: z.string().trim().max(120).optional().or(z.literal("")),
  company: z.string().trim().max(150).optional().or(z.literal("")),
  content: z.string().trim().min(10).max(2000),
  rating: z.coerce.number().int().min(1).max(5).optional().default(5),
  image: z.string().trim().max(500).optional().or(z.literal("")),
  isPublished: z.boolean().optional().default(true),
  isDemo: z.boolean().optional().default(false),
  sortOrder: z.coerce.number().int().min(0).max(9999).optional().default(0),
});

export const adminUserSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").optional().or(z.literal("")),
  role: z.enum(["admin", "editor"]),
  isActive: z.boolean().optional().default(true),
});

// ---------------------------------------------------------------------------
// Site settings
// ---------------------------------------------------------------------------

const optionalUrl = z
  .string()
  .trim()
  .refine((v) => v.length === 0 || /^https?:\/\/.+/.test(v), "Must be a valid HTTP(S) URL")
  .optional()
  .or(z.literal(""));

export const generalSettingsSchema = z.object({
  companyName: z.string().trim().min(2).max(150),
  tagline: z.string().trim().min(2).max(300),
  description: z.string().trim().min(10).max(5000),
  phone: z.string().trim().min(7).max(30),
  email: z.email("Please enter a valid email address"),
  address: z.string().trim().min(5).max(300),
  founded: z.string().trim().max(10).optional().or(z.literal("")),
  primaryContact: z.string().trim().max(120).optional().or(z.literal("")),
  logo: z.string().trim().max(500).optional().or(z.literal("")),
  favicon: z.string().trim().max(500).optional().or(z.literal("")),
});

export const socialSettingsSchema = z.object({
  facebook: optionalUrl,
  twitter: optionalUrl,
  instagram: optionalUrl,
  linkedin: optionalUrl,
  youtube: optionalUrl,
});

export const seoSettingsSchema = z.object({
  titleTemplate: z.string().trim().max(120).optional().or(z.literal("")),
  defaultTitle: z.string().trim().max(120).optional().or(z.literal("")),
  defaultDescription: z.string().trim().max(300).optional().or(z.literal("")),
  keywords: z.array(z.string().trim().min(1)).optional().default([]),
  ogImage: z.string().trim().max(500).optional().or(z.literal("")),
});

export const homeSettingsSchema = z.object({
  hero: z.object({
    title: z.string().trim().min(2).max(200),
    subtitle: z.string().trim().min(2).max(1000),
    image: z.string().trim().max(500).optional().or(z.literal("")),
    primaryCtaLabel: z.string().trim().max(80).optional().or(z.literal("")),
    secondaryCtaLabel: z.string().trim().max(80).optional().or(z.literal("")),
  }),
  intro: z.object({
    title: z.string().trim().max(200).optional().or(z.literal("")),
    content: z.string().trim().min(2),
    image: z.string().trim().max(500).optional().or(z.literal("")),
    ctaLabel: z.string().trim().max(80).optional().or(z.literal("")),
  }),
  whyChooseUs: z.object({
    title: z.string().trim().max(120).optional().or(z.literal("")),
    heading: z.string().trim().max(200).optional().or(z.literal("")),
    items: z.array(
      z.object({
        title: z.string().trim().min(1),
        description: z.string().trim().min(1),
        icon: z.string().trim().max(60).optional().or(z.literal("")),
      }),
    ),
  }),
  stats: z.object({
    title: z.string().trim().max(120).optional().or(z.literal("")),
    heading: z.string().trim().max(200).optional().or(z.literal("")),
    items: z.array(
      z.object({
        label: z.string().trim().min(1),
        value: z.coerce.number().int().min(0).max(999999),
        suffix: z.string().trim().max(6).optional().or(z.literal("")),
      }),
    ),
  }),
  process: z.object({
    title: z.string().trim().max(120).optional().or(z.literal("")),
    heading: z.string().trim().max(200).optional().or(z.literal("")),
    steps: z.array(
      z.object({
        title: z.string().trim().min(1),
        description: z.string().trim().min(1),
      }),
    ),
  }),
  cta: z.object({
    title: z.string().trim().max(200).optional().or(z.literal("")),
    content: z.string().trim().max(1000).optional().or(z.literal("")),
    primaryLabel: z.string().trim().max(80).optional().or(z.literal("")),
    secondaryLabel: z.string().trim().max(80).optional().or(z.literal("")),
    tertiaryLabel: z.string().trim().max(80).optional().or(z.literal("")),
  }),
});

export const aboutSettingsSchema = z.object({
  overview: z.object({
    title: z.string().trim().max(200).optional().or(z.literal("")),
    content: z.string().trim().min(2),
    image: z.string().trim().max(500).optional().or(z.literal("")),
  }),
  mission: z.string().trim().min(2),
  vision: z.string().trim().min(2),
  values: z.array(
    z.object({
      title: z.string().trim().min(1),
      description: z.string().trim().min(1),
    }),
  ),
  differentiators: z.array(z.string().trim().min(1)),
  approach: z.string().trim().min(2),
});

// ---------------------------------------------------------------------------
// Action result wrapper used across Server Actions
// ---------------------------------------------------------------------------

export type ActionResult<TData = null> =
  | { ok: true; message?: string; data?: TData }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> };

export function actionError(message: string, fieldErrors?: Record<string, string[]>): ActionResult {
  return { ok: false, message, fieldErrors };
}

export function actionSuccess<TData = null>(message?: string, data?: TData): ActionResult<TData> {
  return { ok: true, message, data };
}