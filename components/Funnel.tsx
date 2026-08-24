"use client";

/**
 * How-it-works centrepiece — a stepped conversion chart built for
 * cold traffic: four solid bars descending left to right, each with
 * its number counting up and a plain-English label. The drop-off
 * story is the shape itself.
 *
 * Scroll-driven: a 220vh section with a sticky stage; bars rise and
 * counters tick in sequence as you scroll. Bar heights are log-scaled
 * so the final stage stays visible against the first.
 * Reduced motion: everything lit and full, statically.
 */
import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import StatNumber from "@/components/StatNumber";
import Reveal from "@/components/Reveal";
import { home } from "@/config/copy";
import { ease } from "@/lib/tokens";

export default function Funnel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const [progress, setProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", setProgress);

  const { funnel } = home;
  const maxLog = Math.log10(
    Math.max(...funnel.stages.map((s) => s.value)),
  );

  /* stages light in sequence as you scroll through the section */
  const activeStage = reduced
    ? funnel.stages.length
    : progress < 0.12
      ? 0
      : Math.min(
          funnel.stages.length,
          1 + Math.floor((progress - 0.12) / 0.16),
        );

  return (
    <section ref={sectionRef} className="relative h-[220vh] bg-bg-alt">
      <div className="sticky top-0 flex min-h-screen flex-col justify-center overflow-hidden py-24">
        <div className="mx-auto w-full max-w-container px-5 md:px-10">
          <Reveal>
            <span className="eyebrow">{funnel.eyebrow}</span>
            <h2 className="mt-4 max-w-xl text-4xl font-extrabold leading-[0.98] tracking-display md:text-6xl">
              {funnel.heading}
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-text-2">
              {funnel.sub}
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 border-b border-hairline-md md:grid-cols-4 md:gap-x-8">
            {funnel.stages.map((s, i) => {
              const lit = i < activeStage;
              const last = i === funnel.stages.length - 1;
              const barPct = Math.round(
                (Math.log10(s.value) / maxLog) * 100,
              );
              return (
                <div key={s.tag} className="flex flex-col">
                  {/* number */}
                  <div
                    className={`tnum text-3xl font-extrabold tracking-display transition-colors duration-500 md:text-5xl ${
                      lit ? (last ? "text-accent" : "text-ink") : "text-text-4"
                    }`}
                  >
                    {lit ? <StatNumber value={s.value} /> : "0"}
                  </div>

                  {/* bar track */}
                  <div className="mt-6 flex h-[clamp(140px,26vh,300px)] items-end">
                    <motion.div
                      className={`w-full ${last ? "bg-accent" : "bg-ink"}`}
                      style={{
                        height: `${barPct}%`,
                        transformOrigin: "bottom",
                      }}
                      animate={{
                        scaleY: lit ? 1 : 0.04,
                        opacity: lit ? 1 : 0.25,
                      }}
                      transition={{ duration: 0.9, ease: ease.out }}
                    />
                  </div>

                  {/* labels */}
                  <div className="border-t border-hairline-dk pt-4">
                    <p
                      className={`text-[14px] font-semibold leading-snug transition-colors duration-500 ${
                        lit ? "text-ink" : "text-text-3"
                      }`}
                    >
                      {s.label}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-label text-text-4">
                      {s.tag}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-6 text-xs text-text-4">{funnel.caption}</p>
        </div>
      </div>
    </section>
  );
}
