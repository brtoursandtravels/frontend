"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Copy, Expand, Images, MapPin, Maximize2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { z } from "zod";
import type { publicMediaSchema } from "@/lib/contracts";
import { PublicImage } from "@/components/common/PublicImage";

type Media = z.infer<typeof publicMediaSchema>;

function albumTileClass(index: number, total: number) {
  if (total === 1) return "col-span-12 row-span-6 max-[700px]:col-span-2 max-[700px]:row-span-4";
  if (total === 2) return index === 0
    ? "col-span-7 row-span-6 max-[700px]:col-span-2 max-[700px]:row-span-2"
    : "col-span-5 row-span-6 max-[700px]:col-span-2 max-[700px]:row-span-2";
  if (total === 3) return index === 0
    ? "col-span-7 row-span-6 max-[700px]:col-span-2 max-[700px]:row-span-2"
    : "col-span-5 row-span-3 max-[700px]:col-span-1 max-[700px]:row-span-2";
  if (total === 4) {
    if (index === 0) return "col-span-7 row-span-6 max-[700px]:col-span-2 max-[700px]:row-span-2";
    if (index === 1) return "col-span-5 row-span-3 max-[700px]:col-span-2 max-[700px]:row-span-1";
    if (index === 2) return "col-span-3 row-span-3 max-[700px]:col-span-1 max-[700px]:row-span-1";
    return "col-span-2 row-span-3 max-[700px]:col-span-1 max-[700px]:row-span-1";
  }
  return index === 0
    ? "col-span-6 row-span-6 max-[700px]:col-span-2 max-[700px]:row-span-2"
    : "col-span-3 row-span-3 max-[700px]:col-span-1 max-[700px]:row-span-1";
}

export function ImageLightbox({
  images,
  label,
  location,
  planHref = "/contact-us?subject=custom-trip#contact-form",
  packageHref,
  variant = "album",
  priorityImages = false,
  showViewAllLabel = false,
}: {
  images: Media[];
  label: string;
  location?: string;
  planHref?: string;
  packageHref?: string;
  variant?: "album" | "masonry";
  priorityImages?: boolean;
  showViewAllLabel?: boolean;
}) {
  const [active, setActive] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const theaterRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const close = useCallback(() => {
    setActive(null);
    setZoomed(false);
    requestAnimationFrame(() => openerRef.current?.focus());
  }, []);
  const move = useCallback((direction: -1 | 1) => {
    setZoomed(false);
    setActive((current) => current === null ? current : (current + direction + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (active === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = () => Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])') ?? []);
    focusables()[0]?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
      if (event.key === "Tab") {
        const items = focusables();
        const first = items[0];
        const last = items.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", keydown);
    };
  }, [active, close, images.length, move]);

  if (!images.length) {
    return <div className="grid min-h-72 place-items-center rounded-xl bg-bg-muted text-center text-primary"><div><span className="font-display text-6xl font-semibold">BR</span><p className="mt-3 text-sm text-text-muted">Published photography is being prepared.</p></div></div>;
  }

  const visibleImages = variant === "masonry" ? images : images.slice(0, 4);
  const openImage = (index: number, opener: HTMLButtonElement) => {
    openerRef.current = opener;
    setCopied(false);
    setActive(index);
  };

  return (
    <>
      <div className={variant === "masonry" ? "columns-1 gap-3 sm:columns-2 lg:columns-3" : "grid h-[32rem] grid-cols-12 grid-rows-6 gap-1.5 overflow-hidden rounded-xl bg-bg-muted max-[700px]:h-[34rem] max-[700px]:grid-cols-2 max-[700px]:grid-rows-4"} aria-label={`${label} image gallery`}>
        {visibleImages.map((image, index) => {
          const ratio = image.width && image.height ? `${image.width} / ${image.height}` : "4 / 3";
          return (
            <button
              className={`group relative overflow-hidden border-0 bg-primary p-0 text-left ${variant === "masonry" ? "mb-3 block w-full break-inside-avoid rounded-lg" : albumTileClass(index, visibleImages.length)}`}
              key={image.id}
              style={variant === "masonry" ? { aspectRatio: ratio } : undefined}
              type="button"
              onClick={(event) => openImage(index, event.currentTarget)}
              aria-label={`Open image ${index + 1} of ${images.length}: ${image.altText}`}
            >
              <PublicImage className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]" alt={image.altText} priority={priorityImages && index === 0 && variant === "album"} sizes={variant === "masonry" ? "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" : index === 0 ? "(max-width: 700px) 100vw, 60vw" : "(max-width: 700px) 50vw, 30vw"} src={image.url} />
              <span className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/5 to-transparent opacity-80 transition-opacity group-hover:opacity-100" aria-hidden="true" />
              <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full border border-white/25 bg-black/30 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100"><Expand aria-hidden="true" size={16} /></span>
              <span className="absolute inset-x-0 bottom-0 grid gap-1 p-4 text-white">
                {location ? <small className="inline-flex items-center gap-1 text-[0.64rem] font-extrabold uppercase tracking-[0.1em] text-secondary-light"><MapPin aria-hidden="true" size={12} /> {location}</small> : null}
                <strong className="line-clamp-2 text-[0.8rem] leading-snug text-white">{image.caption ?? image.altText}</strong>
              </span>
              {variant === "album" && index === visibleImages.length - 1 && images.length > visibleImages.length && showViewAllLabel ? <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/60 px-4 py-2.5 text-xs font-extrabold text-white backdrop-blur-sm"><Images aria-hidden="true" size={16} /> View all {images.length} photos</span> : variant === "album" && index === visibleImages.length - 1 && images.length > visibleImages.length ? <span className="absolute inset-0 grid place-items-center bg-black/58 text-lg font-extrabold text-white">+{images.length - visibleImages.length} more views</span> : null}
            </button>
          );
        })}
      </div>

      {active !== null ? (
        <div className="fixed inset-0 z-100 grid place-items-center bg-[#020a0b]/95 p-3 backdrop-blur-md" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
          <div className="relative grid max-h-[97vh] w-full max-w-7xl grid-rows-[auto_minmax(0,1fr)_auto_auto] gap-3" role="dialog" aria-modal="true" aria-label={`${label} image ${active + 1} of ${images.length}`} ref={dialogRef}>
            <div className="flex items-center justify-between gap-3 text-white">
              <p className="m-0 min-w-0 truncate text-[0.78rem] font-bold text-white/65">{label} · {active + 1} of {images.length}</p>
              <div className="flex gap-2">
                <button className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 text-xs font-bold text-white" type="button" onClick={async () => { await theaterRef.current?.requestFullscreen?.(); }}><Maximize2 aria-hidden="true" size={15} /><span className="max-[520px]:hidden">Fullscreen</span></button>
                <button className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 text-xs font-bold text-white" type="button" onClick={async () => { const shareUrl = images[active]!.url; if (navigator.share) await navigator.share({ title: label, text: images[active]!.caption ?? images[active]!.altText, url: shareUrl }).catch(() => undefined); else { await navigator.clipboard.writeText(shareUrl); setCopied(true); } }}><Copy aria-hidden="true" size={15} /><span className="max-[520px]:hidden">{copied ? "Copied" : "Share"}</span></button>
                <button className="grid size-10 place-items-center rounded-full border border-white/25 bg-white/10 text-white" type="button" onClick={close} aria-label="Close gallery"><X aria-hidden="true" size={18} /></button>
              </div>
            </div>
            <div className="relative min-h-[55vh] overflow-hidden rounded-lg bg-black" ref={theaterRef} style={{ touchAction: "pinch-zoom pan-y" }} onDoubleClick={() => setZoomed((value) => !value)} onTouchStart={(event) => { if (event.touches.length === 1) touchStartX.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={(event) => { const start = touchStartX.current; const end = event.changedTouches[0]?.clientX; touchStartX.current = null; if (start === null || end === undefined || Math.abs(end - start) < 45) return; move(end - start > 0 ? -1 : 1); }}>
              <PublicImage className={`object-contain transition-transform duration-300 ${zoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"}`} alt={images[active]!.altText} sizes="100vw" src={images[active]!.url} />
              {images.length > 1 ? <><button className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-sm" type="button" onClick={() => move(-1)} aria-label="Previous image"><ChevronLeft aria-hidden="true" size={23} /></button><button className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-sm" type="button" onClick={() => move(1)} aria-label="Next image"><ChevronRight aria-hidden="true" size={23} /></button></> : null}
            </div>
            <div className="flex items-end justify-between gap-5 text-white max-[700px]:items-start max-[700px]:flex-col">
              <div>{location ? <p className="mb-1 inline-flex items-center gap-1 text-[0.68rem] font-extrabold uppercase tracking-[0.12em] text-secondary-light"><MapPin aria-hidden="true" size={13} /> {location}</p> : null}<p className="m-0 max-w-3xl text-[0.86rem] leading-relaxed text-white/76">{images[active]!.caption ?? images[active]!.altText}</p></div>
              <div className="flex shrink-0 flex-wrap gap-2"><Link className="rounded-full bg-accent px-4 py-2.5 text-xs font-extrabold text-white no-underline" href={planHref}>Ask about this destination</Link>{packageHref ? <Link className="rounded-full border border-white/25 px-4 py-2.5 text-xs font-extrabold text-white no-underline" href={packageHref}>View related package</Link> : null}</div>
            </div>
            {images.length > 1 ? <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Choose an image">{images.map((image, index) => <button aria-label={`Show image ${index + 1}`} aria-pressed={active === index} className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-md border-2 bg-primary p-0 ${active === index ? "border-secondary" : "border-transparent opacity-55 hover:opacity-100"}`} key={image.id} type="button" onClick={() => { setZoomed(false); setActive(index); }}><PublicImage alt="" className="object-cover" sizes="80px" src={image.url} /></button>)}</div> : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
