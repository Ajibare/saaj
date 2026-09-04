import { AppImage } from "@/components/site/app-image";

type OnSiteBandProps = {
  title?: string;
  image?: string;
};

export function OnSiteBand({
  title = "On the ground, delivering quality",
  image = "/images/placeholders/project.svg",
}: OnSiteBandProps) {
  return (
    <section className="relative overflow-hidden bg-navy">
      <AppImage
        src={image}
        alt="SAAJ construction team working on site"
        className="absolute inset-0 h-full w-full opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/70 to-transparent" />
      <div className="container-site relative py-24 sm:py-32">
        <div className="max-w-xl">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-accent-300">
            On Site
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
          <p className="mt-4 text-base leading-relaxed text-white/90">
            Our engineers, site supervisors and craftsmen work hand-in-hand to
            keep every project on schedule, on budget and built to last.
          </p>
        </div>
      </div>
    </section>
  );
}
