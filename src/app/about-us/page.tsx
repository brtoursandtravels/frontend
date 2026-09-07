import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, HeartHandshake, MessageCircle, Route } from "lucide-react";
import { ContentPage, ContentUnavailable } from "@/components/common/ContentPage";
import { ApiRequestError, getContentPage } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContentPage("about-us").catch(() => null);
  return {
    title: page?.data.seoTitle ?? page?.data.title ?? "About us",
    description:
      page?.data.seoDescription ??
      "Learn how BR Tours and Travels approaches clear, enquiry-led trip planning.",
    alternates: { canonical: "/about-us" },
  };
}

export default async function AboutPage() {
  const result = await getContentPage("about-us")
    .then((value) => ({ value, error: null }))
    .catch((error: unknown) => ({ value: null, error }));
  if (result.error) {
    if (
      result.error instanceof ApiRequestError &&
      result.error.status === 404
    ) {
      return (
        <div className="mx-auto w-full max-w-4xl px-5 py-16 sm:px-8">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-secondary-hover">About BR</p>
          <h1 className="font-display text-4xl font-semibold text-text-heading sm:text-5xl">Company information is being prepared.</h1>
          <p className="mt-5 text-lg leading-8 text-text-muted">
            BR Tours and Travels is the confirmed business name. History, team
            and service-region details stay hidden until the owner supplies
            them.
          </p>
          <Link className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-white no-underline transition hover:bg-primary-hover" href="/contact-us">
            Contact BR
          </Link>
        </div>
      );
    }
    return (
      <ContentUnavailable title="About information cannot be loaded right now" />
    );
  }
  return (
    <ContentPage eyebrow="About BR" page={result.value!.data}>
      <section className="my-16 grid grid-cols-2 overflow-hidden rounded-xl bg-bg-muted max-[820px]:grid-cols-1">
        <div className="relative min-h-96">
          <Image
            alt="Family enjoying a personalized safari journey"
            src="/images/travel/why-choose-us-banner.webp"
            fill
            sizes="(max-width: 800px) 100vw, 50vw"
          />
        </div>
        <div className="p-[clamp(1.5rem,5vw,4rem)]">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-secondary-hover">The BR way</p>
          <h2 className="m-0 font-display text-4xl font-semibold leading-tight text-text-heading">Travel planning should feel considered, not complicated.</h2>
          <p className="mt-4 leading-relaxed text-text-muted">
            We bring the route, services and practical details into one clear
            conversation—then confirm each part before you commit.
          </p>
          <ul className="mt-6 grid list-none gap-3 p-0 text-sm font-bold text-primary">
            <li className="flex items-center gap-2"><HeartHandshake aria-hidden="true" size={18} /> Personal priorities first</li>
            <li className="flex items-center gap-2"><Route aria-hidden="true" size={18} /> Realistic, well-paced routes</li>
            <li className="flex items-center gap-2"><BadgeCheck aria-hidden="true" size={18} /> Clear confirmation and terms</li>
          </ul>
        </div>
      </section>
      <section className="my-16" aria-labelledby="values-title">
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-secondary-hover">Service approach</p>
        <h2 className="m-0 font-display text-4xl font-semibold text-text-heading" id="values-title">Clear from first idea to final confirmation.</h2>
        <div className="mt-8 grid grid-cols-3 gap-5 max-[820px]:grid-cols-1">
          <article className="rounded-xl border border-border-subtle bg-white p-6 shadow-card">
            <h3 className="mt-0 font-display text-2xl text-text-heading">Listen first</h3>
            <p>Planning starts with pace, priorities and practical context.</p>
          </article>
          <article className="rounded-xl border border-border-subtle bg-white p-6 shadow-card">
            <h3 className="mt-0 font-display text-2xl text-text-heading">Explain clearly</h3>
            <p>
              Prices, inclusions and the status of a request should be
              unambiguous.
            </p>
          </article>
          <article className="rounded-xl border border-border-subtle bg-white p-6 shadow-card">
            <h3 className="mt-0 font-display text-2xl text-text-heading">Confirm honestly</h3>
            <p>
              An online request becomes a booking only after staff confirmation.
            </p>
          </article>
        </div>
      </section>
      <section className="my-16 rounded-xl bg-primary p-[clamp(1.5rem,5vw,4rem)] text-white">
        <h2 className="m-0 font-display text-4xl font-semibold text-white">A conversation-led planning process</h2>
        <ol className="my-8 grid list-none gap-5 p-0">
          <li className="grid grid-cols-[3rem_1fr] gap-4 border-t border-white/15 pt-5">
            <span className="text-sm font-extrabold text-secondary-light">01</span>
            <div>
              <h3 className="m-0 text-lg font-extrabold text-white">Share the idea</h3>
              <p>
                Tell BR the dates, people and experience you are considering.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-[3rem_1fr] gap-4 border-t border-white/15 pt-5">
            <span className="text-sm font-extrabold text-secondary-light">02</span>
            <div>
              <h3 className="m-0 text-lg font-extrabold text-white">Review the details</h3>
              <p>
                Discuss route, pace, services and any owner-approved
                alternatives.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-[3rem_1fr] gap-4 border-t border-white/15 pt-5">
            <span className="text-sm font-extrabold text-secondary-light">03</span>
            <div>
              <h3 className="m-0 text-lg font-extrabold text-white">Confirm deliberately</h3>
              <p>
                Proceed only after availability, price and applicable terms are
                clear.
              </p>
            </div>
          </li>
        </ol>
        <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-extrabold text-primary no-underline transition hover:-translate-y-0.5" href="/contact-us">
          <MessageCircle aria-hidden="true" size={18} /> Start a conversation
        </Link>
      </section>
    </ContentPage>
  );
}
