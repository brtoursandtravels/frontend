import Image from "next/image";
import { BadgeCheck, HeartHandshake, Route } from "lucide-react";

export function StorySection() {
  return (
    <section className="grid grid-cols-[1.05fr_.95fr] overflow-hidden rounded-xl border border-border-subtle bg-bg-muted shadow-card max-[860px]:grid-cols-1" aria-labelledby="about-story-title">
      <div className="relative min-h-[32rem] max-[860px]:min-h-[23rem]">
        <Image alt="A family enjoying a wildlife trip" className="object-cover object-[68%_center]" fill sizes="(max-width: 860px) 100vw, 52vw" src="/images/travel/why-choose-us-banner.webp" />
        <blockquote className="absolute bottom-5 left-5 right-5 m-0 max-w-md rounded-lg border border-white/25 bg-primary-ink/80 p-5 font-display text-lg font-semibold leading-snug text-white shadow-dropdown backdrop-blur-md">“A good trip gives you time to enjoy each place.”</blockquote>
      </div>
      <div className="flex flex-col justify-center p-[clamp(1.6rem,4vw,3.5rem)]">
        <p className="mb-3 text-[0.75rem] font-extrabold uppercase tracking-[0.16em] text-secondary-hover">Our approach</p>
        <h2 className="m-0 font-display text-[clamp(1.85rem,3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-text-heading" id="about-story-title">Your trip starts with a conversation.</h2>
        <p className="mt-5 text-[0.98rem] leading-7 text-text-body">We first ask about your travel dates, budget and who is coming with you. We also ask what you would like to see and how much time you want at each stop.</p>
        <p className="mt-3 text-[0.98rem] leading-7 text-text-muted">Then we plan the trip with you, check which hotels and transport are available, and explain the details before you decide to book.</p>
        <ul className="mt-6 grid list-none gap-3 p-0 text-[0.9rem] font-bold text-primary">
          <li className="flex items-center gap-2"><HeartHandshake aria-hidden="true" size={18} /> Tell us what matters to you</li>
          <li className="flex items-center gap-2"><Route aria-hidden="true" size={18} /> Time to travel and enjoy each stop</li>
          <li className="flex items-center gap-2"><BadgeCheck aria-hidden="true" size={18} /> Clear details before you book</li>
        </ul>
      </div>
    </section>
  );
}
