"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Phone, Sparkles } from "lucide-react";
import type { SiteData } from "@/lib/contracts";
import { settingText, whatsappLink } from "@/lib/presentation";

export function FloatingContactBar({ site }: { site?: SiteData | null }) {
  const pathname = usePathname();
  const phone = settingText(site, ["contact.phone", "business.phone", "phone"]);
  const whatsapp = settingText(site, [
    "contact.whatsapp",
    "business.whatsapp",
    "whatsapp",
  ]);
  const whatsappHref = whatsappLink(whatsapp);

  if (/^\/packages\/[^/]+\/?$/.test(pathname)) {
    return null;
  }

  return (
    <aside className="fixed bottom-5 right-5 z-60 flex gap-2 max-[620px]:bottom-[4.9rem] max-[620px]:left-3 max-[620px]:right-3 [&_a]:flex [&_a]:items-center [&_a]:gap-2 [&_a]:rounded-full [&_a]:border [&_a]:border-white/25 [&_a]:bg-primary [&_a]:px-4 [&_a]:py-2.5 [&_a]:text-xs [&_a]:font-extrabold [&_a]:text-white [&_a]:no-underline [&_a]:shadow-dropdown [&_a]:transition-transform [&_a:hover]:-translate-y-0.5 max-[620px]:[&_a]:flex-1 max-[620px]:[&_a]:justify-center max-[620px]:[&_a]:px-2 max-[620px]:[&_a_span]:text-[0.65rem]" aria-label="Quick contact options">
      {whatsappHref ? (
        <a
          className="!bg-success motion-safe:animate-contact-pulse motion-reduce:animate-none"
          href={whatsappHref}
          rel="noreferrer"
          target="_blank"
          aria-label="Chat with BR Tours on WhatsApp"
        >
          <MessageCircle aria-hidden="true" size={21} />
          <span>WhatsApp</span>
        </a>
      ) : null}
      {phone ? (
        <a href={`tel:${phone}`} aria-label={`Call BR Tours at ${phone}`}>
          <Phone aria-hidden="true" size={20} />
          <span>Call</span>
        </a>
      ) : null}
      <Link href="/contact-us" aria-label="Plan a trip with BR Tours">
        <Sparkles aria-hidden="true" size={20} />
        <span>Plan a trip</span>
      </Link>
    </aside>
  );
}
