"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

export function ScrollRevealCard({ children, index }: { children: ReactNode; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const observer = new IntersectionObserver(
      ([entry]) => card.classList.toggle("is-visible", Boolean(entry?.isIntersecting)),
      { rootMargin: "-8% 0px -8% 0px", threshold: 0.18 },
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return <div className={`customise-scroll-card customise-scroll-card-${index + 1} relative z-1`} ref={cardRef}>{children}</div>;
}
