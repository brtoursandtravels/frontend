"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

/** Measure the rendered cards so controls follow the available space at any width. */
export function HorizontalCarousel({ children, label, previousLabel, nextLabel }: { children: ReactNode; label: string; previousLabel: string; nextLabel: string }) {
  const id = useId();
  const viewport = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ overflowing: false, atStart: true, atEnd: false });

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    let frame = 0;
    const measure = () => {
      const remaining = element.scrollWidth - element.clientWidth;
      const next = { overflowing: remaining > 2, atStart: element.scrollLeft <= 2, atEnd: element.scrollLeft >= remaining - 2 };
      setPosition(previous => previous.overflowing === next.overflowing && previous.atStart === next.atStart && previous.atEnd === next.atEnd ? previous : next);
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); };
    const observer = new ResizeObserver(schedule);
    observer.observe(element);
    Array.from(element.children).forEach(child => observer.observe(child));
    element.addEventListener("scroll", schedule, { passive: true });
    schedule();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); element.removeEventListener("scroll", schedule); };
  }, [children]);

  function move(direction: -1 | 1) {
    const element = viewport.current;
    if (!element) return;
    const card = element.firstElementChild;
    const gap = Number.parseFloat(getComputedStyle(element).columnGap) || 0;
    const step = card ? card.getBoundingClientRect().width + gap : element.clientWidth;
    const cardsPerPage = Math.max(1, Math.floor((element.clientWidth + gap + 2) / step));
    element.scrollBy({ left: direction * step * cardsPerPage, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  return <div role="region" aria-roledescription="carousel" aria-label={label}>
    <div ref={viewport} id={id} role="list" aria-label={label} tabIndex={position.overflowing ? 0 : undefined}
      className="flex snap-x snap-mandatory scroll-px-1 gap-5 overflow-x-auto overscroll-x-contain px-1 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:rounded-2xl focus-visible:outline-2 focus-visible:outline-primary max-[620px]:gap-4"
      onKeyDown={event => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1); }
      }}>
      {children}
    </div>
    {position.overflowing ? <div className="mt-6 flex justify-center gap-3" role="group" aria-label={`${label} controls`}>
      <button type="button" aria-label={previousLabel} aria-controls={id} disabled={position.atStart} onClick={() => move(-1)} className="grid size-12 place-items-center rounded-full border border-primary/20 bg-white text-primary shadow-card transition hover:bg-primary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:cursor-default disabled:opacity-35 disabled:hover:bg-white disabled:hover:text-primary"><ArrowLeft size={20} aria-hidden="true" /></button>
      <button type="button" aria-label={nextLabel} aria-controls={id} disabled={position.atEnd} onClick={() => move(1)} className="grid size-12 place-items-center rounded-full border border-primary/20 bg-white text-primary shadow-card transition hover:bg-primary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:cursor-default disabled:opacity-35 disabled:hover:bg-white disabled:hover:text-primary"><ArrowRight size={20} aria-hidden="true" /></button>
    </div> : null}
  </div>;
}
