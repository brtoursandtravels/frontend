import type { Metadata } from "next";
import { Clock3, MapPinned, MessageCircle, ShieldCheck } from "lucide-react";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { getPackage, getSite } from "@/lib/api";
import { mapEmbedLink, settingText, whatsappLink } from "@/lib/presentation";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Send a persisted travel enquiry to BR Tours and Travels and receive a reference for staff review.",
  alternates: { canonical: "/contact-us" },
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string }>;
}) {
  const query = await searchParams;
  const [siteResult, packageResult] = await Promise.all([
    getSite().catch(() => null),
    query.package
      ? getPackage(query.package).catch(() => null)
      : Promise.resolve(null),
  ]);
  const site = siteResult?.data;
  const packageItem = packageResult?.data;
  const phone = settingText(site, ["contact.phone", "business.phone", "phone"]);
  const email = settingText(site, ["contact.email", "business.email", "email"]);
  const whatsapp = settingText(site, [
    "contact.whatsapp",
    "business.whatsapp",
    "whatsapp",
  ]);
  const address = settingText(site, [
    "contact.address",
    "business.address",
    "address",
  ]);
  const hours = settingText(site, [
    "contact.openingHours",
    "business.openingHours",
    "openingHours",
  ]);
  const mapUrl = settingText(site, [
    "contact.mapUrl",
    "business.mapUrl",
    "mapUrl",
  ]);
  const whatsappHref = whatsappLink(whatsapp);
  const mapEmbedUrl = mapEmbedLink(mapUrl);
  const hasDetails = phone || email || whatsapp || address || hours || mapUrl;

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
      <header className="grid grid-cols-[1.1fr_0.9fr] gap-10 rounded-xl bg-primary p-[clamp(1.8rem,5vw,4rem)] text-white shadow-dropdown max-[820px]:grid-cols-1">
        <div>
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-secondary-light">Start a conversation</p>
          <h1 className="m-0 font-display text-[clamp(3rem,6vw,5.5rem)] font-semibold leading-[0.98] text-white">Tell us what you have in mind.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">
            Your request is saved before notification is attempted. You will
            receive a reference, not a fake booking confirmation.
          </p>
        </div>
        {hasDetails ? (
          <dl className="grid content-start gap-1 overflow-hidden rounded-lg border border-white/15 bg-white/10 p-5 backdrop-blur-md [&>div]:grid [&>div]:grid-cols-[7rem_1fr] [&>div]:gap-3 [&>div]:border-b [&>div]:border-white/10 [&>div]:py-3 [&>div:last-child]:border-0 [&_dt]:text-xs [&_dt]:font-extrabold [&_dt]:uppercase [&_dt]:text-white/55 [&_dd]:m-0 [&_a]:font-bold [&_a]:text-white [&_a]:no-underline max-[620px]:[&>div]:grid-cols-1">
            {phone ? (
              <div>
                <dt>Phone</dt>
                <dd>
                  <a href={`tel:${phone}`}>{phone}</a>
                </dd>
              </div>
            ) : null}
            {email ? (
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${email}`}>{email}</a>
                </dd>
              </div>
            ) : null}
            {whatsappHref ? (
              <div>
                <dt>WhatsApp</dt>
                <dd>
                  <a
                    href={whatsappHref ?? undefined}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Open WhatsApp
                  </a>
                </dd>
              </div>
            ) : null}
            {address ? (
              <div>
                <dt>Address</dt>
                <dd>{address}</dd>
              </div>
            ) : null}
            {hours ? (
              <div>
                <dt>Opening hours</dt>
                <dd>{hours}</dd>
              </div>
            ) : null}
            {mapUrl ? (
              <div>
                <dt>Map</dt>
                <dd>
                  <a href={mapUrl} rel="noreferrer" target="_blank">
                    View configured map
                  </a>
                </dd>
              </div>
            ) : null}
          </dl>
        ) : (
          <div className="rounded-lg border border-white/15 bg-white/10 p-5 backdrop-blur-md">
            <h2 className="m-0 font-display text-2xl text-white">Direct contact details are awaiting owner configuration.</h2>
            <p className="mt-3 text-sm text-white/70">
              The form below is available now; no phone, address or email has
              been invented.
            </p>
          </div>
        )}
      </header>
      <section className="my-10 grid grid-cols-3 gap-5 max-[820px]:grid-cols-1 [&_article]:grid [&_article]:grid-cols-[2.8rem_1fr] [&_article]:gap-3 [&_article]:rounded-lg [&_article]:border [&_article]:border-border-subtle [&_article]:bg-white [&_article]:p-5 [&_article]:shadow-card [&_svg]:text-secondary [&_h2]:m-0 [&_h2]:text-base [&_h2]:text-text-heading [&_p]:mt-2 [&_p]:text-sm [&_p]:text-text-muted" aria-label="Enquiry service standards">
        <article>
          <Clock3 aria-hidden="true" />
          <div><h2>Reviewed by a person</h2><p>Your request reaches the BR workflow for staff review and follow-up.</p></div>
        </article>
        <article>
          <ShieldCheck aria-hidden="true" />
          <div><h2>Clear confirmation</h2><p>An enquiry is never presented as a booking, payment or guaranteed inventory.</p></div>
        </article>
        <article>
          <MessageCircle aria-hidden="true" />
          <div><h2>One useful conversation</h2><p>Share dates, pace and priorities so the first response can be specific.</p></div>
        </article>
      </section>
      {mapUrl || address ? (
        <section className="relative my-10 flex min-h-64 items-center justify-between gap-8 overflow-hidden rounded-xl bg-[url('/images/travel/hero-wanderlust-bg.webp')] bg-cover bg-center p-[clamp(1.5rem,4vw,3rem)] text-white max-[820px]:flex-col max-[820px]:items-start">
          <span className="absolute inset-0 bg-gradient-to-r from-primary-ink/95 to-primary-ink/35" aria-hidden="true" />
          <div className="relative z-1">
            <MapPinned className="mb-3 text-secondary-light" aria-hidden="true" size={30} />
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-secondary-light">Find BR Tours</p>
            <h2 className="m-0 font-display text-[clamp(1.8rem,4vw,3.25rem)] text-white">{address ?? "Configured business location"}</h2>
          </div>
          {mapEmbedUrl ? (
            <div className="relative z-1 grid w-full max-w-xl gap-3">
              <iframe
                className="aspect-video w-full rounded-lg border border-white/25 bg-primary-ink"
                src={mapEmbedUrl}
                title="BR Tours location map"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                className="justify-self-start text-sm font-extrabold text-white"
                href={mapUrl ?? mapEmbedUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open larger map
              </a>
            </div>
          ) : mapUrl ? (
            <a className="relative z-1 inline-flex min-h-12 items-center justify-center rounded-full border border-white/50 bg-white/10 px-6 py-3 text-sm font-extrabold text-white no-underline" href={mapUrl} target="_blank" rel="noreferrer">
              Open interactive map
            </a>
          ) : null}
        </section>
      ) : null}
      <section
        className="mt-10 grid grid-cols-[0.65fr_1.35fr] gap-10 rounded-xl border border-border-subtle bg-white p-[clamp(1.5rem,4vw,3rem)] shadow-card max-[820px]:grid-cols-1"
        aria-labelledby="contact-form-title"
      >
        <div>
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-secondary-hover">Persisted request</p>
          <h2 className="m-0 font-display text-4xl text-text-heading" id="contact-form-title">Send your enquiry</h2>
          <p className="mt-4 text-sm leading-relaxed text-text-muted">
            Required fields are kept to the minimum needed for a useful
            response. The request is not a reservation or payment.
          </p>
        </div>
        <EnquiryForm
          packageSlug={packageItem?.slug}
          packageTitle={packageItem?.title}
          departures={packageItem?.departures.map((item) => ({
            id: item.id,
            label: `${item.startDate} to ${item.endDate}`,
          }))}
          whatsappHref={whatsappHref}
        />
      </section>
    </div>
  );
}
