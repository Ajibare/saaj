import { SectionHeading } from "@/components/site/section-heading";
import type { ProcessStep } from "@/lib/types";

export function Process({
  title,
  heading,
  steps,
}: {
  title: string;
  heading: string;
  steps: ProcessStep[];
}) {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="container-site">
        <SectionHeading eyebrow={title} title={heading} />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative rounded-xl border border-slate-200 bg-white p-6 transition-all hover:border-brand-300 hover:shadow-lg hover:shadow-brand-600/5"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}