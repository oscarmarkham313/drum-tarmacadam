"use client";

/**
 * Scroll entrance — children rise on a physical curve when they enter
 * the viewport. Stagger by passing `delay`. Reduced motion: static.
 */
import { motion, useReducedMotion } from "framer-motion";
import { ease } from "@/lib/tokens";

interface Props {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

export default function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: Props) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.85, ease: ease.out, delay }}
    >
      {children}
    </motion.div>
  );
}
