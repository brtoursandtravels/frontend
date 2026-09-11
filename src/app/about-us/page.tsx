import type { Metadata } from "next";
import { AboutCtaBanner } from "@/components/about/AboutCtaBanner";
import { AboutHero } from "@/components/about/AboutHero";
import { ImpactMetrics } from "@/components/about/ImpactMetrics";
import { JourneyTimeline } from "@/components/about/JourneyTimeline";
import { PhilosophyPillars } from "@/components/about/PhilosophyPillars";
import { ResponsibleTravel } from "@/components/about/ResponsibleTravel";
import { StorySection } from "@/components/about/StorySection";
import { TeamShowcase } from "@/components/about/TeamShowcase";
import { TrustStandards } from "@/components/about/TrustStandards";
import { getContentPage } from "@/lib/api";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContentPage("about-us").catch(() => null);
  return {
    title: page?.data.seoTitle ?? "About BR Tours & Travels",
    description:
      page?.data.seoDescription ??
      "Meet the planning philosophy behind BR Tours & Travels and discover how personal, clearly confirmed journeys are shaped.",
    alternates: { canonical: "/about-us" },
  };
}

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <div className="mx-auto grid w-full max-w-7xl gap-20 px-5 py-20 sm:px-8 lg:px-10 max-[700px]:gap-14 max-[700px]:py-14">
        <StorySection />
        <ImpactMetrics />
        <PhilosophyPillars />
        <JourneyTimeline />
        <TeamShowcase />
        <ResponsibleTravel />
        <TrustStandards />
        <AboutCtaBanner />
      </div>
    </main>
  );
}
