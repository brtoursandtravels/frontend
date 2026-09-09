"use client";

import Image from "next/image";
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
  {
    src: "/images/hero-slider/documentary-meghalaya.webp",
    label: "Living root bridge, Meghalaya",
    position: "object-center",
  },
  {
    src: "/images/hero-slider/documentary-rishikesh-rafting.webp",
    label: "Himalayan river rafting, Rishikesh",
    position: "object-center",
  },
  {
    src: "/images/hero-slider/documentary-ladakh-trek.webp",
    label: "High-altitude trek, Ladakh",
    position: "object-center",
  },
  {
    src: "/images/hero-slider/documentary-kedarnath-dawn.webp",
    label: "Kedarnath Temple at dawn",
    position: "object-center",
  },
  {
    src: "/images/hero-slider/documentary-varanasi-aarti.webp",
    label: "Ganga Aarti, Varanasi",
    position: "object-center",
  },
  {
    src: "/images/hero-slider/documentary-golden-temple.webp",
    label: "Golden Temple at twilight, Amritsar",
    position: "object-center",
  },
  {
    src: "/images/hero-slider/paragliding-tandem-pov.webp",
    label: "Tandem paragliding in the Himalayas",
    position: "object-[68%_center]",
  },
] as const;

const SLIDE_DURATION = 3000;

export function HeroImageSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const decodedSlides = useRef(new Set<number>([0]));

  const decodeSlide = useCallback(async (index: number) => {
    if (decodedSlides.current.has(index)) return;

    const image = new window.Image();
    const loaded = new Promise<void>((resolve) => {
      image.onload = () => resolve();
      image.onerror = () => resolve();
    });
    image.src = slides[index].src;
    try {
      await image.decode();
    } catch {
      await loaded;
    }
    decodedSlides.current.add(index);
  }, []);

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
    let cancelled = false;
    void decodeSlide(nextIndex);
    const slideTimer = window.setTimeout(async () => {
      await decodeSlide(nextIndex);
      if (!cancelled) setActiveIndex(nextIndex);
    }, SLIDE_DURATION);
    return () => {
      cancelled = true;
      window.clearTimeout(slideTimer);
    };
  }, [activeIndex, decodeSlide, paused]);

  return (
    <>
      <div className="absolute inset-0" aria-hidden="true">
        {slides.map((slide, index) => (
          <Image
            alt=""
            className={`object-cover motion-reduce:transition-none ${slide.position}`}
            fill
            key={slide.src}
            preload={index === 0}
            sizes="100vw"
            src={slide.src}
            style={{
              backfaceVisibility: "hidden",
              opacity: index === activeIndex ? 1 : 0,
              transform:
                index === activeIndex
                  ? "translateZ(0) scale(1.025)"
                  : "translateZ(0) scale(1.015)",
              transition:
                "opacity 1400ms cubic-bezier(0.45, 0, 0.2, 1), transform 4200ms cubic-bezier(0.2, 0.65, 0.3, 1)",
              willChange: "opacity, transform",
            }}
            unoptimized
          />
        ))}
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
