import type { Metadata } from "next";
import { about } from "@/config/copy";
import Reveal from "@/components/Reveal";
import MagneticButton from "@/components/MagneticButton";

export const metadata: Metadata = {
  title: "About",
  description:
    "Dublin Growth Digital — a small Dublin agency reporting in enquiries and booked jobs, never in impressions.",
};

export default function AboutPage() {
  return (
    <main className="pt-16">
      <section className="border-b border-hairline bg-bg py-20 md:py-28">
        <div className="mx-auto max-w-container px-5 md:px-10">
          <h1 className="max-w-3xl text-5xl font-extrabold leading-[0.95] tracking-display md:text-7xl">
            {about.hero.title}
          </h1>
          <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-text-2">
            {about.hero.sub}
          </p>
        </div>
      </section>

      <section className="bg-bg py-20 md:py-28">
        <div className="mx-auto grid max-w-container gap-14 px-5 md:grid-cols-2 md:gap-20 md:px-10">
          <Reveal>
            <div className="flex flex-col gap-6">
              {about.stance.map((p) => (
                <p key={p.slice(0, 24)} className="text-lg leading-relaxed text-text-2">
                  {p}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <span className="eyebrow">{about.principles.eyebrow}</span>
            <ol className="mt-5 border-t border-hairline">
              {about.principles.items.map((p) => (
                <li
                  key={p.n}
                  className="grid grid-cols-[48px_1fr] items-baseline gap-4 border-b border-hairline py-5"
                >
                  <span className="tnum text-sm text-text-4">{p.n}</span>
                  <p className="text-[15px] font-medium leading-relaxed">{p.text}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-hairline bg-bg-alt py-24">
        <div className="mx-auto max-w-container px-5 md:px-10">
          <Reveal>
            <h2 className="text-4xl font-extrabold tracking-display md:text-5xl">
              {about.closing.heading}
            </h2>
            <div className="mt-8">
              <MagneticButton href={about.closing.cta.href}>
                {about.closing.cta.label}
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
