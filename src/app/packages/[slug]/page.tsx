import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { BreadcrumbNav } from "@/components/common/BreadcrumbNav";
import { InclusionsExclusions } from "@/components/packages/InclusionsExclusions";
import { ItineraryTimeline } from "@/components/packages/ItineraryTimeline";
import { PackageCard } from "@/components/packages/PackageCard";
import { PackageGalleryModal } from "@/components/packages/PackageGalleryModal";
import { StickyBookingCard } from "@/components/packages/StickyBookingCard";
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

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPackage(slug).catch(() => null);
  if (!result) return { title: "Tour package" };
  const item = result.data;
  const image = item.cover?.url;
  return {
    title: item.seo.title ?? item.title,
    description: item.seo.description ?? item.summary,
    alternates: { canonical: `/packages/${item.slug}` },
    openGraph: {
      type: "website",
      title: item.seo.title ?? item.title,
      description: item.seo.description ?? item.summary,
      url: `/packages/${item.slug}`,
      images: image
        ? [{ url: image, alt: item.cover?.altText ?? item.title }]
        : undefined,
    },
  };
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let result;
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
  const [faqs, site] = await Promise.all([
    getFaqs(item.slug)
      .then((result) => result.data)
      .catch(() => []),
    getSite()
      .then((result) => result.data)
      .catch(() => null),
  ]);
  const whatsappHref = whatsappLink(
    settingText(site, ["contact.whatsapp", "business.whatsapp", "whatsapp"]),
  );
  const media = item.media.length ? item.media : item.cover ? [item.cover] : [];
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
        <section className="mt-8 grid grid-cols-[1fr_24rem] items-start gap-12 max-[820px]:grid-cols-1">
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
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-text-muted">{item.overview}</p>
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
          <div id="package-enquiry"><StickyBookingCard item={item} departures={departureOptions} whatsappHref={whatsappHref} /></div>
        </section>

        <div className="mt-10 grid grid-cols-[minmax(0,1fr)_20rem] items-start gap-8 max-[960px]:grid-cols-1">
          <div>
            {item.highlights.length ? (
              <section className="mb-6 rounded-xl border border-border-subtle bg-white p-6 shadow-card">
                <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-secondary-hover">What stands out</p>
                <h2 className="mt-0 font-display text-3xl text-text-heading">Highlights</h2>
                <ul className="grid list-none gap-3 p-0">
                  {item.highlights.map((highlight) => (
                    <li className="before:mr-2 before:text-success before:content-['✓']" key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </section>
            ) : null}
            <section className="mb-6 rounded-xl border border-border-subtle bg-white p-6 shadow-card">
              <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-secondary-hover">Day by day</p>
              <h2 className="mt-0 font-display text-3xl text-text-heading">Itinerary</h2>
              <ItineraryTimeline itinerary={item.itinerary} media={media} />
            </section>
            <section className="mb-6 rounded-xl border border-border-subtle bg-white p-6 shadow-card">
              <InclusionsExclusions inclusions={item.inclusions} exclusions={item.exclusions} />
            </section>
            {item.transportInformation ? (
              <section className="mb-6 rounded-xl border border-border-subtle bg-white p-6 shadow-card">
                <h2 className="mt-0 font-display text-3xl text-text-heading">Pickup and transport</h2>
                <p>{item.transportInformation}</p>
              </section>
            ) : null}
            {item.accommodationNotes ? (
              <section className="mb-6 rounded-xl border border-border-subtle bg-white p-6 shadow-card">
                <h2 className="mt-0 font-display text-3xl text-text-heading">Accommodation notes</h2>
                <p>{item.accommodationNotes}</p>
              </section>
            ) : null}
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
          <aside>
            {item.departures.length ? (
              <section className="mb-6 rounded-xl border border-border-subtle bg-white p-5 shadow-card">
                <h2 className="mt-0 font-display text-2xl text-text-heading">Upcoming departures</h2>
                <div className="grid gap-3">
                  {item.departures.map((departure) => (
                    <article className="grid gap-1 rounded-md bg-bg-muted p-3 text-sm [&_span]:text-text-muted" key={departure.id}>
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
            {item.importantInformation ? (
              <section className="mb-6 rounded-xl border border-border-subtle bg-white p-5 shadow-card">
                <h2 className="mt-0 font-display text-2xl text-text-heading">Important information</h2>
                <p>{item.importantInformation}</p>
              </section>
            ) : null}
            {item.cancellationRules ? (
              <section className="mb-6 rounded-xl border border-border-subtle bg-white p-5 shadow-card">
                <h2 className="mt-0 font-display text-2xl text-text-heading">Cancellation rules</h2>
                <p>{item.cancellationRules}</p>
                <Link href="/cancellation-policy">
                  General cancellation information →
                </Link>
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
        {item.relatedPackages.length ? (
          <section className="mt-12 rounded-xl border border-border-subtle bg-white p-6 shadow-card">
            <div className="mb-6 flex items-end justify-between gap-5">
              <div>
                <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-secondary-hover">Keep exploring</p>
                <h2 className="m-0 font-display text-3xl text-text-heading">Related packages</h2>
              </div>
              <Link href="/packages">All packages →</Link>
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
