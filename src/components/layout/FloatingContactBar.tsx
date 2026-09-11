"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import type { SiteData } from "@/lib/contracts";
import { settingText, whatsappLink } from "@/lib/presentation";

export function FloatingContactBar({ site }: { site?: SiteData | null }) {
  const pathname = usePathname();
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
    <aside aria-label="Quick contact options">
      <Link
        className="fixed bottom-5 left-5 z-60 flex items-center gap-2 rounded-full border border-white/25 bg-primary px-4 py-2.5 text-xs font-extrabold text-white no-underline shadow-dropdown transition-transform hover:-translate-y-0.5 max-[620px]:bottom-[4.9rem] max-[620px]:left-3"
        href="/contact-us"
        prefetch={false}
        aria-label="Plan a trip with BR Tours"
      >
        <Sparkles aria-hidden="true" size={20} />
        <span>Plan a trip</span>
      </Link>

      <a
        className="fixed bottom-5 right-5 z-60 flex size-12 items-center justify-center rounded-full border border-white/30 bg-[#25d366] text-white shadow-dropdown transition-transform hover:-translate-y-0.5 hover:bg-[#20bd5a] motion-safe:animate-contact-pulse motion-reduce:animate-none max-[620px]:bottom-[4.9rem] max-[620px]:right-3"
        href={whatsappHref ?? "/contact-us"}
        rel={whatsappHref ? "noreferrer" : undefined}
        target={whatsappHref ? "_blank" : undefined}
        aria-label={
          whatsappHref
            ? "Chat with BR Tours on WhatsApp"
            : "Contact BR Tours about WhatsApp"
        }
        title="WhatsApp"
      >
        <svg
          aria-hidden="true"
          className="size-6 fill-current"
          viewBox="0 0 24 24"
        >
          <path d="M12.04 2a9.84 9.84 0 0 0-8.41 14.95L2.05 22l5.2-1.53A9.96 9.96 0 1 0 12.04 2Zm0 17.92a8.05 8.05 0 0 1-4.1-1.12l-.3-.18-3.08.91.92-3-.2-.31a8.03 8.03 0 1 1 6.76 3.7Zm4.41-6.02c-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2a7.25 7.25 0 0 1-1.34-1.67c-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.43-.59 1.63-1.15.2-.57.2-1.05.14-1.15-.06-.1-.22-.16-.46-.28Z" />
        </svg>
      </a>
    </aside>
  );
}
