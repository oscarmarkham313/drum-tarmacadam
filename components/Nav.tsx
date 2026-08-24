"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { nav } from "@/config/copy";
import { ease } from "@/lib/tokens";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduced = useReducedMotion();

  // close the drawer on navigation
  useEffect(() => setOpen(false), [pathname]);

  // lock scroll while the drawer is open
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="hl-nav fixed inset-x-0 top-0 z-50 border-b border-hairline bg-bg">
        <nav
          className="mx-auto flex h-16 max-w-container items-center justify-between px-5 md:px-10"
          aria-label="Main"
        >
          <Link href="/" aria-label="Dublin Growth Digital — home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt="Dublin Growth Digital"
              className="h-9 w-auto"
            />
          </Link>

          <ul className="hidden items-center gap-8 md:flex">
            {nav.links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`text-[13px] transition-colors duration-200 hover:text-ink ${
                    pathname === l.href ? "text-ink" : "text-text-3"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={nav.offer.href}
                className={`text-[13px] transition-colors duration-200 hover:text-accent ${
                  pathname === nav.offer.href ? "text-accent" : "text-text-3"
                }`}
              >
                {nav.offer.label}
              </Link>
            </li>
          </ul>

          <div className="hidden md:block">
            <Link
              href={nav.cta.href}
              className="inline-block bg-ink px-5 py-2.5 text-[13px] font-semibold text-inverse transition-colors duration-200 hover:bg-accent"
            >
              {nav.cta.label}
            </Link>
          </div>

          <button
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={`h-px w-5 bg-ink transition-transform duration-300 ${
                open ? "translate-y-[3px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-5 bg-ink transition-transform duration-300 ${
                open ? "-translate-y-[3px] -rotate-45" : ""
              }`}
            />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-end bg-ink px-5 pb-12 pt-24"
            initial={reduced ? { opacity: 0 } : { y: "-100%" }}
            animate={reduced ? { opacity: 1 } : { y: 0 }}
            exit={reduced ? { opacity: 0 } : { y: "-100%" }}
            transition={{ duration: 0.5, ease: ease.inOut }}
          >
            <ul className="flex flex-col gap-2">
              {[...nav.links, nav.offer].map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={reduced ? {} : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.25 + i * 0.06,
                    duration: 0.5,
                    ease: ease.out,
                  }}
                >
                  <Link
                    href={l.href}
                    className="block py-2 text-4xl font-extrabold tracking-display text-inverse"
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <motion.div
              initial={reduced ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.4 }}
              className="mt-10 border-t border-hairline-inv pt-6"
            >
              <Link
                href={nav.cta.href}
                className="inline-block bg-inverse px-6 py-3.5 text-sm font-semibold text-ink"
              >
                {nav.cta.label}
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
