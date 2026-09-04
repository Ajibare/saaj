"use client";

import { Palette, Paintbrush } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

type BwToggleProps = {
  className?: string;
  onNavigate?: () => void;
};

export function BwToggle({ className, onNavigate }: BwToggleProps) {
  const { isBlackAndWhite, toggleBlackAndWhite } = useTheme();

  return (
    <button
      type="button"
      onClick={() => {
        toggleBlackAndWhite();
        onNavigate?.();
      }}
      aria-pressed={isBlackAndWhite}
      title={isBlackAndWhite ? "Switch to color" : "Switch to black & white"}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-lg border transition-colors",
        className
      )}
    >
      {isBlackAndWhite ? (
        <Palette className="h-5 w-5" />
      ) : (
        <Paintbrush className="h-5 w-5" />
      )}
      <span className="sr-only">
        {isBlackAndWhite ? "Switch to color" : "Switch to black and white"}
      </span>
    </button>
  );
}
