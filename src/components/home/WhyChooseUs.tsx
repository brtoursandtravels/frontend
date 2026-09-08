import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Headphones, Map, ShieldCheck, Sparkles } from "lucide-react";

const pillars = [
  { icon: Sparkles, title: "Designed around you", text: "We begin with your pace, priorities and practical needs—not a generic template." },
  { icon: Map, title: "Grounded local insight", text: "Routes and experiences are shaped with real destination context and sensible timing." },
  { icon: ShieldCheck, title: "Clarity before commitment", text: "Prices, inclusions and availability are reviewed before anything is treated as confirmed." },
  { icon: Headphones, title: "A human when it matters", text: "A dedicated conversation stays at the centre of planning and support." },
];

export function WhyChooseUs() {
  return (
    <section className="defer-render relative min-h-[40rem] overflow-hidden max-[620px]:min-h-[60rem]">
      <Image
        alt="Family enjoying a thoughtfully planned wildlife safari"
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
          <p className="mt-3 text-[1rem] font-bold leading-relaxed text-white">Personal enough to feel effortless.</p>
          <p className="mt-2 text-base leading-relaxed text-white/78">Thoughtful planning is less about adding more and more about choosing well.</p>
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
            Meet BR Tours <ArrowUpRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
