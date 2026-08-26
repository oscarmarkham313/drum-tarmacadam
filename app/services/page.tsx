import type { Metadata } from "next";
import { services } from "@/config/copy";
import Reveal from "@/components/Reveal";
import MagneticButton from "@/components/MagneticButton";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Web design, Google Ads, Meta ads, SEO and social — done properly for Irish businesses.",
};

export default function ServicesPage() {
  return (
    <main className="pt-16">
      <section className="border-b border-hairline bg-bg py-20 md:py-28">
        <div className="mx-auto max-w-container px-5 md:px-10">
          <h1 className="max-w-3xl text-5xl font-extrabold leading-[0.95] tracking-display md:text-7xl">
            {services.hero.title}
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-text-2">
            {services.hero.sub}
          </p>
        </div>
      </section>

      {services.items.map((s, i) => (
        <section
          key={s.id}
          id={s.id}
          className={`scroll-mt-16 border-b border-hairline py-20 md:py-28 ${
            i % 2 === 1 ? "bg-bg-alt" : "bg-bg"
          }`}
        >
          <div className="mx-auto grid max-w-container gap-10 px-5 md:grid-cols-2 md:gap-20 md:px-10">
            <Reveal>
              <span className="tnum text-sm text-text-4">{s.number}</span>
              <h2 className="mt-3 text-4xl font-extrabold tracking-display md:text-5xl">
                {s.name}
              </h2>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-text-2">
                {s.outcome}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <span className="eyebrow">What&apos;s included</span>
              <ul className="mt-5 border-t border-hairline">
                {s.deliverables.map((d) => (
                  <li
                    key={d}
                    className="flex items-baseline gap-4 border-b border-hairline py-3.5 text-sm text-text-2"
                  >
                    <span className="text-accent" aria-hidden="true">
                      —
                    </span>
                    {d}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>
      ))}

      <section className="border-t border-hairline bg-bg-alt py-24">
        <div className="mx-auto max-w-container px-5 md:px-10">
          <Reveal>
            <h2 className="text-4xl font-extrabold tracking-display md:text-5xl">
              Not sure where to start?
            </h2>
            <div className="mt-8">
              <MagneticButton href="/contact">
                Book a free strategy call
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
