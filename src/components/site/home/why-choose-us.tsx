import { SectionHeading } from "@/components/site/section-heading";
import { IconByName } from "@/components/site/icon";
import type { WhyChooseUsItem } from "@/lib/types";

export function WhyChooseUs({
  title,
  heading,
  items,
}: {
  title: string;
  heading: string;
  items: WhyChooseUsItem[];
}) {
  return (
    <section className="bg-slate-50 py-20 sm:py-24">
      <div className="container-site">
        <SectionHeading eyebrow={title} title={heading} />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-600/5"
            >
              <span className="absolute right-4 top-4 text-4xl font-bold text-slate-100 transition-colors group-hover:text-brand-50">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                <IconByName name={item.icon} size={24} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}