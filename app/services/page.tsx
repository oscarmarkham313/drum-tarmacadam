import type { Metadata } from "next";
import Link from "next/link";
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

      {/* ————— PRICING ————— */}
      <section className="bg-bg py-24 md:py-32">
        <div className="mx-auto max-w-container px-5 md:px-10">
          <Reveal>
            <span className="eyebrow">{services.pricing.eyebrow}</span>
            <h2 className="mt-4 text-4xl font-extrabold tracking-display md:text-6xl">
              {services.pricing.heading}
            </h2>
            <p className="mt-4 max-w-md text-[15px] text-text-2">
              {services.pricing.sub}
            </p>
          </Reveal>

          <div className="mt-14 grid gap-px overflow-hidden border border-hairline-md bg-black/10 md:grid-cols-3">
            {services.pricing.tiers.map((t, i) => (
              <Reveal
                key={t.name}
                delay={i * 0.08}
                className={t.featured ? "bg-ink text-inverse" : "bg-bg"}
              >
                <div className="flex h-full flex-col p-8 md:p-10">
                  <span
                    className={`eyebrow ${t.featured ? "!text-inverse/50" : ""}`}
                  >
                    {t.name}
                  </span>
                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="tnum text-5xl font-extrabold tracking-display">
                      {t.price}
                    </span>
                    <span
                      className={`text-xs ${t.featured ? "text-inverse/50" : "text-text-3"}`}
                    >
                      {t.per}
                    </span>
                  </div>
                  <p
                    className={`mt-4 text-sm leading-relaxed ${
                      t.featured ? "text-inverse/70" : "text-text-2"
                    }`}
                  >
                    {t.line}
                  </p>
                  <div className="mt-8 pt-2">
                    <Link
                      href="/contact"
                      className={`inline-block px-6 py-3 text-[13px] font-semibold transition-colors duration-200 ${
                        t.featured
                          ? "bg-inverse text-ink hover:bg-accent hover:text-inverse"
                          : "bg-ink text-inverse hover:bg-accent"
                      }`}
                    >
                      Start with {t.name}
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-8">
            <p className="text-sm text-text-3">
              {services.pricing.offerNote.pre}{" "}
              <Link
                href={services.pricing.offerNote.href}
                className="font-semibold text-ink underline decoration-hairline-dk underline-offset-4 transition-colors hover:text-accent"
              >
                {services.pricing.offerNote.link}
              </Link>{" "}
              {services.pricing.offerNote.post}
            </p>
          </Reveal>
        </div>
      </section>

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
