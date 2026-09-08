import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Compass, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { ScrollRevealCard } from "@/components/home/ScrollRevealCard";

const steps = [
  {
    number: "01",
    icon: Compass,
    title: "Describe your dream trip",
    text: "Tell us about your ideal getaway—destinations, dates, travel style and the special moments you wish to experience.",
  },
  {
    number: "02",
    icon: UsersRound,
    title: "Get matched with experts",
    text: "Our verified regional travel specialists craft two tailored itinerary proposals with transparent pricing.",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Book with total confidence",
    text: "Fine-tune every day until it fits you perfectly. Confirm and book only when you are completely satisfied.",
  },
] as const;

export function CustomiseTripSection() {
  return (
    <section
      className="defer-render relative isolate overflow-hidden border-y border-secondary/15 py-14 max-[820px]:py-[4.5rem]"
      aria-labelledby="customise-trip-title"
    >
      <Image
        alt=""
        aria-hidden="true"
        className="customise-parallax-bg -z-2 object-cover object-center"
        fill
        sizes="100vw"
        src="/images/travel/customise-trip-watercolor-v1.webp"
      />
      <div className="absolute inset-0 -z-1 bg-white/38" aria-hidden="true" />

      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <header className="mx-auto max-w-3xl text-center">
          <p className="mb-3 inline-flex items-center gap-2 text-[0.75rem] font-extrabold uppercase tracking-[0.16em] text-secondary-hover">
            <Sparkles aria-hidden="true" size={16} /> Bespoke travel design
          </p>
          <h2
            className="m-0 text-balance font-display text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-text-heading"
            id="customise-trip-title"
          >
            Customise <span className="text-accent-hover">your trip with us.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-text-body">
            No pre-packaged compromises. Share your travel dreams and our destination specialists will shape every stay, route and private experience around you.
          </p>
        </header>

        <div className="relative mt-7 grid grid-cols-3 items-stretch gap-5 max-[900px]:grid-cols-1 max-[900px]:gap-4">
          <svg
            className="pointer-events-none absolute left-[16.5%] top-12 -z-1 h-16 w-[67%] text-secondary/55 max-[900px]:hidden"
            viewBox="0 0 800 70"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M 0 42 C 130 2, 260 2, 400 36 S 665 70, 800 25" fill="none" stroke="currentColor" strokeDasharray="7 9" strokeLinecap="round" strokeWidth="2" />
            <circle cx="400" cy="36" fill="currentColor" r="4" />
          </svg>

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div className="contents" key={step.number}>
                <ScrollRevealCard index={index}>
                  <article className="glass-card group flex h-full flex-col items-center rounded-xl p-[clamp(1.25rem,2vw,1.6rem)] text-center transition duration-300 hover:-translate-y-1.5 hover:border-secondary/50 hover:shadow-card-hover motion-reduce:transform-none motion-reduce:transition-none">
                    <div className="relative mb-4 grid size-16 place-items-center rounded-[43%_57%_52%_48%/56%_42%_58%_44%] border border-secondary/35 bg-[linear-gradient(145deg,var(--color-accent-soft),white_48%,var(--color-secondary-muted))] text-secondary-hover shadow-accent-sm motion-safe:animate-customise-glow">
                      <span className="font-display text-2xl font-bold" aria-hidden="true">{step.number}</span>
                    </div>
                    <Icon className="mb-3 text-primary" aria-hidden="true" size={23} strokeWidth={1.8} />
                    <h3 className="m-0 font-display text-[1.15rem] font-semibold leading-tight text-text-heading">{step.title}</h3>
                    <p className="mb-0 mt-2 text-[0.86rem] leading-relaxed text-text-muted">{step.text}</p>
                  </article>
                </ScrollRevealCard>
                {index < steps.length - 1 ? (
                  <span className="hidden h-7 items-center justify-center text-xl text-secondary max-[900px]:flex" aria-hidden="true">↓</span>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col items-center text-center">
          <Link
            className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-[0.9rem] font-extrabold text-white no-underline shadow-accent-md transition hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-glow-teal"
            href="/contact-us?subject=custom-trip#contact-form"
          >
            Start a Trip Request
            <ArrowRight className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none" aria-hidden="true" size={18} />
          </Link>
          <p className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[0.78rem] font-bold text-primary">
            <span className="inline-flex items-center gap-1"><Check aria-hidden="true" size={14} strokeWidth={3} /> 100% tailor-made</span>
            <span aria-hidden="true">•</span>
            <span>Zero booking obligation</span>
            <span aria-hidden="true">•</span>
            <span>Dedicated concierge</span>
          </p>
        </div>
      </div>
    </section>
  );
}
