import type { Metadata } from "next";
import { contentPageMetadata } from "@/lib/content-page-metadata";
import { ContactFaq } from "@/components/contact/ContactFaq";
import { ContactHero } from "@/components/contact/ContactHero";
import { ConsultationTimeline } from "@/components/contact/ConsultationTimeline";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { getPackage, getSite } from "@/lib/api";
import { contactPhone, whatsappLink } from "@/lib/presentation";

export const revalidate = 30;
export function generateMetadata(): Promise<Metadata> {
  return contentPageMetadata("contact-us", "Plan your journey",
    "Speak with BR Tours and Travels about a considered, tailor-made journey across India and beyond.");
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string; subject?: string }>;
}) {
  const query = await searchParams;
  const isCustomTrip = query.subject === "custom-trip";
  const [siteResult, packageResult] = await Promise.all([
    getSite().catch(() => null),
    query.package ? getPackage(query.package).catch(() => null) : Promise.resolve(null),
  ]);
  const site = siteResult?.data;
  const packageItem = packageResult?.data;
  const phone = contactPhone(site);
  const whatsappHref = whatsappLink(phone);

  return (
    <main>
      <ContactHero />

      <section
        className="mx-auto grid w-full max-w-7xl grid-cols-[0.78fr_1.22fr] gap-7 px-5 py-20 sm:px-8 lg:px-10 max-[900px]:grid-cols-1"
        id="contact-form"
        aria-labelledby="contact-form-title"
      >
        <ConsultationTimeline />
        <div className="rounded-xl border border-border-subtle bg-white p-[clamp(1.5rem,3vw,2.5rem)] shadow-card">
          <p className="mb-3 text-[0.72rem] font-extrabold uppercase tracking-[0.16em] text-secondary-hover">Your private trip brief</p>
          <h2 className="m-0 text-balance font-display text-[clamp(1.85rem,2.7vw,2.75rem)] font-semibold leading-[1.08] text-text-heading" id="contact-form-title">Tell us what would make this journey yours.</h2>
          <p className="mb-7 mt-3 max-w-2xl text-[0.9rem] leading-relaxed text-text-muted">Share as much or as little as you know today. We will use it only to prepare a useful, personal response.</p>
          <EnquiryForm
            packageSlug={packageItem?.slug}
            packageTitle={packageItem?.title}
            departures={packageItem?.departures.map((item) => ({ id: item.id, label: `${item.startDate} to ${item.endDate}` }))}
            whatsappHref={whatsappHref}
            defaultSubject={isCustomTrip ? "Custom trip request" : undefined}
            defaultMessage={isCustomTrip ? "Destinations or experiences:\nPreferred dates:\nNumber of travellers:\nTravel style:\nApproximate budget:\nAnything else that matters:" : undefined}
          />
        </div>
      </section>

      <div className="bg-bg-warm"><ContactFaq /></div>
    </main>
  );
}
