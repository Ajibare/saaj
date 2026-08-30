import { cn } from "@/lib/utils";

type LogoProps = {
  src?: string;
  alt?: string;
  className?: string;
  text?: string;
  textClassName?: string;
  imageClassName?: string;
};

export function Logo({
  src,
  alt = "SAAJ Partners and Consult",
  className,
  text,
  textClassName,
  imageClassName,
}: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- SVG logo/assets need <img> */}
      <img
        src={src ?? "/images/logo-mark.svg"}
        alt={alt}
        className={cn(
          "h-10 w-10 shrink-0 object-contain transition-transform duration-300 group-hover:scale-105",
          imageClassName
        )}
      />
      {text ? (
        <span className={cn("text-lg font-bold leading-tight", textClassName)}>
          {text}
        </span>
      ) : null}
    </span>
  );
}