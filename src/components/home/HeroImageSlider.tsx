"use client";

import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const slides = [
  {
    src: "/images/hero-slider/udaipur-lake-pichola.webp",
    label: "Lake Pichola, Udaipur",
    position: "object-[62%_center]",
  },
   {
    src: "/images/hero-slider/jaisalmer-dunes.webp",
    label: "Thar Desert, Jaisalmer",
    position: "object-[62%_center]",
  },
  {
    src: "/images/hero-slider/kerala-backwaters.webp",
    label: "Kerala backwaters",
    position: "object-[62%_center]",
  },
   {
    src: "/images/hero-slider/meghalaya-root-bridge.webp",
    label: "Living root bridge, Meghalaya",
    position: "object-[64%_center]",
  },
  {
    src: "/images/hero-slider/varanasi-ghats.webp",
    label: "Varanasi ghats",
    position: "object-[64%_center]",
  },
 
  {
    src: "/images/hero-slider/ladakh-pangong.webp",
    label: "Pangong Tso, Ladakh",
    position: "object-[58%_center]",
  },
] as const;

const SLIDE_DURATION = 3000;
const FADE_DURATION = 1000;

export function HeroImageSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showSlide = useCallback(
    (nextIndex: number) => {
      if (activeIndex === nextIndex) return;
      setPreviousIndex(activeIndex);
      setActiveIndex(nextIndex);
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
      fadeTimer.current = setTimeout(
        () => setPreviousIndex(null),
        FADE_DURATION,
      );
    },
    [activeIndex],
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) setPaused(true);
    };
    media.addEventListener("change", handleChange);
    const frame = media.matches
      ? window.requestAnimationFrame(() => setPaused(true))
      : null;
    return () => {
      media.removeEventListener("change", handleChange);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (paused) return;
    const nextIndex = (activeIndex + 1) % slides.length;
    const preloadTimer = window.setTimeout(() => {
      const nextImage = new window.Image();
      nextImage.src = slides[nextIndex].src;
    }, SLIDE_DURATION - 2000);
    const slideTimer = window.setTimeout(() => {
      showSlide(nextIndex);
    }, SLIDE_DURATION);
    return () => {
      window.clearTimeout(preloadTimer);
      window.clearTimeout(slideTimer);
    };
  }, [activeIndex, paused, showSlide]);

  useEffect(
    () => () => {
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
    },
    [],
  );

  const activeSlide = slides[activeIndex];
  const previousSlide = previousIndex === null ? null : slides[previousIndex];

  return (
    <>
      <div className="absolute inset-0" aria-hidden="true">
        {previousSlide ? (
          <Image
            alt=""
            className={`scale-[1.015] object-cover ${previousSlide.position}`}
            fill
            key={`previous-${previousSlide.src}`}
            sizes="100vw"
            src={previousSlide.src}
          />
        ) : null}
        <Image
          alt=""
          className={`${previousSlide ? "animate-hero-fade motion-reduce:animate-none" : "scale-[1.015]"} object-cover ${activeSlide.position}`}
          fill
          key={activeSlide.src}
          preload={activeIndex === 0}
          sizes="100vw"
          src={activeSlide.src}
        />
      </div>

      {/* <div
        className="absolute right-5 top-5 z-3 flex items-center gap-2 rounded-full border border-white/20 bg-primary-ink/35 p-1.5 shadow-card backdrop-blur-md"
        aria-label="Hero image controls"
        role="group"
      >
        {slides.map((slide, index) => (
          <button
            className="group grid size-6 place-items-center rounded-full border-0 bg-transparent p-0"
            key={slide.src}
            type="button"
            aria-label={`Show ${slide.label}`}
            aria-pressed={index === activeIndex}
            onClick={() => showSlide(index)}
          >
            <span
              aria-hidden="true"
              className={`size-2.5 rounded-full border border-white/70 transition-colors ${index === activeIndex ? "bg-secondary-light" : "bg-white/25 group-hover:bg-white/60"}`}
            />
          </button>
        ))}
        <button
          className="ml-0.5 grid size-8 place-items-center rounded-full border-0 bg-white/15 p-0 text-white transition hover:bg-white/25"
          type="button"
          aria-label={
            paused ? "Play hero image slider" : "Pause hero image slider"
          }
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? (
            <Play aria-hidden="true" size={14} fill="currentColor" />
          ) : (
            <Pause aria-hidden="true" size={14} fill="currentColor" />
          )}
        </button>
      </div> */}
    </>
  );
}
