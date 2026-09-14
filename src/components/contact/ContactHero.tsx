import Image from "next/image";
import { Clock3, Sparkles } from "lucide-react";

export function ContactHero() {
  return (
    <header className="relative isolate flex min-h-[32rem] items-center overflow-hidden bg-primary-ink text-white">
      <Image
        alt="A warm private travel-planning studio overlooking an Indian heritage courtyard"
        className="-z-2 object-cover object-center"
        fill
        priority
        sizes="100vw"
        src="/images/travel/contact-concierge-hero-v1.webp"
      />
      <span
        className="absolute inset-0 -z-1 bg-[linear-gradient(90deg,rgba(2,35,36,.76)_0%,rgba(2,35,36,.54)_42%,rgba(2,35,36,.12)_72%,transparent_100%)] max-[700px]:bg-primary-ink/65"
        aria-hidden="true"
      />
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="max-w-4xl">
          <p className="mb-3 inline-flex items-center gap-2 text-[0.75rem] font-extrabold uppercase tracking-[0.16em] text-secondary-light">
            <Sparkles aria-hidden="true" size={16} /> Bespoke trip planning · Concierge desk
          </p>
          <h1 className="m-0 max-w-[15ch] text-balance font-display text-[clamp(2.85rem,4.3vw,4.5rem)] font-medium leading-[0.98] tracking-[-0.045em] text-white [text-shadow:0_3px_16px_rgb(0_0_0_/_0.45)] max-[620px]:text-[clamp(2.5rem,11vw,3.5rem)]">
            Let&apos;s design your journey together.
          </h1>
          <p className="mt-5 max-w-2xl text-[1rem] leading-relaxed text-white/85">
            Whether you have a detailed route or simply an idea of how you want to feel, our destination specialists are here to listen and tailor every detail.
          </p>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-primary-ink/45 px-4 py-2.5 text-sm font-bold text-white backdrop-blur-sm">
            <Clock3 aria-hidden="true" className="text-secondary-light" size={17} /> We aim to review enquiries within 4 business hours
          </p>
        </div>
      </div>
    </header>
  );
}
