import { Quote, Star } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";

export type TestimonialData = {
  id: string;
  name: string;
  role?: string | null;
  company?: string | null;
  content: string;
  rating?: number | null;
};

function Stars({ rating }: { rating?: number | null }) {
  const count = rating ?? 5;
  return (
    <div className="flex items-center gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < count ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`}
        />
      ))}
    </div>
  );
}

export function Testimonials({
  title,
  heading,
  items,
}: {
  title: string;
  heading: string;
  items: TestimonialData[];
}) {
  if (!items.length) return null;
  return (
    <section className="bg-slate-50 py-20 sm:py-24">
      <div className="container-site">
        <SectionHeading eyebrow={title} title={heading} />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <figure
              key={item.id}
              className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-brand-300 hover:shadow-lg hover:shadow-brand-600/5"
            >
              <Quote className="h-8 w-8 text-brand-200" />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-700">
                {item.content}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {item.name
                    .split(" ")
                    .slice(0, 2)
                    .map((part) => part[0]?.toUpperCase() ?? "")
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">
                    {item.role ? `${item.role}${item.company ? `, ${item.company}` : ""}` : item.company}
                  </p>
                </div>
                <div className="ml-auto">
                  <Stars rating={item.rating} />
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}