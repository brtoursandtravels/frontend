import Image from "next/image";
import { Camera, Sparkles } from "lucide-react";

export function GalleryHero({ albumCount, imageCount }: { albumCount: number; imageCount: number }) {
  return (
    <section className="relative isolate min-h-[34rem] overflow-hidden bg-primary-ink text-white" aria-labelledby="gallery-title">
      <Image alt="Morning light over the ancient ghats beside the Ganges" className="gallery-hero-image -z-2 object-cover object-center" fetchPriority="high" fill loading="eager" sizes="100vw" src="/images/hero-slider/varanasi-ghats.webp" />
      <div className="absolute inset-0 -z-1 bg-[linear-gradient(90deg,rgba(2,28,29,.48)_0%,rgba(2,28,29,.26)_48%,rgba(2,28,29,.06)_76%,transparent_100%)] max-[700px]:bg-[linear-gradient(90deg,rgba(2,28,29,.58),rgba(2,28,29,.16))]" />
      <div className="mx-auto flex min-h-[34rem] w-full max-w-7xl flex-col justify-center px-5 py-16 sm:px-8 lg:px-10">
        <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-secondary-light backdrop-blur-sm"><Sparkles aria-hidden="true" size={14} /> Lens &amp; landscape · visual journal</p>
        <h1 className="m-0 max-w-[18ch] text-balance font-display text-[clamp(2.85rem,4.3vw,4.5rem)] font-medium leading-[.98] tracking-[-0.045em] text-white [text-shadow:0_3px_16px_rgb(0_0_0_/_0.45)] max-[620px]:text-[clamp(2.5rem,11vw,3.5rem)]" id="gallery-title">Windows into the extraordinary.</h1>
        <p className="mt-5 max-w-2xl text-[0.98rem] leading-relaxed text-white/76">Explore landscapes, quiet details and timeless places from BR’s published travel collections.</p>
        <p className="mt-7 inline-flex w-fit items-center gap-3 rounded-full border border-white/20 bg-primary-ink/48 px-4 py-2.5 text-[0.78rem] font-bold leading-snug text-white/80 backdrop-blur-md max-[420px]:w-full max-[420px]:gap-2 max-[420px]:px-3">
          <Camera className="shrink-0 text-secondary-light" aria-hidden="true" size={17} />
          <span className="inline-flex min-w-0 items-center gap-1.5">
            <strong className="shrink-0 whitespace-nowrap text-white">{albumCount}</strong>
            <span>curated {albumCount === 1 ? "album" : "albums"}</span>
          </span>
          <span className="shrink-0 text-white/35" aria-hidden="true">·</span>
          <span className="inline-flex min-w-0 items-center gap-1.5">
            <strong className="shrink-0 whitespace-nowrap text-white">{imageCount}</strong>
            <span>{imageCount === 1 ? "moment" : "moments"} on this page</span>
          </span>
        </p>
      </div>
    </section>
  );
}
