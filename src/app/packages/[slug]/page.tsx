import type { Metadata } from "next";
import { entryMetadata } from "@/lib/metadata";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { BedDouble, BusFront, Check } from "lucide-react";
import { BreadcrumbNav } from "@/components/common/BreadcrumbNav";
import { DetailPageSkeleton } from "@/components/common/PageSkeletons";
import { InclusionsExclusions } from "@/components/packages/InclusionsExclusions";
import { ItineraryTimeline } from "@/components/packages/ItineraryTimeline";
import { PackageCard } from "@/components/packages/PackageCard";
import { PackageGalleryModal } from "@/components/packages/PackageGalleryModal";
import { PackageInformationCard } from "@/components/packages/PackageInformationCard";
import { StickyBookingCard } from "@/components/packages/StickyBookingCard";
import { YatraEssentials } from "@/components/packages/YatraEssentials";
import { YatraPreparationGuide } from "@/components/packages/YatraPreparationGuide";
import { YatraRouteElevation } from "@/components/packages/YatraRouteElevation";
import {
  ApiRequestError,
  getFaqs,
  getPackage,
  getPackageWithRedirect,
  getSite,
} from "@/lib/api";
import {
  formatDate,
  formatMoney,
  priceBasisLabel,
  settingText,
  whatsappLink,
} from "@/lib/presentation";
import { serverEnv } from "@/lib/env";

export const revalidate = 30;
export const maxDuration = 60;
export const dynamicParams = true;

export function generateStaticParams(): Array<{ slug: string }> {
  // Generate each package on its first visit, then revalidate it every 30 seconds.
  // A catalogue API outage must not turn a frontend deployment into a failed build.
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPackage(slug).catch(() => null);
  if (!result) return { title: "Tour package" };
  const item = result.data;
  return entryMetadata({
    title: item.title, description: item.summary,
    metaTitle: item.seo.title, metaDescription: item.seo.description,
    path: `/packages/${item.slug}`,
    image: item.cover ? { url: item.cover.url, alt: item.cover.altText } : undefined,
  });
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <Suspense fallback={<DetailPageSkeleton label="Loading package details" />}>
      <PackageDetailContent slug={slug} />
    </Suspense>
  );
}

async function PackageDetailContent({ slug }: { slug: string }) {
  let result;
  const supportingContent = Promise.all([
    getFaqs(slug)
      .then((response) => response.data)
      .catch(() => []),
    getSite()
      .then((response) => response.data)
      .catch(() => null),
  ]);
  try {
    result = await getPackageWithRedirect(slug);
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) notFound();
    throw error instanceof ApiRequestError
      ? error
      : new Error("The package response was not usable.");
  }
  if (result.redirectSlug) redirect(`/packages/${result.redirectSlug}`);
  const item = result.data;
  const [faqs, site] = await supportingContent;
  const whatsappHref = whatsappLink(
    settingText(site, ["contact.whatsapp", "business.whatsapp", "whatsapp"]),
  );
  const isCharDham = /char-dham/i.test(item.slug);
  const media = item.media.length
      ? item.media
      : item.cover
        ? [item.cover]
        : [];
  const departureOptions = item.departures.map((departure) => ({
    id: departure.id,
    label: `${formatDate(departure.startDate)} – ${formatDate(departure.endDate)}${departure.price ? ` · ${formatMoney(departure.price.amount, departure.price.currency)}` : ""}`,
  }));
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: item.title,
    description: item.summary,
    url: new URL(
      `/packages/${item.slug}`,
      serverEnv.NEXT_PUBLIC_SITE_URL,
    ).toString(),
    touristType: item.categories.map((category) => category.name),
  };

  return (
    <div className="bg-bg-base pb-24">
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <BreadcrumbNav items={[{ label: "Home", href: "/" }, { label: "Journeys", href: "/packages" }, { label: item.title }]} />
        <PackageGalleryModal images={media} label={item.title} />
        {isCharDham ? <YatraEssentials days={item.days} nights={item.nights} /> : null}
        <section className="mt-8">
          <div>
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-secondary-hover">
              {item.destinations.map((entry) => entry.name).join(" · ") ||
                "Tour idea"}
            </p>
            <h1 className="m-0 max-w-4xl font-display text-[clamp(2.4rem,3.5vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.025em] text-primary">{item.title}</h1>
            <div className="my-4 flex flex-wrap gap-2">
              {item.categories.map((category) => (
                <span className="rounded-full bg-bg-muted px-3 py-1.5 text-xs font-bold text-primary" key={category.slug}>{category.name}</span>
              ))}
            </div>
            {item.isDemo ? (
              <span className="inline-flex rounded-full bg-accent-soft px-3 py-1.5 text-[0.65rem] font-extrabold uppercase text-secondary-hover">
                Demo content—not a confirmed offer
              </span>
            ) : null}
            <p className="mt-5 max-w-3xl whitespace-pre-line text-lg leading-relaxed text-text-muted [overflow-wrap:anywhere]">{item.overview}</p>
            <div className="mt-7 flex flex-wrap gap-8 border-t border-border-subtle pt-5 text-sm text-text-body">
              <span className="grid">
                <strong>{item.days}</strong> days
              </span>
              <span className="grid">
                <strong>{item.nights}</strong> nights
              </span>
              {item.startingCity ? (
                <span className="grid">
                  Starts from <strong>{item.startingCity}</strong>
                </span>
              ) : null}
            </div>
          </div>
        </section>

        <div className="mt-10 grid grid-cols-[minmax(0,1fr)_24rem] items-start gap-8 max-[960px]:grid-cols-1">
          <div>
            {isCharDham ? <YatraRouteElevation /> : null}
            {item.highlights.length ? (
              <section className="mb-6 rounded-xl border border-border-subtle bg-white p-6 shadow-card">
                <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-secondary-hover">What stands out</p>
                <h2 className="mb-5 mt-0 font-display text-3xl leading-tight text-text-heading">Highlights</h2>
                <ul className="m-0 grid list-none gap-3 p-0">
                  {item.highlights.map((highlight) => (
                    <li className="grid grid-cols-[1.25rem_minmax(0,1fr)] items-start gap-2.5 leading-6" key={highlight}>
                      <Check aria-hidden="true" className="mt-1 text-success" size={17} />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
            <section className="mb-6 rounded-xl border border-border-subtle bg-white p-6 shadow-card">
              <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-secondary-hover">Day by day</p>
              <h2 className="mt-0 font-display text-3xl text-text-heading">Itinerary</h2>
              <ItineraryTimeline itinerary={item.itinerary} media={media} yatraMode={isCharDham} />
            </section>
            <section className="mb-6 rounded-xl border border-border-subtle bg-white p-6 shadow-card">
              <InclusionsExclusions inclusions={item.inclusions} exclusions={item.exclusions} />
            </section>
            {isCharDham ? <YatraPreparationGuide /> : null}
            <PackageInformationCard id="package-transport" title="Pickup and transport" description={item.transportInformation} icon={BusFront} />
            <PackageInformationCard id="package-accommodation" title="Accommodation notes" description={item.accommodationNotes} icon={BedDouble} />
            {faqs.length ? (
              <section className="mb-6 rounded-xl border border-border-subtle bg-white p-6 shadow-card">
                <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-secondary-hover">Before you enquire</p>
                <h2 className="mt-0 font-display text-3xl text-text-heading">Package questions</h2>
                <div className="grid gap-2 [&_details]:rounded-md [&_details]:bg-bg-muted [&_details]:px-4 [&_details]:py-3 [&_summary]:font-bold [&_p]:mt-3 [&_p]:text-sm [&_p]:text-text-muted">
                  {faqs.map((faq) => (
                    <details key={faq.id}>
                      <summary>{faq.question}</summary>
                      <p>{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
          <aside className="self-stretch max-[960px]:self-auto">
            <div className="sticky top-24 z-3 grid gap-3 max-[960px]:relative max-[960px]:top-0" id="package-enquiry">
              <StickyBookingCard item={item} departures={departureOptions} whatsappHref={whatsappHref} pilgrimageMode={isCharDham} />
              {item.importantInformation ? (
                <details className="group rounded-lg border border-border-subtle bg-white px-5 shadow-card">
                  <summary className="cursor-pointer list-none py-4 font-display text-[1rem] font-semibold text-text-heading marker:hidden">Important information <span className="float-right text-secondary transition group-open:rotate-45" aria-hidden="true">+</span></summary>
                  <p className="mt-0 border-t border-border-subtle py-4 text-[0.82rem] leading-relaxed text-text-muted">{item.importantInformation}</p>
                </details>
              ) : null}
              {item.cancellationRules ? (
                <details className="group rounded-lg border border-border-subtle bg-white px-5 shadow-card">
                  <summary className="cursor-pointer list-none py-4 font-display text-[1rem] font-semibold text-text-heading marker:hidden">Cancellation rules <span className="float-right text-secondary transition group-open:rotate-45" aria-hidden="true">+</span></summary>
                  <div className="border-t border-border-subtle py-4 text-[0.82rem] leading-relaxed text-text-muted">
                    <p className="mt-0">{item.cancellationRules}</p>
                    <Link href="/cancellation-policy">General cancellation information →</Link>
                  </div>
                </details>
              ) : null}
            </div>
            {item.departures.length ? (
              <section className="mb-6 mt-6 rounded-xl border border-border-subtle bg-white p-5 shadow-card">
                <h2 className="mt-0 font-display text-2xl text-text-heading">Upcoming departures</h2>
                <div className="grid gap-3">
                  {item.departures.map((departure) => (
                    <article className="grid gap-1 rounded-md bg-bg-muted p-3 text-sm [&_span]:text-text-muted" key={departure.id}>
                      {departure.status === "FILLING_FAST" ? <strong className="text-secondary-hover">Filling fast</strong> : null}
                      {departure.seatsAvailable !== null ? <span>{departure.seatsAvailable === 0 ? "Fully booked" : `${departure.seatsAvailable} seats available`}</span> : null}
                      <strong>
                        {formatDate(departure.startDate)} –{" "}
                        {formatDate(departure.endDate)}
                      </strong>
                      <span>
                        {departure.price
                          ? `${formatMoney(departure.price.amount, departure.price.currency)} ${priceBasisLabel(departure.price.basis)}`
                          : "Price on request"}
                      </span>
                    </article>
                  ))}
                </div>
                <p className="mt-3 text-xs leading-relaxed text-text-muted">
                  Dates are enquiry options, not guaranteed inventory.
                </p>
              </section>
            ) : null}
            {item.brochure ? (
              <section className="mb-6 rounded-xl border border-border-subtle bg-white p-5 shadow-card">
                <h2 className="mt-0 font-display text-2xl text-text-heading">Package brochure</h2>
                <p>The authorized PDF opens as a protected download.</p>
                <a
                  className="mt-3 inline-flex rounded-full border border-primary px-4 py-2 text-sm font-bold text-primary no-underline"
                  href={item.brochure.url}
                  download
                >
                  Download brochure
                </a>
              </section>
            ) : null}
          </aside>
        </div>
        {isCharDham ? (
          <section className="mt-10 flex items-center justify-between gap-8 overflow-hidden rounded-xl bg-primary p-[clamp(1.5rem,4vw,3rem)] text-white shadow-dropdown max-[720px]:flex-col max-[720px]:items-start">
            <div>
              <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-secondary-light">Customise this yatra</p>
              <h2 className="m-0 max-w-2xl font-display text-[clamp(1.75rem,2.7vw,2.75rem)] font-semibold leading-[1.08] text-white">Shape the route around your family.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/72">Discuss private pickups, a Do Dham variation, slower pacing or helicopter options. Every operational detail is confirmed before commitment.</p>
            </div>
            <Link className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-extrabold text-white no-underline transition hover:bg-accent-hover" href={`/contact-us?package=${encodeURIComponent(item.slug)}&subject=custom-trip#contact-form`}>Customise this yatra</Link>
          </section>
        ) : null}
        {item.relatedPackages.length ? (
          <section className="@container mt-12 rounded-xl border border-border-subtle bg-white p-6 shadow-card max-[420px]:p-4">
            <div className="mb-6 flex items-end justify-between gap-5 @max-[24rem]:flex-col @max-[24rem]:items-start @max-[24rem]:gap-3">
              <div>
                <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-secondary-hover">Keep exploring</p>
                <h2 className="m-0 font-display text-3xl text-text-heading">Related packages</h2>
              </div>
              <Link className="inline-flex whitespace-nowrap text-sm font-bold" href="/packages">All packages →</Link>
            </div>
            <div className="grid grid-cols-3 gap-6 max-[1100px]:grid-cols-2 max-[620px]:grid-cols-1">
              {item.relatedPackages.map((related) => (
                <PackageCard item={related} key={related.id} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
      <a className="fixed bottom-3 left-3 right-3 z-60 hidden rounded-full bg-accent px-5 py-3 text-center text-sm font-extrabold text-white no-underline shadow-dropdown max-[720px]:block" href="#package-enquiry">
        Enquire about this package
      </a>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c"),
        }}
      />
    </div>
  );
}
