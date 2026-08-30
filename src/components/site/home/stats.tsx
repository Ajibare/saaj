import { SectionHeading } from "@/components/site/section-heading";
import type { StatItem } from "@/lib/types";

export function Stats({
  title,
  heading,
  items,
}: {
  title: string;
  heading: string;
  items: StatItem[];
}) {
  if (!items.length) return null;
  return (
    <section className="relative overflow-hidden bg-navy py-20">
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-brand-950" />
      <div className="container-site relative">
        <SectionHeading eyebrow={title} title={heading} dark />
        <div className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur"
            >
              <p className="text-4xl font-bold text-white">
                {item.value.toLocaleString()}
                {item.suffix ? <span className="text-brand-400">{item.suffix}</span> : null}
              </p>
              <p className="mt-2 text-sm font-medium text-slate-300">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}