"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { WhatsAppIcon } from "@/components/common/SocialContactLinks";
import type { SiteData } from "@/lib/contracts";
import { contactPhone, whatsappLink } from "@/lib/presentation";

export function FloatingContactBar({ site }: { site?: SiteData | null }) {
  const pathname = usePathname();
  const whatsapp = contactPhone(site);
  const whatsappHref = whatsappLink(whatsapp);

  if (/^\/packages\/[^/]+\/?$/.test(pathname)) {
    return null;
  }

  return (
    <aside aria-label="Quick contact options">
      <Link
        className="fixed bottom-5 left-5 z-60 flex items-center gap-2 rounded-full border border-white/25 bg-primary px-4 py-2.5 text-xs font-extrabold text-white no-underline shadow-dropdown transition-transform hover:-translate-y-0.5 max-[620px]:bottom-[calc(0.75rem+env(safe-area-inset-bottom))] max-[620px]:left-3"
        href="/contact-us"
        prefetch={false}
        aria-label="Plan a trip with BR Tours"
      >
        <Sparkles aria-hidden="true" size={20} />
        <span>Plan a trip</span>
      </Link>

      {whatsappHref ? <a
        className="fixed bottom-5 right-5 z-60 flex size-12 items-center justify-center rounded-full border border-white/30 bg-[#25d366] text-white shadow-dropdown transition-transform hover:-translate-y-0.5 hover:bg-[#20bd5a] motion-safe:animate-contact-pulse motion-reduce:animate-none max-[620px]:bottom-[calc(0.75rem+env(safe-area-inset-bottom))] max-[620px]:right-3"
        href={whatsappHref}
        rel="noopener noreferrer"
        target="_blank"
        aria-label="Chat with BR Tours on WhatsApp"
        title="WhatsApp"
      >
        <WhatsAppIcon className="size-6" />
      </a> : null}
    </aside>
  );
}
