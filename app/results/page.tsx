import type { Metadata } from "next";
import { results } from "@/config/copy";
import CaseStudyExplorer from "@/components/CaseStudyExplorer";
import MagneticButton from "@/components/MagneticButton";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Results",
  description:
    "Case studies from Irish estate agencies, trades and service businesses — the numbers our work produced.",
};

export default function ResultsPage() {
  return (
    <main className="pt-16">
      <section className="border-b border-hairline bg-bg py-20 md:py-28">
        <div className="mx-auto max-w-container px-5 md:px-10">
          <h1 className="max-w-3xl text-5xl font-extrabold leading-[0.95] tracking-display md:text-7xl">
            {results.hero.title}
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-text-2">
            {results.hero.sub}
          </p>
        </div>
      </section>

      <section className="bg-bg py-16 md:py-20">
        <div className="mx-auto max-w-container px-5 md:px-10">
          <CaseStudyExplorer />
        </div>
      </section>

      <section className="border-t border-hairline bg-bg-alt py-24">
        <div className="mx-auto max-w-container px-5 md:px-10">
          <Reveal>
            <h2 className="text-4xl font-extrabold tracking-display md:text-5xl">
              Your numbers next.
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
