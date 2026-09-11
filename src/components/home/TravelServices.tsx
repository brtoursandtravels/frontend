import Link from "next/link";
import {
  ArrowRight,
  BusFront,
  CarFront,
  Check,
  MapPinned,
  MountainSnow,
  Palmtree,
} from "lucide-react";

const services = [
  {
    number: "01",
    icon: CarFront,
    title: "Car rentals & private transfers",
    description:
      "Comfortable point-to-point, airport and multi-city travel with a route planned around your timing.",
    subject: "Car Rental and Private Transfer",
  },
  {
    number: "02",
    icon: MountainSnow,
    title: "Adventure & nature tours",
    description:
      "Thoughtfully paced mountain, wildlife and outdoor journeys shaped for your comfort and experience level.",
    subject: "Adventure and Nature Tour",
  },
  {
    number: "03",
    icon: BusFront,
    title: "Bus & coach rentals",
    description:
      "Practical group transport for families, pilgrimages and private groups, matched to your route and party size.",
    subject: "Bus and Coach Rental",
  },
  {
    number: "04",
    icon: MapPinned,
    title: "Curated group tours",
    description:
      "End-to-end tour planning that brings transport, stays, sightseeing and daily coordination into one clear plan.",
    subject: "Curated Group Tour",
  },
  {
    number: "05",
    icon: Palmtree,
    title: "Domestic holiday packages",
    description:
      "Flexible holidays across India for couples, families and groups, personalised to your dates, pace and budget.",
    subject: "Domestic Holiday Package",
  },
] as const;

const serviceBenefits = [
  "Couples, families & groups",
  "One planning point of contact",
  "Clear inclusions before booking",
] as const;

export function TravelServices() {
  return (
    <section
      aria-labelledby="travel-services-title"
      className="defer-render overflow-hidden bg-primary-soft py-24 max-[820px]:py-[4.5rem]"
      id="services"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-[minmax(18rem,0.82fr)_minmax(0,1.4fr)] overflow-hidden rounded-xl border border-border-subtle bg-white shadow-card max-[920px]:grid-cols-1 sm:w-[calc(100%-4rem)] lg:w-[calc(100%-5rem)] max-sm:w-[calc(100%-2.5rem)]">
        <div className="relative isolate flex flex-col justify-between overflow-hidden bg-primary p-[clamp(1.5rem,4vw,3.5rem)] text-white">
          <span
            aria-hidden="true"
            className="absolute -right-24 -top-24 -z-1 size-72 rounded-full border-[4rem] border-white/5"
          />
          <span
            aria-hidden="true"
            className="absolute -bottom-28 -left-28 -z-1 size-80 rounded-full bg-secondary/15 blur-3xl"
          />

          <div>
            <p className="mb-4 flex items-center gap-3 text-[0.75rem] font-extrabold uppercase tracking-[0.18em] text-secondary-light">
              <span className="h-0.5 w-9 rounded-full bg-secondary-light" aria-hidden="true" />
              Our services
            </p>
            <h2
              className="m-0 max-w-xl text-balance font-display text-[clamp(2rem,4vw,3.35rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-white"
              id="travel-services-title"
            >
              Everything your journey needs, thoughtfully arranged.
            </h2>
            <p className="mb-0 mt-5 max-w-lg text-[0.96rem] leading-relaxed text-white/75">
              From a single transfer to a complete holiday, BR Tours &amp; Travels helps bring the moving parts together around one considered itinerary.
            </p>
          </div>

          <div className="mt-10 border-t border-white/15 pt-6">
            <p className="mb-4 text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-white/55">
              Planned with care
            </p>
            <ul className="m-0 grid list-none gap-3 p-0">
              {serviceBenefits.map((benefit) => (
                <li className="flex items-center gap-3 text-[0.85rem] font-bold text-white/85" key={benefit}>
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white/10 text-secondary-light">
                    <Check aria-hidden="true" size={14} strokeWidth={3} />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="px-[clamp(1.25rem,3vw,2.75rem)] py-3 max-[920px]:py-2">
          <ol className="m-0 list-none p-0">
            {services.map((service) => {
              const Icon = service.icon;
              const href = `/contact-us?subject=${encodeURIComponent(service.subject)}#contact-form`;

              return (
                <li
                  className="group grid grid-cols-[3.25rem_3rem_minmax(0,1fr)_auto] items-center gap-4 border-b border-border-subtle py-6 last:border-b-0 max-[620px]:grid-cols-[2.75rem_minmax(0,1fr)_auto] max-[620px]:gap-x-3 max-[620px]:gap-y-2 max-[620px]:py-5"
                  key={service.number}
                >
                  <span className="font-display text-[1.15rem] font-bold text-secondary" aria-hidden="true">
                    {service.number}
                  </span>
                  <span className="grid size-11 place-items-center rounded-lg bg-primary-soft text-primary transition duration-300 group-hover:bg-primary group-hover:text-white max-[620px]:hidden">
                    <Icon aria-hidden="true" size={21} strokeWidth={1.8} />
                  </span>
                  <div>
                    <h3 className="m-0 font-display text-[clamp(1rem,1.5vw,1.2rem)] font-semibold leading-tight text-text-heading">
                      {service.title}
                    </h3>
                    <p className="mb-0 mt-1.5 max-w-2xl text-[0.84rem] leading-relaxed text-text-muted">
                      {service.description}
                    </p>
                  </div>
                  <Link
                    aria-label={`Enquire about ${service.title}`}
                    className="grid size-10 place-items-center rounded-full border border-border-subtle text-primary no-underline transition duration-300 hover:border-primary hover:bg-primary hover:text-white group-hover:translate-x-0.5 max-[620px]:row-span-1"
                    href={href}
                    prefetch={false}
                  >
                    <ArrowRight aria-hidden="true" size={18} />
                  </Link>
                </li>
              );
            })}
          </ol>

          <div className="flex items-center justify-between gap-6 border-t border-border-subtle py-6 max-[620px]:flex-col max-[620px]:items-start">
            <div>
              <p className="m-0 text-sm font-extrabold text-text-heading">Not sure which service fits?</p>
              <p className="mb-0 mt-1 text-[0.82rem] text-text-muted">Tell us the trip you have in mind. We will help define the rest.</p>
            </div>
            <Link
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-br from-accent to-secondary px-6 py-3 text-sm font-extrabold text-white no-underline shadow-accent-sm transition hover:-translate-y-0.5 hover:shadow-glow max-[620px]:w-full"
              href="/contact-us?subject=Travel%20Planning#contact-form"
              prefetch={false}
            >
              Plan with us <ArrowRight aria-hidden="true" size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
