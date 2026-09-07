"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  phase: number;
  pulseSpeed: number;
  colorIndex: number;
};

const particleCount = (width: number) => (width < 720 ? 45 : 58);

export function AnimatedCanvasHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const canvasElement: HTMLCanvasElement = canvas;
    const drawingContext: CanvasRenderingContext2D = context;

    const rootStyles = getComputedStyle(document.documentElement);
    const colors = [
      rootStyles.getPropertyValue("--hero-particle-gold").trim(),
      rootStyles.getPropertyValue("--hero-particle-teal").trim(),
      rootStyles.getPropertyValue("--hero-particle-starlight").trim(),
    ];
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frameId: number | null = null;
    let resizeFrameId: number | null = null;
    let lastTimestamp = 0;
    let isVisible = true;

    function createParticles() {
      particles = Array.from({ length: particleCount(width) }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.14 - 0.035,
        radius: 0.7 + Math.random() * 1.8,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.012 + Math.random() * 0.018,
        colorIndex: index % colors.length,
      }));
    }

    function resizeCanvas() {
      const bounds = canvasElement.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvasElement.width = Math.round(width * pixelRatio);
      canvasElement.height = Math.round(height * pixelRatio);
      drawingContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      createParticles();
      draw(0, false);
    }

    function draw(timestamp: number, animate: boolean) {
      const elapsed = lastTimestamp
        ? Math.min(2, (timestamp - lastTimestamp) / 16.67)
        : 1;
      lastTimestamp = timestamp;
      drawingContext.clearRect(0, 0, width, height);

      for (const particle of particles) {
        if (animate) {
          particle.x += particle.vx * elapsed;
          particle.y += particle.vy * elapsed;
          particle.phase += particle.pulseSpeed * elapsed;
          if (particle.x < -8) particle.x = width + 8;
          if (particle.x > width + 8) particle.x = -8;
          if (particle.y < -8) particle.y = height + 8;
          if (particle.y > height + 8) particle.y = -8;
        }

        const pulse = 0.5 + Math.sin(particle.phase) * 0.5;
        drawingContext.beginPath();
        drawingContext.globalAlpha = 0.2 + pulse * 0.5;
        drawingContext.fillStyle = colors[particle.colorIndex] ?? colors[0]!;
        drawingContext.shadowColor = drawingContext.fillStyle;
        drawingContext.shadowBlur = particle.radius * (4 + pulse * 3);
        drawingContext.arc(
          particle.x,
          particle.y,
          particle.radius * (0.8 + pulse * 0.35),
          0,
          Math.PI * 2,
        );
        drawingContext.fill();
      }
      drawingContext.globalAlpha = 1;
      drawingContext.shadowBlur = 0;
    }

    function stopAnimation() {
      if (frameId !== null) cancelAnimationFrame(frameId);
      frameId = null;
    }

    function animate(timestamp: number) {
      frameId = null;
      if (motionQuery.matches || !isVisible || document.hidden) return;
      draw(timestamp, true);
      frameId = requestAnimationFrame(animate);
    }

    function syncAnimation() {
      stopAnimation();
      lastTimestamp = 0;
      if (motionQuery.matches) {
        draw(0, false);
        return;
      }
      if (isVisible && !document.hidden) frameId = requestAnimationFrame(animate);
    }

    function onResize() {
      if (resizeFrameId !== null) cancelAnimationFrame(resizeFrameId);
      resizeFrameId = requestAnimationFrame(() => {
        resizeFrameId = null;
        resizeCanvas();
      });
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = Boolean(entry?.isIntersecting);
        syncAnimation();
      },
      { threshold: 0.02 },
    );
    const onVisibilityChange = () => syncAnimation();
    const onMotionChange = () => syncAnimation();

    resizeCanvas();
    observer.observe(canvasElement);
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    motionQuery.addEventListener("change", onMotionChange);
    syncAnimation();

    return () => {
      stopAnimation();
      if (resizeFrameId !== null) cancelAnimationFrame(resizeFrameId);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-1 size-full opacity-90"
      aria-hidden="true"
    />
  );
}
