import type { Metadata } from "next";
import { ArrowUpRight, MapPinned } from "lucide-react";
import { ContactFaq } from "@/components/contact/ContactFaq";
import { ContactHero } from "@/components/contact/ContactHero";
import { ConsultationTimeline } from "@/components/contact/ConsultationTimeline";
import { QuickChannelsBar } from "@/components/contact/QuickChannelsBar";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { getPackage, getSite } from "@/lib/api";
import { mapEmbedLink, settingText, whatsappLink } from "@/lib/presentation";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Plan your journey",
  description: "Speak with BR Tours and Travels about a considered, tailor-made journey across India and beyond.",
  alternates: { canonical: "/contact-us" },
};

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
  const phone = settingText(site, ["contact.phone", "business.phone", "phone"]);
  const email = settingText(site, ["contact.email", "business.email", "email"]);
  const whatsapp = settingText(site, ["contact.whatsapp", "business.whatsapp", "whatsapp"]);
  const address = settingText(site, ["contact.address", "business.address", "address"]);
  const hours = settingText(site, ["contact.openingHours", "business.openingHours", "openingHours"]);
  const mapUrl = settingText(site, ["contact.mapUrl", "business.mapUrl", "mapUrl"]);
  const whatsappHref = whatsappLink(whatsapp);
  const mapEmbedUrl = mapEmbedLink(mapUrl);

  return (
    <main>
      <ContactHero />
      <QuickChannelsBar email={email} phone={phone} whatsappHref={whatsappHref} hours={hours} />

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

      {mapUrl || address ? (
        <section className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8 lg:px-10" aria-labelledby="atelier-title">
          <div className="grid min-h-80 grid-cols-[0.8fr_1.2fr] overflow-hidden rounded-xl bg-bg-warm shadow-card max-[820px]:grid-cols-1">
            <div className="flex flex-col justify-center p-[clamp(1.5rem,4vw,3rem)]">
              <MapPinned className="mb-4 text-secondary-hover" aria-hidden="true" size={28} />
              <p className="mb-3 text-[0.72rem] font-extrabold uppercase tracking-[0.16em] text-secondary-hover">Visit our travel atelier</p>
              <h2 className="m-0 font-display text-[clamp(1.8rem,2.8vw,2.8rem)] font-semibold leading-[1.08] text-text-heading" id="atelier-title">Plan together, in person.</h2>
              <p className="mt-4 text-[0.9rem] leading-relaxed text-text-muted">{address ?? "Our configured business location"}</p>
              {hours ? <p className="mt-2 text-sm font-bold text-primary">{hours}</p> : null}
              {mapUrl ? (
                <a className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 self-start rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-white no-underline transition hover:bg-primary-hover" href={mapUrl} target="_blank" rel="noreferrer">
                  Get driving directions <ArrowUpRight aria-hidden="true" size={17} />
                </a>
              ) : null}
            </div>
            {mapEmbedUrl ? (
              <iframe className="min-h-80 w-full border-0 bg-bg-muted" src={mapEmbedUrl} title="BR Tours location map" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            ) : (
              <div className="min-h-80 bg-[url('/images/travel/contact-concierge-hero-v1.webp')] bg-cover bg-center" role="img" aria-label="BR Tours travel planning studio" />
            )}
          </div>
        </section>
      ) : null}

      <div className="bg-bg-warm"><ContactFaq /></div>
    </main>
  );
}
