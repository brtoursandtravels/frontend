import type { Metadata } from "next";
import { staticPageMetadata } from "@/lib/static-page-metadata";
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
  getPackages,
  getTestimonials,
} from "@/lib/api";

export const revalidate = 30;
export function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata("home", {
    title: "BR Tours and Travels",
    description: "Plan your next trip with BR Tours and Travels. Explore tour packages, car and bus rentals, and holidays planned around your dates and budget.",
    path: "/",
  });
}

export default async function HomePage() {
  const [packages, destinations, gallery, testimonials, blog, faqs] =
    await Promise.all([
      getPackages({ pageSize: 12 }).catch(() => null),
      getDestinations().catch(() => null),
      getGalleryAlbums({ pageSize: 5 }).catch(() => null),
      getTestimonials().catch(() => null),
      getBlog({ pageSize: 6 }).catch(() => null),
      getFaqs().catch(() => null),
    ]);

  return (
    <>
      <HeroSection
        title="Plan your next trip with us."
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
            <p className="mb-3 text-[0.75rem] font-extrabold uppercase tracking-[0.16em] text-secondary-light">Let’s plan your trip</p>
            <h2 className="m-0 max-w-2xl font-display text-[clamp(1.65rem,2.25vw,2.25rem)] font-semibold leading-[1.12] text-white">Where would you like to go?</h2>
            <p className="mt-4 max-w-2xl text-white/75">Tell us where you want to go, when you want to travel and your budget. We will help you plan the rest.</p>
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
