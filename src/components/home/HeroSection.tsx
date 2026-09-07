import Image from "next/image";
import Link from "next/link";
import { ArrowDown, Sparkles } from "lucide-react";
import type { Category, Destination } from "@/lib/contracts";
import { QuickSearchForm } from "@/components/forms/QuickSearchForm";
import { AnimatedCanvasHero } from "./AnimatedCanvasHero";
import { TrustMetricsBar } from "./TrustMetricsBar";
import { animationClasses } from "@/lib/animations";

export function HeroSection({
  title,
  destinations,
  categories,
}: {
  title: string;
  destinations: Destination[];
  categories: Category[];
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
            <h1 className="m-0 max-w-[15ch] text-balance break-words font-display text-[clamp(3.5rem,6.3vw,6rem)] font-medium leading-[0.92] tracking-[-0.055em] text-white [overflow-wrap:anywhere] max-[620px]:text-[clamp(3.25rem,17vw,5rem)]">{title}</h1>
          </div>
          <div className="flex flex-wrap gap-3 min-[1100px]:justify-end min-[1100px]:pb-1 max-[620px]:grid max-[620px]:grid-cols-1">
              <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/50 bg-white/10 px-6 py-3 text-sm font-extrabold text-white no-underline transition hover:-translate-y-0.5 hover:bg-white/20" href="/contact-us">
                Design my trip
              </Link>
          </div>
        </div>
        <QuickSearchForm destinations={destinations} categories={categories} />
        <TrustMetricsBar />
      </div>
      <a className="absolute bottom-8 right-8 z-3 flex size-11 animate-soft-float items-center justify-center rounded-full border border-white/30 bg-white/10 text-white motion-reduce:animate-none max-[620px]:hidden" href="#flagship-tours" aria-label="Scroll to flagship tours">
        <ArrowDown aria-hidden="true" size={18} />
      </a>
    </section>
  );
}
