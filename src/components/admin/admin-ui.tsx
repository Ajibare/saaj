import { cn } from "@/lib/utils";
import { statusBadge } from "@/lib/constants";

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const badge = statusBadge(status);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        badge.className,
        className
      )}
    >
      {badge.label}
    </span>
  );
}

export function FilterTabs({
  tabs,
  active,
  onSelect,
}: {
  tabs: { value: string; label: string; count?: number }[];
  active: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onSelect(tab.value)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
            active === tab.value
              ? "bg-navy text-white"
              : "bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
          )}
        >
          {tab.label}
          {typeof tab.count === "number" && tab.count > 0 ? (
            <span
              className={cn(
                "rounded-full px-1.5 text-xs font-bold",
                active === tab.value ? "bg-white/20" : "bg-slate-100 text-slate-500"
              )}
            >
              {tab.count}
            </span>
          ) : null}
        </button>
      ))}
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <p className="text-sm font-medium text-slate-600">{title}</p>
      {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
    </div>
  );
}

export function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
      {initials || "?"}
    </span>
  );
}

export function ActionButton({
  onClick,
  variant = "default",
  disabled = false,
  children,
  className,
}: {
  onClick?: () => void;
  variant?: "default" | "primary" | "danger" | "ghost";
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-brand-600 text-white hover:bg-brand-700",
        variant === "default" &&
          "bg-white text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50",
        variant === "danger" && "text-rose-600 ring-1 ring-inset ring-rose-200 hover:bg-rose-50",
        variant === "ghost" && "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
        className
      )}
    >
      {children}
    </button>
  );
}