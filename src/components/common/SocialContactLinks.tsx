import type { SVGProps } from "react";
import type { SiteData } from "@/lib/contracts";
import { contactPhone, socialSettingLink, whatsappLink } from "@/lib/presentation";

export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.04 2a9.84 9.84 0 0 0-8.41 14.95L2.05 22l5.2-1.53A9.96 9.96 0 1 0 12.04 2Zm0 17.92a8.05 8.05 0 0 1-4.1-1.12l-.3-.18-3.08.91.92-3-.2-.31a8.03 8.03 0 1 1 6.76 3.7Zm4.41-6.02c-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2a7.25 7.25 0 0 1-1.34-1.67c-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.43-.59 1.63-1.15.2-.57.2-1.05.14-1.15-.06-.1-.22-.16-.46-.28Z" />
  </svg>;
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>;
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M14 22v-9h3l.5-4H14V6.5c0-1.2.4-2 2-2h2V1.2A25 25 0 0 0 15 1c-3 0-5 1.8-5 5.1V9H7v4h3v9z" />
  </svg>;
}

export function SocialContactLinks({ site, className = "" }: { site?: SiteData | null; className?: string }) {
  const links = [
    { label: "Instagram", href: socialSettingLink(site, "instagram"), Icon: InstagramIcon },
    { label: "Facebook", href: socialSettingLink(site, "facebook"), Icon: FacebookIcon },
    { label: "WhatsApp", href: whatsappLink(contactPhone(site)), Icon: WhatsAppIcon },
  ].filter(link => link.href);

  if (!links.length) return null;
  return <div aria-label="Social and messaging links" className={`flex shrink-0 items-center gap-1 ${className}`}>
    {links.map(({ label, href, Icon }) => <a key={label} href={href!} aria-label={label} title={label} target="_blank" rel="noopener noreferrer" className="inline-flex size-9 items-center justify-center rounded-full text-current no-underline transition-colors hover:bg-white/10 hover:text-secondary-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-light">
      <Icon className="size-[18px]" />
    </a>)}
  </div>;
}
