import { cn } from "@/lib/utils";

type AppImageProps = {
  src?: string | null;
  alt?: string;
  className?: string;
  loading?: "lazy" | "eager";
  width?: number;
  height?: number;
};

export function AppImage({
  src,
  alt = "",
  className,
  loading = "lazy",
  width,
  height,
}: AppImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- source assets may be SVGs; next/image unsupported here
    <img
      src={src ?? "/images/placeholders/generic.svg"}
      alt={alt}
      loading={loading}
      width={width}
      height={height}
      className={cn("object-cover", className)}
    />
  );
}