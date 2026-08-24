"use client";

/**
 * Count-up numeral — ticks from 0 to value when scrolled into view.
 * Tabular numerals so nothing shifts. Reduced motion: renders final value.
 */
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

interface Props {
  value: number;
  decimals?: number;
  duration?: number;
  className?: string;
}

export default function StatNumber({
  value,
  decimals = 0,
  duration = 1.4,
  className = "",
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(value);
      return;
    }
    let raf: number;
    const start = performance.now();
    const total = duration * 1000;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / total);
      // expo-out — fast start, long settle
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduced]);

  const formatted = display.toLocaleString("en-IE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={`tnum ${className}`}>
      {formatted}
    </span>
  );
}
