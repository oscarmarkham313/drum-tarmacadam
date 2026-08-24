"use client";

/**
 * Testimonial carousel — one quote on stage at a time, auto-advancing,
 * with arrows, an index counter, and touch swipe. Slides enter on the
 * same rise-fade as the rest of the site (CSS keyed remount — the
 * pattern that survives static export). Reduced motion: instant swaps.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { home } from "@/config/copy";

const AUTO_MS = 5500;

export default function TestimonialCarousel() {
  const { items } = home.testimonials;
  const [index, setIndex] = useState(0);
  const [live, setLive] = useState(false);
  const reduced = useReducedMotion();
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (dir: 1 | -1) => {
      setLive(true);
      setIndex((v) => (v + dir + items.length) % items.length);
    },
    [items.length],
  );

  /* auto-advance; the index dep restarts the clock after manual moves */
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => go(1), AUTO_MS);
    return () => window.clearInterval(id);
  }, [go, reduced, index]);

  const t = items[index];

  return (
    <div
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
      }}
    >
      <div
        key={index}
        className={`min-h-[13.5rem] md:min-h-[16rem] ${
          live && !reduced ? "t-slide" : ""
        }`}
      >
        <span className="text-5xl text-accent" aria-hidden="true">
          “
        </span>
        <blockquote className="mt-2 text-2xl font-bold leading-snug tracking-tight md:text-4xl">
          {t.quote}
        </blockquote>
        <p className="mt-8 text-sm text-text-3">
          <span className="font-semibold text-ink">{t.name}</span>
          {" — "}
          {t.role}
        </p>
      </div>

      <div className="mt-10 flex items-center justify-center gap-6">
        <button
          type="button"
          aria-label="Previous testimonial"
          onClick={() => go(-1)}
          className="flex h-11 w-11 items-center justify-center border border-hairline-dk text-ink transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-inverse"
        >
          ←
        </button>
        <span className="tnum text-xs text-text-3">
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(items.length).padStart(2, "0")}
        </span>
        <button
          type="button"
          aria-label="Next testimonial"
          onClick={() => go(1)}
          className="flex h-11 w-11 items-center justify-center border border-hairline-dk text-ink transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-inverse"
        >
          →
        </button>
      </div>
    </div>
  );
}
