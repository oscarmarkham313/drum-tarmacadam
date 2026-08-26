"use client";

/**
 * Results explorer — filter tabs by niche, layout-animated list.
 * Data comes entirely from config/case-studies.ts.
 */
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { caseStudies } from "@/config/case-studies";
import { results } from "@/config/copy";
import { ease } from "@/lib/tokens";

export default function CaseStudyExplorer() {
  const [tab, setTab] = useState("all");
  const reduced = useReducedMotion();

  const visible =
    tab === "all" ? caseStudies : caseStudies.filter((c) => c.niche === tab);

  const count = (id: string) =>
    id === "all"
      ? caseStudies.length
      : caseStudies.filter((c) => c.niche === id).length;

  return (
    <div>
      {/* tabs */}
      <div
        className="flex flex-wrap gap-x-8 gap-y-3 border-b border-hairline"
        role="tablist"
        aria-label="Filter case studies by niche"
      >
        {results.tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={`relative pb-4 text-sm font-semibold transition-colors duration-200 ${
                active ? "text-ink" : "text-text-3 hover:text-ink"
              }`}
            >
              {t.label}{" "}
              <span className="tnum text-xs text-text-4">{count(t.id)}</span>
              {active && (
                <motion.span
                  layoutId={reduced ? undefined : "tab-rule"}
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-accent"
                  transition={{ duration: 0.4, ease: ease.inOut }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* niche intro — DGD's approach for the selected category */}
      {tab !== "all" && results.nicheIntros[tab as keyof typeof results.nicheIntros] && (
        <div key={`intro-${tab}`} className={reduced ? "mt-10" : "t-slide mt-10"}>
          <div className="border border-hairline-md bg-bg-alt p-6 md:p-8">
            <h2 className="text-xl font-extrabold tracking-tight md:text-2xl">
              {results.nicheIntros[tab as keyof typeof results.nicheIntros].heading}
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {results.nicheIntros[tab as keyof typeof results.nicheIntros].points.map(
                (p) => (
                  <li
                    key={p.slice(0, 24)}
                    className="flex items-baseline gap-3 text-sm leading-relaxed text-text-2"
                  >
                    <span className="text-accent" aria-hidden="true">
                      —
                    </span>
                    {p}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      )}

      {/* list */}
      <motion.div layout={!reduced} className="mt-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((c) => (
            <motion.article
              key={c.client}
              layout={!reduced}
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: ease.out }}
              className="grid gap-6 border-b border-hairline py-10 md:grid-cols-[1fr_2fr] md:gap-14"
            >
              <div>
                <span className="eyebrow">{c.sector}</span>
                <h2 className="mt-2 text-2xl font-extrabold tracking-display md:text-3xl">
                  {c.client}
                </h2>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-text-3">
                  {c.note}
                </p>
              </div>
              <div className="flex flex-wrap items-start gap-x-16 gap-y-8">
                {c.stats.map((s) => (
                  <div key={s.label}>
                    <div className="tnum text-5xl font-extrabold tracking-display md:text-7xl">
                      {s.value}
                    </div>
                    <p className="mt-2 text-[13px] text-text-3">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
