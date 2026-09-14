import { MapPin, Quote, Star } from "lucide-react";
import { SectionHeader } from "@/components/common/SectionHeader";

type Testimonial = {
  id: string;
  publicName: string;
  location: string | null;
  tripName: string | null;
  quote: string;
  rating: number;
  sortOrder: number;
  isDemo: boolean;
};

const sampleTestimonials: Testimonial[] = [
  {
    id: "sample-kashmir",
    publicName: "Aarav & Meera",
    location: "Mumbai",
    tripName: "Kashmir Valley Retreat",
    quote:
      "The itinerary felt relaxed without missing the places we cared about. The hotel choices suited our family, and every detail was explained clearly before the trip.",
    rating: 5,
    sortOrder: 0,
    isDemo: true,
  },
  {
    id: "sample-chardham",
    publicName: "Sunita P.",
    location: "Pune",
    tripName: "Complete Char Dham Yatra",
    quote:
      "The journey was planned at a comfortable pace for my parents. The team stayed in touch throughout and handled a weather-related route change calmly.",
    rating: 5,
    sortOrder: 1,
    isDemo: true,
  },
  {
    id: "sample-rajasthan",
    publicName: "Rohan K.",
    location: "Bengaluru",
    tripName: "Rajasthan Heritage Journey",
    quote:
      "We wanted history, local food and enough free time to explore. The final plan balanced all three, and the stays matched exactly what we had requested.",
    rating: 5,
    sortOrder: 2,
    isDemo: true,
  },
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

export function TestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const visibleTestimonials = (
    testimonials.length ? testimonials : sampleTestimonials
  ).slice(0, 6);

  return (
    <section className="defer-render relative overflow-hidden bg-bg-muted py-24 max-[820px]:py-[4.5rem]">
      <div
        className="pointer-events-none absolute -right-24 top-12 h-72 w-72 rounded-full bg-secondary/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeader
          eyebrow="Traveller stories"
          title="Journeys remembered in their own words."
          description="Genuine reflections shared by travellers after exploring with BR Tours and Travels."
          align="center"
        />

        <div
          className="grid grid-cols-12 gap-5 max-[620px]:gap-4"
          role="list"
          aria-label="Traveller testimonials"
        >
          {visibleTestimonials.map((item) => (
            <article
              className="group col-span-4 flex min-w-0 flex-col rounded-2xl border border-border-subtle bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-dropdown max-[920px]:col-span-6 max-[620px]:col-span-12 max-[620px]:p-5"
              key={item.id}
              role="listitem"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="grid gap-2">
                  {item.isDemo ? (
                    <span className="w-fit rounded-full bg-primary-soft px-2.5 py-1 text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-primary">
                      Sample review
                    </span>
                  ) : null}
                  <div
                    className="flex gap-1 text-secondary"
                    aria-label={`${item.rating} out of 5 stars`}
                  >
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        aria-hidden="true"
                        className={index < item.rating ? "" : "opacity-25"}
                        fill={index < item.rating ? "currentColor" : "none"}
                        key={index}
                        size={16}
                      />
                    ))}
                  </div>
                </div>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary/10 text-secondary transition group-hover:bg-secondary group-hover:text-white">
                  <Quote aria-hidden="true" size={20} />
                </span>
              </div>

              <blockquote className="my-6 grow font-display text-[1.18rem] leading-[1.65] text-text-heading max-[620px]:text-[1.08rem]">
                <span aria-hidden="true">&ldquo;</span>
                {item.quote}
                <span aria-hidden="true">&rdquo;</span>
              </blockquote>

              <footer className="flex items-center gap-3 border-t border-border-subtle pt-5">
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary font-display text-sm font-bold text-white"
                  aria-hidden="true"
                >
                  {initials(item.publicName)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold text-primary">
                    {item.publicName}
                  </p>
                  {item.tripName ? (
                    <p className="mt-0.5 truncate text-xs font-bold text-text-muted">
                      {item.tripName}
                    </p>
                  ) : null}
                  {item.location ? (
                    <p className="mt-1 flex items-center gap-1 text-[0.72rem] text-text-muted">
                      <MapPin aria-hidden="true" size={12} />
                      <span className="truncate">{item.location}</span>
                    </p>
                  ) : null}
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
