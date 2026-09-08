import Image from "next/image";
import { BadgeCheck, HeartHandshake, Route } from "lucide-react";

export function StorySection() {
  return (
    <section className="grid grid-cols-[1.05fr_.95fr] overflow-hidden rounded-xl border border-border-subtle bg-bg-muted shadow-card max-[860px]:grid-cols-1" aria-labelledby="about-story-title">
      <div className="relative min-h-[32rem] max-[860px]:min-h-[23rem]">
        <Image alt="A family sharing a carefully planned wildlife journey" className="object-cover object-[68%_center]" fill sizes="(max-width: 860px) 100vw, 52vw" src="/images/travel/why-choose-us-banner.webp" />
        <blockquote className="absolute bottom-5 left-5 right-5 m-0 max-w-md rounded-lg border border-white/25 bg-primary-ink/80 p-5 font-display text-lg font-semibold leading-snug text-white shadow-dropdown backdrop-blur-md">“A memorable route leaves room to notice where you are.”</blockquote>
      </div>
      <div className="flex flex-col justify-center p-[clamp(1.6rem,4vw,3.5rem)]">
        <p className="mb-3 text-[0.73rem] font-extrabold uppercase tracking-[0.17em] text-secondary-hover">The heart behind BR</p>
        <h2 className="m-0 font-display text-[clamp(1.85rem,3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-text-heading" id="about-story-title">Built for travellers who want a conversation, not a checkout funnel.</h2>
        <p className="mt-5 text-[0.98rem] leading-7 text-text-body">A good journey begins before a hotel or vehicle is selected. It begins by understanding your dates, pace, priorities and the moments that matter to you.</p>
        <p className="mt-3 text-[0.98rem] leading-7 text-text-muted">That is why BR uses an enquiry-led approach: shape the route together, review what is available, and confirm each important detail before you commit.</p>
        <ul className="mt-6 grid list-none gap-3 p-0 text-[0.88rem] font-bold text-primary">
          <li className="flex items-center gap-2"><HeartHandshake aria-hidden="true" size={18} /> Your priorities come first</li>
          <li className="flex items-center gap-2"><Route aria-hidden="true" size={18} /> Routes are paced realistically</li>
          <li className="flex items-center gap-2"><BadgeCheck aria-hidden="true" size={18} /> Details are reviewed before confirmation</li>
        </ul>
      </div>
    </section>
  );
}
