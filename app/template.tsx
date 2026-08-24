"use client";

/**
 * Route transition — re-mounts on every navigation.
 * Entrance-only (App Router has no reliable exit phase):
 * content rises 12px on a physical curve. Reduced motion: none.
 */
import { motion, useReducedMotion } from "framer-motion";
import { ease } from "@/lib/tokens";

export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: ease.out }}
    >
      {children}
    </motion.div>
  );
}
