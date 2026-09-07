import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";
import { AnimatedCanvasHero } from "./AnimatedCanvasHero";
import { TrustMetricsBar } from "./TrustMetricsBar";
import { animationClasses } from "@/lib/animations";

export function HeroSection({
  title,
}: {
  title: string;
}) {
  return (
    <section className="relative min-h-[calc(100svh-7.25rem)] overflow-hidden text-white max-[820px]:min-h-0">
      <Image
        alt="A winding Himalayan road at sunrise"
        className="scale-[1.015] object-cover object-center max-[820px]:object-[62%_center]"
        src="/images/tours/main-tours-hero.webp"
        fill
        loading="eager"
        fetchPriority="high"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-ink/90 via-primary-ink/65 to-black/15 max-[820px]:via-primary-ink/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary-ink/80 via-transparent to-transparent" />
      <AnimatedCanvasHero />
      <div className="relative z-2 mx-auto flex min-h-[calc(100svh-7.25rem)] w-full max-w-7xl flex-col justify-center px-5 py-[clamp(1.75rem,4vh,3rem)] sm:px-8 lg:px-10 max-[820px]:min-h-[48rem] max-[820px]:pb-8 max-[820px]:pt-[4.5rem]">
        <div className={`grid items-end gap-7 min-[1100px]:grid-cols-[minmax(0,1.25fr)_minmax(22rem,0.75fr)] min-[1100px]:gap-12 ${animationClasses.revealUp}`}>
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[0.72rem] font-extrabold uppercase tracking-[0.08em] text-accent-pale max-[620px]:rounded-md max-[620px]:text-[0.61rem] max-[620px]:leading-[1.4]">
              <Sparkles aria-hidden="true" size={16} /> Crafted luxury journeys across India & beyond
            </p>
            <h1 className="m-0 max-w-[17ch] text-balance break-words font-display text-[clamp(3.25rem,5vw,5.25rem)] font-medium leading-[0.94] tracking-[-0.05em] text-white [overflow-wrap:anywhere] max-[620px]:text-[clamp(2.8rem,13vw,4.25rem)]">{title}</h1>
          </div>
          <div className="flex flex-wrap gap-3 min-[1100px]:justify-end min-[1100px]:pb-1 max-[620px]:grid max-[620px]:grid-cols-1">
              <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-br from-accent to-secondary px-6 py-3 text-sm font-extrabold text-white no-underline shadow-accent-md transition hover:-translate-y-0.5 hover:shadow-glow" href="/packages">
                Explore journeys <ArrowUpRight aria-hidden="true" size={18} />
              </Link>
              <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/50 bg-white/10 px-6 py-3 text-sm font-extrabold text-white no-underline transition hover:-translate-y-0.5 hover:bg-white/20" href="/contact-us">
                Design my trip
              </Link>
          </div>
        </div>
        <TrustMetricsBar />
      </div>
      <a className="absolute bottom-8 right-8 z-3 flex size-11 animate-soft-float items-center justify-center rounded-full border border-white/30 bg-white/10 text-white motion-reduce:animate-none max-[620px]:hidden" href="#flagship-tours" aria-label="Scroll to flagship tours">
        <ArrowDown aria-hidden="true" size={18} />
      </a>
    </section>
  );
}
