import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";
import type { Category, Destination } from "@/lib/contracts";
import { QuickSearchForm } from "@/components/forms/QuickSearchForm";
import { AnimatedCanvasHero } from "./AnimatedCanvasHero";
import { TrustMetricsBar } from "./TrustMetricsBar";
import { animationClasses } from "@/lib/animations";

export function HeroSection({
  title,
  description,
  destinations,
  categories,
}: {
  title: string;
  description: string;
  destinations: Destination[];
  categories: Category[];
}) {
  return (
    <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden text-white max-[820px]:min-h-0">
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
      <div className="relative z-2 mx-auto flex min-h-[calc(100svh-5rem)] w-full max-w-7xl flex-col justify-center px-5 pb-8 pt-[clamp(5rem,11vh,8rem)] sm:px-8 lg:px-10 max-[820px]:min-h-[48rem] max-[820px]:pb-8 max-[820px]:pt-[4.5rem]">
        <div className={`max-w-3xl ${animationClasses.revealUp}`}>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[0.72rem] font-extrabold uppercase tracking-[0.08em] text-accent-pale max-[620px]:rounded-md max-[620px]:text-[0.61rem] max-[620px]:leading-[1.4]">
            <Sparkles aria-hidden="true" size={16} /> Crafted luxury journeys across India & beyond
          </p>
          <h1 className="m-0 max-w-[13ch] text-balance break-words font-display text-[clamp(3.5rem,8.6vw,7.7rem)] font-medium leading-[0.92] tracking-[-0.055em] text-white [overflow-wrap:anywhere] max-[620px]:text-[clamp(3.25rem,17vw,5rem)]">{title}</h1>
          <p className="mt-6 max-w-2xl text-[clamp(1.02rem,2vw,1.22rem)] leading-7 text-white/80">{description}</p>
          <div className="mt-7 flex flex-wrap gap-3 max-[620px]:grid max-[620px]:grid-cols-1">
            <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-br from-accent to-secondary px-6 py-3 text-sm font-extrabold text-white no-underline shadow-accent-md transition hover:-translate-y-0.5 hover:shadow-glow" href="/packages">
              Explore journeys <ArrowUpRight aria-hidden="true" size={18} />
            </Link>
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
