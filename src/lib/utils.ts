import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Convert any string to a URL-friendly slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Format a Date to e.g. "12 March 2026". */
export function formatDate(
  date: Date | string | null | undefined,
  options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" },
): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-NG", options).format(d);
}

/** Format a Date to a short date-time for admin tables. */
export function formatDateTime(date: Date | string | null | undefined): string {
  return formatDate(date, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Truncate a string to maxLength characters, preserving whole words. */
export function truncate(text: string, maxLength = 140): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLength)}…`;
}

/** Parse a string back to a typed value stored in a JSON field. */
export function parseJson<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "object") return value as T;
  try {
    return JSON.parse(value as string) as T;
  } catch {
    return fallback;
  }
}

/** Initials from a person's name, e.g. "Stephen Ajibare" -> "SA". */
export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** Build an absolute URL for a given pathname (for canonical/OG metadata). */
export function absoluteUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  if (path.startsWith("http")) return path;
  return `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Safely read a string[] from a JSON DB field. */
export function asStringArray(value: unknown): string[] {
  const parsed = parseJson<unknown>(value, []);
  return Array.isArray(parsed) ? (parsed as string[]) : [];
}

/** Safely read a record from a JSON DB field. */
export function asObject<T extends Record<string, unknown>>(value: unknown, fallback: T): T {
  const parsed = parseJson<unknown>(value, fallback);
  return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)
    ? (parsed as T)
    : fallback;
}

/** Safely read an array from a JSON DB field. */
export function asArray<T>(value: unknown, fallback: T[] = []): T[] {
  const parsed = parseJson<unknown>(value, fallback);
  return Array.isArray(parsed) ? (parsed as T[]) : fallback;
}