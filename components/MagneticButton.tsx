"use client";

/**
 * Magnetic CTA — the button leans toward the cursor inside a proximity
 * field. Subtle by design: max ~10px travel, spring return. Inert on
 * touch devices and under prefers-reduced-motion.
 */
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

interface Props {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline" | "inverse";
  external?: boolean;
  className?: string;
}

export default function MagneticButton({
  href,
  children,
  variant = "solid",
  external,
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [fine, setFine] = useState(false);

  useEffect(() => {
    setFine(window.matchMedia("(pointer: fine)").matches);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.5 });

  const active = fine && !reduced;

  function onMove(e: React.MouseEvent) {
    if (!active || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    x.set(Math.max(-10, Math.min(10, dx * 0.18)));
    y.set(Math.max(-8, Math.min(8, dy * 0.28)));
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  const styles = {
    solid:
      "bg-ink text-inverse hover:bg-accent",
    outline:
      "border border-hairline-dk text-ink hover:border-ink",
    inverse:
      "bg-inverse text-ink hover:bg-accent hover:text-inverse",
  }[variant];

  const inner = (
    <motion.span
      style={{ x: sx, y: sy }}
      className={`inline-block px-8 py-4 text-sm font-semibold transition-colors duration-300 ${styles}`}
    >
      {children}
    </motion.span>
  );

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`inline-block ${className}`}
    >
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {inner}
        </a>
      ) : (
        <Link href={href}>{inner}</Link>
      )}
    </div>
  );
}
