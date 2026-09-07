import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import type { SiteData } from "@/lib/contracts";
import { settingText } from "@/lib/presentation";
import { BrandLogo } from "@/components/common/BrandLogo";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export function SiteFooter({ site }: { site?: SiteData | null }) {
  const phone = settingText(site, ["contact.phone", "business.phone", "phone"]);
  const email = settingText(site, ["contact.email", "business.email", "email"]);
  const address = settingText(site, [
    "contact.address",
    "business.address",
    "address",
  ]);
  return (
    <footer className="bg-primary-footer text-white/75">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-[1fr_minmax(20rem,0.7fr)] items-center gap-10 border-b border-white/10 px-5 py-12 sm:px-8 lg:px-10 max-[820px]:grid-cols-1">
        <div>
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-secondary-light">The BR journal</p>
          <h2 className="m-0 font-display text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-tight text-white">Travel notes worth opening.</h2>
          <p className="mt-3 max-w-2xl">Seasonal ideas, practical guides and new journeys from the team.</p>
        </div>
        <NewsletterForm />
      </div>
      <div className="mx-auto grid w-full max-w-7xl grid-cols-[1.4fr_repeat(3,0.75fr)] gap-10 px-5 py-14 sm:px-8 lg:px-10 max-[1100px]:grid-cols-[1.2fr_repeat(2,0.8fr)] max-[620px]:grid-cols-2">
        <div className="max-w-sm max-[620px]:col-span-2">
          <BrandLogo compact />
          <p className="mt-5 leading-relaxed">
            Bespoke journeys shaped through real conversations, careful local
            knowledge and clear confirmation.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/15 px-3 py-1.5 text-[0.65rem] font-bold text-white/80">India & beyond</span>
            <span className="rounded-full border border-white/15 px-3 py-1.5 text-[0.65rem] font-bold text-white/80">Enquiry-led planning</span>
          </div>
        </div>
        <div className="grid content-start gap-2 [&_a]:text-sm [&_a]:no-underline [&_a]:transition [&_a:hover]:translate-x-1 [&_a:hover]:text-secondary-light">
          <h3 className="mb-2 text-sm font-extrabold text-white">Discover</h3>
          <Link href="/destinations">Destinations</Link>
          <Link href="/packages">Curated journeys</Link>
          <Link href="/gallery">Travel gallery</Link>
          <Link href="/blog">Travel journal</Link>
        </div>
        <div className="grid content-start gap-2 [&_a]:text-sm [&_a]:no-underline [&_a]:transition [&_a:hover]:translate-x-1 [&_a:hover]:text-secondary-light">
          <h3 className="mb-2 text-sm font-extrabold text-white">BR Tours</h3>
          <Link href="/about-us">Our story</Link>
          <Link href="/contact-us">Plan my trip</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/cancellation-policy">Cancellation</Link>
        </div>
        <div className="grid content-start gap-3 max-[1100px]:col-span-3 max-[620px]:col-span-2 [&_a]:flex [&_a]:items-start [&_a]:gap-2 [&_a]:text-sm [&_a]:no-underline [&_p]:flex [&_p]:items-start [&_p]:gap-2 [&_svg]:shrink-0 [&_svg]:text-secondary-light">
          <h3 className="mb-1 text-sm font-extrabold text-white">Start a conversation</h3>
          {phone ? (
            <a href={`tel:${phone}`}>
              <Phone aria-hidden="true" size={18} /> <span>{phone}</span>
            </a>
          ) : null}
          {email ? (
            <a href={`mailto:${email}`}>
              <Mail aria-hidden="true" size={18} /> <span>{email}</span>
            </a>
          ) : null}
          {address ? (
            <p>
              <MapPin aria-hidden="true" size={18} /> <span>{address}</span>
            </p>
          ) : null}
          {!phone && !email && !address ? (
            <Link href="/contact-us">Use our secure enquiry form →</Link>
          ) : null}
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-7xl justify-between gap-6 border-t border-white/10 px-5 py-5 text-[0.67rem] sm:px-8 lg:px-10 max-[620px]:flex-col max-[620px]:gap-1.5">
        <span>© {new Date().getFullYear()} BR Tours and Travels</span>
        <span>Journeys remain enquiries until availability is confirmed.</span>
      </div>
    </footer>
  );
}
