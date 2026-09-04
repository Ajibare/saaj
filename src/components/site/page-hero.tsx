import { AppImage } from "@/components/site/app-image";

type PageHeroProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  image?: string | null;
};

export function PageHero({ title, eyebrow, description, image }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <AppImage
        src={image ?? "/images/placeholders/generic.svg"}
        alt=""
        className="absolute inset-0 h-full w-full opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/85 to-brand-950/90" />
      <div className="absolute inset-0 bg-black/20" />
      <div className="container-site relative py-20 sm:py-24">
        {eyebrow ? (
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-accent-300">
            {eyebrow}
          </span>
        ) : null}
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">{title}</h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}