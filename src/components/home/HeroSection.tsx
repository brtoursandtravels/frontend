import Link from "next/link";
import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";
import { TrustMetricsBar } from "./TrustMetricsBar";
import { animationClasses } from "@/lib/animations";
import { HeroImageSlider } from "./HeroImageSlider";

export function HeroSection({
  title,
}: {
  title: string;
}) {
  return (
    <section className="relative min-h-[calc(100svh-7.25rem)] overflow-hidden text-white max-[820px]:min-h-0">
      <HeroImageSlider />
      <div className="absolute inset-0 bg-primary-ink/[0.2] max-[820px]:bg-primary-ink/[0.45]" />
      <div className="relative z-2 mx-auto flex min-h-[calc(100svh-7.25rem)] w-full max-w-7xl flex-col justify-center px-5 py-[clamp(1.75rem,4vh,3rem)] sm:px-8 lg:px-10 max-[820px]:min-h-[48rem] max-[820px]:pb-8 max-[820px]:pt-[4.5rem]">
        <div className={`grid items-end gap-7 min-[1100px]:grid-cols-[minmax(0,1.25fr)_minmax(22rem,0.75fr)] min-[1100px]:gap-12 ${animationClasses.revealUp}`}>
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-primary-ink/35 px-3 py-2 text-[0.75rem] font-extrabold uppercase tracking-[0.08em] text-white [text-shadow:0_1px_5px_rgb(0_0_0_/_0.45)] max-[620px]:rounded-md max-[620px]:text-[0.7rem] max-[620px]:leading-[1.4]">
              <Sparkles aria-hidden="true" size={16} /> Tours and holidays in India and abroad
            </p>
            <h1 className="m-0 max-w-[18ch] text-balance break-words font-display text-[clamp(2.85rem,4.3vw,4.5rem)] font-medium leading-[0.98] tracking-[-0.045em] text-white [overflow-wrap:anywhere] [text-shadow:0_3px_16px_rgb(0_0_0_/_0.5)] max-[620px]:text-[clamp(2.5rem,11vw,3.5rem)]">{title}</h1>
          </div>
          <div className="flex flex-wrap gap-3 min-[1100px]:justify-end min-[1100px]:pb-1 max-[620px]:grid max-[620px]:grid-cols-1">
              <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-br from-accent to-secondary px-6 py-3 text-[0.9rem] font-extrabold text-white no-underline shadow-accent-md transition hover:-translate-y-0.5 hover:shadow-glow" href="/packages">
                View tour packages <ArrowUpRight aria-hidden="true" size={18} />
              </Link>
              <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/50 bg-white/10 px-6 py-3 text-[0.9rem] font-extrabold text-white no-underline transition hover:-translate-y-0.5 hover:bg-white/20" href="/contact-us">
                Plan my trip
              </Link>
          </div>
        </div>
        <TrustMetricsBar />
      </div>
      <a className="absolute bottom-8 right-8 z-3 flex size-11 animate-soft-float items-center justify-center rounded-full border border-white/30 bg-white/10 text-white motion-reduce:animate-none max-[620px]:hidden" href="#featured-destinations" aria-label="Scroll to featured destinations">
        <ArrowDown aria-hidden="true" size={18} />
      </a>
    </section>
  );
}
