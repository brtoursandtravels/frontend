import { Quote, Star } from "lucide-react";
import { SectionHeader } from "@/components/common/SectionHeader";

type Testimonial = { id: string; publicName: string; quote: string; sortOrder: number };

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials.length) return null;
  return (
    <section className="py-24 max-[820px]:py-[4.5rem]">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeader
          eyebrow="Traveller stories"
          title="The details people remember."
          description="Published reflections from travellers who chose to share their BR experience."
          align="center"
        />
        <div className="columns-3 gap-5 max-[820px]:columns-2 max-[620px]:columns-1">
          {testimonials.slice(0, 6).map((item) => (
            <figure className="mb-5 break-inside-avoid rounded-xl border border-border-subtle bg-white p-6 shadow-card" key={item.id}>
              <Quote className="text-secondary" aria-hidden="true" size={28} />
              <div className="mt-4 flex gap-1 text-secondary" aria-hidden="true">
                {Array.from({ length: 5 }, (_, index) => <Star key={index} size={14} fill="currentColor" />)}
              </div>
              <blockquote className="my-4 font-display text-xl leading-relaxed text-text-heading">“{item.quote}”</blockquote>
              <figcaption className="text-xs font-extrabold uppercase tracking-wider text-primary">{item.publicName}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
