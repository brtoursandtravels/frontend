import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Headphones, Map, ShieldCheck, Sparkles } from "lucide-react";

const pillars = [
  { icon: Sparkles, title: "Plans that suit you", text: "We start with your dates, interests, budget and the help you need." },
  { icon: Map, title: "Time to enjoy each place", text: "We plan the route with time for travel, sightseeing and rest." },
  { icon: ShieldCheck, title: "Clear details before booking", text: "We check what is available and explain the costs and what is included." },
  { icon: Headphones, title: "A team you can contact", text: "Talk to our team when you need help with your plans or your trip." },
];

export function WhyChooseUs() {
  return (
    <section className="defer-render relative min-h-[40rem] overflow-hidden max-[620px]:min-h-[60rem]">
      <Image
        alt="A family enjoying a wildlife trip"
        src="/images/travel/why-choose-us-banner.webp"
        className="object-cover object-center max-[620px]:object-[68%_center]"
        fill
        sizes="100vw"
      />
      <span className="absolute inset-0 bg-gradient-to-r from-primary-ink/90 via-primary-ink/45 to-transparent" />
      <div className="relative z-2 mx-auto flex min-h-[40rem] w-full max-w-7xl items-center px-5 py-8 sm:px-8 lg:px-10 max-[620px]:min-h-[60rem] max-[620px]:py-16">
        <div className="glass-dark my-0 max-w-2xl rounded-xl p-[clamp(1.4rem,2vw,1.75rem)] text-white max-[620px]:my-8">
          <p className="mb-2 text-[0.75rem] font-extrabold uppercase tracking-[0.16em] text-secondary-light">Why choose us</p>
          <h2 className="m-0 font-display text-[clamp(1.85rem,2.5vw,2.5rem)] font-semibold leading-[1.08] text-white">Why choose BR Tours &amp; Travels</h2>
          <p className="mt-3 text-[1rem] font-bold leading-relaxed text-white">Trip planning made easier.</p>
          <p className="mt-2 text-base leading-relaxed text-white/78">We help you choose what suits you and explain the details before you book.</p>
          <div className="my-5 grid gap-3">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <article className="grid grid-cols-[2.25rem_1fr] gap-3 border-t border-white/15 pt-3" key={pillar.title}>
                  <Icon className="text-secondary-light" aria-hidden="true" size={21} />
                  <div><h3 className="m-0 text-[0.93rem] font-extrabold text-white">{pillar.title}</h3><p className="mt-1 text-[0.85rem] leading-relaxed text-white/70">{pillar.text}</p></div>
                </article>
              );
            })}
          </div>
          <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-br from-accent to-secondary px-6 py-3 text-sm font-extrabold text-white no-underline transition hover:-translate-y-0.5 hover:shadow-glow" href="/about-us">
            About BR Tours <ArrowUpRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
