"use client";

/**
 * The centrepiece — a scroll-driven SVG funnel.
 *
 * A 240vh section with a sticky stage. As you scroll:
 *   1. the funnel outlines draw themselves (pathLength ← scroll progress)
 *   2. dots flow left → right, converging as the funnel narrows; most
 *      fade at a stage boundary (drop-off), the ones that make it through
 *      turn accent green (conversions)
 *   3. stages light up in sequence; counters tick on entry
 *
 * Dot params are a hand-tuned literal (deterministic — SSR-safe).
 * Reduced motion: fully drawn, static dots, all stages lit.
 */
import { useMemo, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import StatNumber from "@/components/StatNumber";
import Reveal from "@/components/Reveal";
import { home } from "@/config/copy";

const W = 1200;
const H = 480;

/* funnel mouth 60..420 narrowing to 190..290 */
const smooth = (f: number) => f * f * (3 - 2 * f);
const topY = (x: number) => 60 + 130 * smooth(x / W);
const botY = (x: number) => 420 - 130 * smooth(x / W);

/* { u: vertical lane 0..1, v: speed px/ms-ish, p: phase 0..1, drop: exit point 0..1 } */
const DOTS = [
  { u: 0.14, v: 0.052, p: 0.05, drop: 0.27 },
  { u: 0.82, v: 0.06, p: 0.55, drop: 0.24 },
  { u: 0.32, v: 0.055, p: 0.3, drop: 0.38 },
  { u: 0.68, v: 0.065, p: 0.8, drop: 0.41 },
  { u: 0.5, v: 0.058, p: 0.12, drop: 0.46 },
  { u: 0.22, v: 0.063, p: 0.68, drop: 0.52 },
  { u: 0.76, v: 0.05, p: 0.42, drop: 0.57 },
  { u: 0.4, v: 0.06, p: 0.92, drop: 0.63 },
  { u: 0.6, v: 0.054, p: 0.2, drop: 0.69 },
  { u: 0.28, v: 0.062, p: 0.48, drop: 0.76 },
  { u: 0.72, v: 0.056, p: 0.73, drop: 0.83 },
  { u: 0.46, v: 0.06, p: 0.36, drop: 0.9 },
  { u: 0.55, v: 0.052, p: 0.62, drop: 1.01 },
  { u: 0.35, v: 0.058, p: 0.85, drop: 1.01 },
  { u: 0.65, v: 0.064, p: 0.15, drop: 1.01 },
  { u: 0.5, v: 0.055, p: 0.95, drop: 1.01 },
];

const STAGE_X = [0, 300, 600, 900, 1200];

export default function Funnel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(stageRef, { margin: "10% 0px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const draw = useTransform(scrollYProgress, [0.02, 0.25], [0, 1]);
  const [progress, setProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setProgress(v));

  /* time-based dot flow, speed modulated by scroll depth */
  const tRef = useRef(DOTS.map((d) => d.p));
  const lastRef = useRef<number | null>(null);
  const [, force] = useState(0);

  useAnimationFrame((now) => {
    if (reduced || !inView) return;
    const last = lastRef.current ?? now;
    lastRef.current = now;
    const dt = Math.min(64, now - last) / 1000;
    const speedFactor = 0.45 + progress * 1.25;
    const ts = tRef.current;
    for (let i = 0; i < DOTS.length; i++) {
      ts[i] = (ts[i] + DOTS[i].v * speedFactor * dt) % 1.06;
    }
    force((n) => n + 1);
  });

  const outlineTop = useMemo(() => {
    const pts = Array.from({ length: 41 }, (_, i) => {
      const x = (i / 40) * W;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${topY(x).toFixed(1)}`;
    });
    return pts.join(" ");
  }, []);
  const outlineBot = useMemo(() => {
    const pts = Array.from({ length: 41 }, (_, i) => {
      const x = (i / 40) * W;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${botY(x).toFixed(1)}`;
    });
    return pts.join(" ");
  }, []);

  const { funnel } = home;
  /* stage i lights when scroll passes its threshold */
  const activeStage = reduced
    ? 4
    : progress < 0.28
      ? 0
      : Math.min(4, 1 + Math.floor((progress - 0.28) / 0.16));

  return (
    <section ref={sectionRef} className="relative h-[240vh] bg-bg-alt">
      <div
        ref={stageRef}
        className="sticky top-0 flex min-h-screen flex-col justify-center overflow-hidden py-24"
      >
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

          <div className="mt-14">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full"
              role="img"
              aria-label="Funnel: traffic narrows through qualified clicks and enquiries into booked jobs"
            >
              {/* stage separators */}
              {STAGE_X.slice(1, 4).map((x) => (
                <line
                  key={x}
                  x1={x}
                  y1={topY(x)}
                  x2={x}
                  y2={botY(x)}
                  stroke="rgba(0,0,0,0.12)"
                  strokeWidth="1"
                  strokeDasharray="1 5"
                />
              ))}

              {/* funnel outlines — drawn by scroll */}
              <motion.path
                d={outlineTop}
                fill="none"
                stroke="rgba(0,0,0,0.35)"
                strokeWidth="1.5"
                style={{ pathLength: reduced ? 1 : draw }}
              />
              <motion.path
                d={outlineBot}
                fill="none"
                stroke="rgba(0,0,0,0.35)"
                strokeWidth="1.5"
                style={{ pathLength: reduced ? 1 : draw }}
              />

              {/* mouth + exit ticks */}
              <line x1="1" y1={topY(0)} x2="1" y2={botY(0)} stroke="rgba(0,0,0,0.35)" strokeWidth="1.5" />
              <line x1={W - 1} y1={topY(W)} x2={W - 1} y2={botY(W)} stroke="#16a34a" strokeWidth="2" />

              {/* flowing dots */}
              {DOTS.map((d, i) => {
                const t = reduced ? (d.p * 0.9 + 0.05) : tRef.current[i];
                const gone = t > d.drop;
                const x = Math.min(1, t) * W;
                const y = topY(x) + (botY(x) - topY(x)) * d.u * (1 - smooth(Math.min(1, t)) * 0.4) + (botY(x) - topY(x)) * (smooth(Math.min(1, t)) * 0.2);
                const converting = d.drop > 1 && t > 0.75;
                if (t > 1.04) return null;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={converting ? 5 : 4}
                    fill={converting ? "#16a34a" : "#888888"}
                    opacity={gone ? Math.max(0, 1 - (t - d.drop) * 12) : 0.85}
                  />
                );
              })}
            </svg>

            {/* stage labels + counters */}
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-hairline pt-8 md:grid-cols-4">
              {funnel.stages.map((s, i) => {
                const lit = i < activeStage || reduced;
                const last = i === funnel.stages.length - 1;
                return (
                  <div
                    key={s.label}
                    className={`transition-opacity duration-500 ${lit ? "opacity-100" : "opacity-30"}`}
                  >
                    <div
                      className={`text-3xl font-extrabold tracking-display md:text-5xl ${
                        last ? "text-accent" : "text-ink"
                      }`}
                    >
                      <StatNumber value={s.value} />
                    </div>
                    <p className="mt-2 text-[13px] font-semibold">{s.label}</p>
                    <p className="mt-0.5 text-xs text-text-3">{s.detail}</p>
                  </div>
                );
              })}
            </div>
            <p className="mt-6 text-xs text-text-4">{funnel.caption}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
