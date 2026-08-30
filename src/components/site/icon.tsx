import { createElement } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Building2,
  Calculator,
  ClipboardCheck,
  Container,
  DraftingCompass,
  Hammer,
  HardHat,
  Layers,
  PackageSearch,
  PiggyBank,
  Ruler,
  ShieldCheck,
  Users,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  layers: Layers,
  "piggy-bank": PiggyBank,
  ruler: Ruler,
  "clipboard-check": ClipboardCheck,
  users: Users,
  "shield-check": ShieldCheck,
  "hard-hat": HardHat,
  "drafting-compass": DraftingCompass,
  "package-search": PackageSearch,
  "building-2": Building2,
  container: Container,
  calculator: Calculator,
  briefcase: Briefcase,
};

export function resolveIcon(key?: string | null): LucideIcon {
  if (!key) return Hammer;
  return ICON_MAP[key] ?? Hammer;
}

/**
 * Stable component for rendering a DB-specified icon by key.
 * Uses createElement so the React Compiler does not flag a dynamic
 * component reference created during render.
 */
export function IconByName({
  name,
  className,
  size,
}: {
  name?: string | null;
  className?: string;
  size?: number;
}) {
  return createElement(resolveIcon(name), { className, size });
}