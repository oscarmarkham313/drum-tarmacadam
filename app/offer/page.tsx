import type { Metadata } from "next";
import Link from "next/link";
import { offer } from "@/config/copy";
import MagneticButton from "@/components/MagneticButton";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "The Offer — Website + Meta Ads, €1,500 fixed",
  description:
    "A custom website and a managed Meta ads campaign. €750 today, €750 only when you're happy. Live in 14 days.",
};

export default function OfferPage() {
  return (
    <main className="pt-16">
      <section className="border-b border-hairline bg-bg py-20 md:py-28">
        <div className="mx-auto max-w-container px-5 md:px-10">
          <span className="eyebrow">{offer.badge}</span>
          <h1 className="mt-5 max-w-4xl text-5xl font-extrabold leading-[0.95] tracking-display md:text-7xl">
            {offer.heading[0]}
            <br />
            {offer.heading[1].replace(".", "")}
            <span className="text-accent">.</span>
          </h1>
          <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-text-2">
            {offer.sub}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <MagneticButton href={offer.cta.href} external>
              {offer.cta.label}
            </MagneticButton>
            <Link
              href={offer.secondary.href}
              className="text-sm font-semibold text-text-2 underline decoration-hairline-dk underline-offset-4 transition-colors hover:text-ink"
            >
              {offer.secondary.label}
            </Link>
          </div>
        </div>
      </section>

      {/* payment structure */}
      <section className="bg-bg py-20 md:py-24">
        <div className="mx-auto grid max-w-container gap-px border border-hairline-md bg-black/10 px-0 md:grid-cols-2">
          {offer.payment.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08} className="bg-bg p-8 md:p-12">
              <span className="eyebrow">{p.title}</span>
              <div className="tnum mt-5 text-6xl font-extrabold tracking-display">
                {p.price}
              </div>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-text-2">
                {p.detail}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* includes */}
      <section className="border-t border-hairline bg-bg-alt py-20 md:py-28">
        <div className="mx-auto max-w-container px-5 md:px-10">
          <Reveal>
            <h2 className="text-4xl font-extrabold tracking-display md:text-6xl">
              {offer.includes.heading}
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-14 md:grid-cols-2 md:gap-20">
            {offer.includes.groups.map((g, gi) => (
              <Reveal key={g.name} delay={gi * 0.1}>
                <span className="eyebrow">{g.name}</span>
                <ul className="mt-5 border-t border-hairline">
                  {g.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-baseline gap-4 border-b border-hairline py-3.5 text-sm text-text-2"
                    >
                      <span className="text-accent" aria-hidden="true">
                        —
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bg py-24">
        <div className="mx-auto max-w-container px-5 md:px-10">
          <Reveal>
            <h2 className="text-4xl font-extrabold tracking-display md:text-5xl">
              Live in 14 days<span className="text-accent">.</span>
            </h2>
            <div className="mt-8">
              <MagneticButton href={offer.cta.href} external>
                {offer.cta.label}
              </MagneticButton>
            </div>
            <p className="mt-6 text-xs text-text-4">
              {offer.terms.pre}{" "}
              <Link href={offer.terms.href} className="underline underline-offset-2 hover:text-ink">
                {offer.terms.link}
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
