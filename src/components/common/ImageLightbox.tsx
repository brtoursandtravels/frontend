"use client";

import { useEffect, useRef, useState } from "react";
import type { z } from "zod";
import type { publicMediaSchema } from "@/lib/contracts";
import { PublicImage } from "@/components/common/PublicImage";

type Media = z.infer<typeof publicMediaSchema>;

export function ImageLightbox({
  images,
  label,
}: {
  images: Media[];
  label: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const close = () => {
    setActive(null);
    requestAnimationFrame(() => openerRef.current?.focus());
  };
  const move = (direction: -1 | 1) =>
    setActive((current) =>
      current === null
        ? current
        : (current + direction + images.length) % images.length,
    );

  useEffect(() => {
    if (active === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const dialog = dialogRef.current;
    const focusables = () =>
      Array.from(
        dialog?.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
    focusables()[0]?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActive(null);
        requestAnimationFrame(() => openerRef.current?.focus());
      }
      if (event.key === "ArrowLeft")
        setActive((current) =>
          current === null
            ? current
            : (current - 1 + images.length) % images.length,
        );
      if (event.key === "ArrowRight")
        setActive((current) =>
          current === null ? current : (current + 1) % images.length,
        );
      if (event.key === "Tab") {
        const items = focusables();
        const first = items[0];
        const last = items.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", keydown);
    };
  }, [active, images.length]);

  if (!images.length) {
    return (
      <div className="grid min-h-72 place-items-center rounded-xl bg-bg-muted text-center text-primary">
        <div><span className="font-display text-6xl font-semibold">BR</span>
        <p className="mt-3 text-sm text-text-muted">Licensed photography has not been added.</p></div>
      </div>
    );
  }

  const layoutClass =
    images.length === 1
      ? "grid-cols-1"
      : images.length === 2
        ? "grid-cols-2"
        : "grid-cols-2 grid-rows-2 [&>button:first-child]:row-span-2";

  return (
    <>
      <div
        className={`grid min-h-72 gap-1 overflow-hidden rounded-xl bg-bg-muted ${layoutClass}`}
        aria-label={`${label} image gallery`}
      >
        {images.slice(0, 4).map((image, index) => (
          <button
            className="group relative min-h-36 overflow-hidden border-0 bg-primary p-0"
            key={image.id}
            type="button"
            ref={
              index === 0
                ? (node) => {
                    openerRef.current = node;
                  }
                : undefined
            }
            onClick={(event) => {
              openerRef.current = event.currentTarget;
              setActive(index);
            }}
            aria-label={`Open image ${index + 1} of ${images.length}: ${image.altText}`}
          >
            <PublicImage
              className="object-cover transition-transform duration-500 group-hover:scale-[1.035]"
              alt={image.altText}
              priority={index === 0}
              sizes={
                index === 0
                  ? "(max-width: 767px) 100vw, 65vw"
                  : "(max-width: 767px) 50vw, 25vw"
              }
              src={image.url}
            />
            {index === 3 && images.length > 4 ? (
              <span className="absolute inset-0 grid place-items-center bg-black/55 text-lg font-extrabold text-white">+{images.length - 4} more</span>
            ) : null}
          </button>
        ))}
      </div>
      {active !== null ? (
        <div
          className="fixed inset-0 z-100 grid place-items-center bg-black/90 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div
            className="relative grid max-h-[96vh] w-full max-w-6xl grid-rows-[auto_minmax(0,1fr)_auto] gap-3"
            role="dialog"
            aria-modal="true"
            aria-label={`${label} image ${active + 1} of ${images.length}`}
            ref={dialogRef}
          >
            <button className="ml-auto rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-bold text-white" type="button" onClick={close}>
              Close <span aria-hidden="true">×</span>
            </button>
            <div
              className="relative min-h-[65vh] touch-pan-y overflow-hidden rounded-lg"
              onTouchStart={(event) => {
                touchStartX.current = event.touches[0]?.clientX ?? null;
              }}
              onTouchEnd={(event) => {
                const start = touchStartX.current;
                const end = event.changedTouches[0]?.clientX;
                touchStartX.current = null;
                if (start === null || end === undefined) return;
                const distance = end - start;
                if (Math.abs(distance) < 45) return;
                move(distance > 0 ? -1 : 1);
              }}
            >
              <PublicImage
                className="object-contain"
                alt={images[active]!.altText}
                sizes="100vw"
                src={images[active]!.url}
              />
            </div>
            <div className="grid grid-cols-[3rem_1fr_3rem] items-center gap-3 text-white">
              <button
                className="flex size-12 items-center justify-center rounded-full border border-white/25 bg-white/10 text-xl"
                type="button"
                onClick={() => move(-1)}
                aria-label="Previous image"
              >
                ←
              </button>
              <p className="m-0 grid text-center text-sm text-white/70">
                <strong className="text-white">
                  {active + 1} / {images.length}
                </strong>
                {images[active]!.caption ? (
                  <span>{images[active]!.caption}</span>
                ) : null}
              </p>
              <button
                className="flex size-12 items-center justify-center rounded-full border border-white/25 bg-white/10 text-xl"
                type="button"
                onClick={() => move(1)}
                aria-label="Next image"
              >
                →
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
