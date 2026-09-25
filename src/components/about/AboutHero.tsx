import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Headphones, MapPinCheck, ShieldCheck, Sparkles, Star } from "lucide-react";

const trustItems = [
  { icon: Star, value: "4.9/5", label: "Traveller rating" },
  { icon: MapPinCheck, value: "Checked", label: "Hotels and guides" },
  { icon: ShieldCheck, value: "Clear", label: "Booking details" },
  { icon: Headphones, value: "24/7", label: "Help during your trip" },
] as const;

export function AboutHero() {
  return (
    <section className="relative isolate min-h-[34rem] overflow-hidden bg-primary-ink text-white" aria-labelledby="about-hero-title">
      <Image alt="A traveller looking over a valley in the Himalayas at sunrise" className="-z-2 object-cover object-center max-[700px]:object-[63%_center]" fetchPriority="high" fill loading="eager" sizes="100vw" src="/images/travel/about-hero-v2.webp" />
      <div className="absolute inset-0 -z-1 bg-[linear-gradient(90deg,rgba(2,35,36,.48)_0%,rgba(2,35,36,.27)_45%,rgba(2,35,36,.06)_76%,transparent_100%)] max-[700px]:bg-[linear-gradient(90deg,rgba(2,35,36,.58),rgba(2,35,36,.18))]" />
      <div className="mx-auto flex min-h-[34rem] w-full max-w-7xl flex-col justify-center px-5 py-12 sm:px-8 lg:px-10">
        <div className="max-w-[46rem]">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[0.75rem] font-extrabold uppercase tracking-[0.16em] text-secondary-light backdrop-blur-sm"><Sparkles aria-hidden="true" size={15} /> About us</p>
          <h1 className="m-0 font-display text-[clamp(2.85rem,4.3vw,4.5rem)] font-medium leading-[0.98] tracking-[-0.045em] text-white [text-shadow:0_3px_16px_rgb(0_0_0_/_0.45)] max-[620px]:text-[clamp(2.5rem,11vw,3.5rem)]" id="about-hero-title">
            We help you plan your trip.
          </h1>
          <p className="mt-5 max-w-[39rem] text-[0.98rem] leading-relaxed text-white/78">Tell us where you want to go, your travel dates and your budget. Our team will help you plan the trip and explain the details before you book.</p>
          <Link className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-extrabold text-white no-underline shadow-accent-md transition hover:-translate-y-0.5 hover:bg-accent-hover" href="/contact-us?subject=custom-trip#contact-form">Plan your trip <ArrowRight aria-hidden="true" size={18} /></Link>
        </div>
        <div className="mt-8 grid max-w-5xl grid-cols-4 gap-2 max-[800px]:grid-cols-2" aria-label="BR Tours service highlights">
          {trustItems.map(({ icon: Icon, value, label }) => (
            <div className="flex items-center gap-3 rounded-lg border border-white/18 bg-primary-ink/45 px-4 py-3 backdrop-blur-md" key={label}>
              <Icon className="shrink-0 text-secondary-light" aria-hidden="true" size={20} />
              <p className="m-0 grid leading-tight"><strong className="text-[0.95rem] text-white">{value}</strong><span className="text-[0.75rem] text-white/70">{label}</span></p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
