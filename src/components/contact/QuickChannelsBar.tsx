import { Camera, Mail, MessageCircle, Phone, UsersRound } from "lucide-react";

type QuickChannelsBarProps = {
  email?: string | null;
  facebookHref?: string | null;
  instagramHref?: string | null;
  phone?: string | null;
  whatsappHref?: string | null;
  hours?: string | null;
};

export function QuickChannelsBar({
  email,
  facebookHref,
  instagramHref,
  phone,
  whatsappHref,
  hours,
}: QuickChannelsBarProps) {
  const channels = [
    whatsappHref ? {
      href: whatsappHref,
      icon: MessageCircle,
      eyebrow: "Fastest for quick questions",
      title: "Chat on WhatsApp",
      detail: "Start a direct conversation with our team",
      external: true,
    } : null,
    phone ? {
      href: `tel:${phone}`,
      icon: Phone,
      eyebrow: "Direct voice consultation",
      title: phone,
      detail: hours ?? "Call during business hours",
      external: false,
    } : null,
    email ? {
      href: `mailto:${email}`,
      icon: Mail,
      eyebrow: "Detailed itinerary requests",
      title: email,
      detail: "Ideal when you already have trip notes to share",
      external: false,
    } : null,
    instagramHref ? {
      href: instagramHref,
      icon: Camera,
      eyebrow: "Travel inspiration",
      title: "Instagram",
      detail: "Photos, reels and new journey ideas",
      external: true,
    } : null,
    facebookHref ? {
      href: facebookHref,
      icon: UsersRound,
      eyebrow: "News and updates",
      title: "Facebook",
      detail: "Tours, updates and travel stories",
      external: true,
    } : null,
  ].filter((channel): channel is NonNullable<typeof channel> => Boolean(channel));

  if (!channels.length) return null;

  const columns =
    channels.length >= 4
      ? "lg:grid-cols-2 xl:grid-cols-4"
      : channels.length === 3
        ? "lg:grid-cols-3"
        : channels.length === 2
          ? "lg:grid-cols-2"
          : "lg:grid-cols-1";

  return (
    <section className={`mx-auto -mt-9 grid w-full max-w-7xl gap-4 px-5 sm:px-8 lg:px-10 ${columns}`} aria-label="Contact options">
      {channels.map(({ detail, external, eyebrow, href, icon: Icon, title }) => (
        <a
          className="relative z-2 grid grid-cols-[2.75rem_1fr] gap-3 rounded-xl border border-border-subtle bg-white p-5 text-text-heading no-underline shadow-card transition hover:-translate-y-1 hover:border-secondary/40 hover:shadow-card-hover"
          href={href}
          key={href}
          rel={external ? "noreferrer" : undefined}
          target={external ? "_blank" : undefined}
        >
          <span className="grid size-11 place-items-center rounded-full bg-accent-soft text-accent-hover"><Icon aria-hidden="true" size={20} /></span>
          <span className="min-w-0">
            <span className="block text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-secondary-hover">{eyebrow}</span>
            <strong className="mt-1 block truncate text-[0.95rem]">{title}</strong>
            <span className="mt-1 block text-[0.78rem] leading-relaxed text-text-muted">{detail}</span>
          </span>
        </a>
      ))}
    </section>
  );
}
