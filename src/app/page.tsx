import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { FeaturedDestinations } from "@/components/home/FeaturedDestinations";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { HeroSection } from "@/components/home/HeroSection";
import { CustomiseTripSection } from "@/components/home/CustomiseTripSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { TravelServices } from "@/components/home/TravelServices";
import { TravelJournalPreview } from "@/components/home/TravelJournalPreview";
import { TrendingPackages } from "@/components/home/TrendingPackages";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import {
  getBlog,
  getDestinations,
  getFaqs,
  getGalleryAlbums,
  getHome,
  getPackages,
  getTestimonials,
} from "@/lib/api";

export const revalidate = 3600;
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [home, packages, destinations, gallery, testimonials, blog, faqs] =
    await Promise.all([
      getHome().catch(() => null),
      getPackages({ pageSize: 12 }).catch(() => null),
      getDestinations().catch(() => null),
      getGalleryAlbums({ pageSize: 5 }).catch(() => null),
      getTestimonials().catch(() => null),
      getBlog({ pageSize: 6 }).catch(() => null),
      getFaqs().catch(() => null),
    ]);

  if (!home) {
    return (
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <div className="rounded-xl border border-danger/25 bg-danger-bg p-8 shadow-card">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-danger">Homepage unavailable</p>
          <h1 className="font-display text-[2rem] text-text-heading">Live homepage content cannot be loaded.</h1>
          <p className="my-4 text-text-muted">No simulated offers have been substituted for the API failure.</p>
          <Link className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-white no-underline" href="/">
            Try again
          </Link>
        </div>
      </div>
    );
  }

  if (!home.data.sections.length) {
    return (
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <div className="rounded-xl border border-border-subtle bg-white p-8 shadow-card">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-secondary-hover">BR Tours and Travels</p>
          <h1 className="font-display text-[2rem] text-text-heading">The homepage is being prepared.</h1>
          <p className="my-4 text-text-muted">Explore the published catalogue or start a secure enquiry.</p>
          <div className="flex flex-wrap gap-3">
            <Link className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-white no-underline" href="/packages">Explore journeys</Link>
            <Link className="inline-flex rounded-full border border-primary px-6 py-3 text-sm font-extrabold text-primary no-underline" href="/contact-us">Contact BR</Link>
          </div>
        </div>
      </div>
    );
  }

  const hero = home.data.sections.find((section) => section.type === "HERO");
  const heroTitle = hero?.title ?? "Travel deeper. Return with more.";
  return (
    <>
      <HeroSection
        title={heroTitle}
      />
      <FeaturedDestinations destinations={destinations?.data ?? []} />
      <TravelServices />
      <TrendingPackages packages={packages?.data ?? []} />
      <CustomiseTripSection />
      <WhyChooseUs />
      <TestimonialsSection testimonials={testimonials?.data ?? []} />
      <GalleryPreview albums={gallery?.data ?? []} />
      <TravelJournalPreview posts={blog?.data ?? []} />
      <FaqAccordion faqs={faqs?.data ?? []} />
      <section className="defer-render mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 lg:px-10 max-[820px]:py-[4.5rem]">
        <div className="flex items-center justify-between gap-10 rounded-xl bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--color-accent)_22%,transparent),transparent_24rem)] bg-primary p-[clamp(1.6rem,5vw,4rem)] text-white shadow-dropdown max-[820px]:flex-col max-[820px]:items-start">
          <div>
            <p className="mb-3 text-[0.75rem] font-extrabold uppercase tracking-[0.16em] text-secondary-light">Your journey, personally considered</p>
            <h2 className="m-0 max-w-2xl font-display text-[clamp(1.65rem,2.25vw,2.25rem)] font-semibold leading-[1.12] text-white">Have a place in mind or just a feeling?</h2>
            <p className="mt-4 max-w-2xl text-white/75">Share what matters. We will help turn the first idea into a clear, considered plan.</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3 max-[620px]:grid max-[620px]:w-full">
            <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-br from-accent to-secondary px-6 py-3 text-sm font-extrabold text-white no-underline" href="/contact-us">
              Plan my trip <ArrowUpRight aria-hidden="true" size={18} />
            </Link>
            <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/50 bg-white/10 px-6 py-3 text-sm font-extrabold text-white no-underline" href="/contact-us">
              <MessageCircle aria-hidden="true" size={18} /> Ask a question
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
