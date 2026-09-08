import Image from "next/image";
import { BookOpen, Sparkles } from "lucide-react";

export function BlogHero({ articleCount }: { articleCount: number }) {
  return (
    <section className="relative isolate min-h-[34rem] overflow-hidden border-b border-secondary/15 bg-primary-ink text-white" aria-labelledby="journal-title">
      <Image alt="A historic monastery overlooking the Spiti river and Himalayan high passes" className="-z-2 object-cover object-center max-[700px]:object-[63%_center]" fill priority sizes="100vw" src="/images/blog/journal-hero-v1.webp" />
      <div className="absolute inset-0 -z-1 bg-[linear-gradient(90deg,rgba(2,25,27,.48)_0%,rgba(2,25,27,.28)_44%,rgba(2,25,27,.08)_72%,transparent_100%)] max-[700px]:bg-[linear-gradient(90deg,rgba(2,25,27,.6),rgba(2,25,27,.2))]" aria-hidden="true" />
      <div className="mx-auto flex min-h-[34rem] w-full max-w-7xl items-center px-5 py-16 sm:px-8 lg:px-10">
        <div className="max-w-4xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[0.75rem] font-extrabold uppercase tracking-[0.16em] text-secondary-light backdrop-blur-sm"><Sparkles aria-hidden="true" size={15} /> Dispatches &amp; field guides</p>
          <h1 className="m-0 max-w-[18ch] text-balance font-display text-[clamp(2.85rem,4.3vw,4.5rem)] font-medium leading-[.98] tracking-[-0.045em] text-white [text-shadow:0_3px_16px_rgb(0_0_0_/_0.45)] max-[620px]:text-[clamp(2.5rem,11vw,3.5rem)]" id="journal-title">Notes for the curious traveller.</h1>
          <p className="mt-5 max-w-2xl text-[0.98rem] leading-relaxed text-white/76">Seasonal timing, practical planning advice and destination stories grounded in the journeys BR helps shape.</p>
          <p className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-primary-ink/45 px-4 py-2 text-[0.75rem] font-bold text-white/82 shadow-card backdrop-blur-md"><BookOpen className="text-secondary-light" aria-hidden="true" size={16} /> {articleCount} published {articleCount === 1 ? "dispatch" : "dispatches"}</p>
        </div>
      </div>
    </section>
  );
}
