import type { Metadata } from "next";
import { site } from "@/config/copy";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms for the Dublin Growth Digital Meta Ads package.",
  robots: { index: false },
};

/* Legal copy carried over verbatim from the v1 site (July 2026). */
const sections: { heading: string; body: (string | string[])[] }[] = [
  {
    heading: "1. The Package",
    body: [
      'Dublin Growth Digital ("we", "us", "our") provides a Meta Ads management service ("the Package") to Irish businesses ("you", "the client").',
      "The Package includes:",
      [
        "Campaign strategy, audience research, ad copy, and creative production",
        "Full campaign setup within your existing or new Meta Ads account",
        "30 days of active management and optimisation",
        "Weekly performance reports delivered by email",
        "Pixel and conversion tracking setup",
        "Direct WhatsApp access to your campaign manager",
      ],
      "The Package does not include the cost of your Meta ad spend, which is paid directly to Meta from your own account.",
    ],
  },
  {
    heading: "2. Payment",
    body: [
      "The total fee for the Package is €1,500 + VAT, paid in two instalments:",
      [
        "€750 deposit — due at checkout, before work begins",
        "€750 balance — due at the end of the 30-day campaign period, subject to your satisfaction (see Section 3)",
      ],
      "Following the initial 30-day period, ongoing management is available at €400 + VAT per month, billed monthly with no minimum term. Either party may cancel the ongoing arrangement with 7 days' notice.",
      "All payments are processed securely. Invoices are issued on receipt of payment.",
    ],
  },
  {
    heading: "3. The Guarantee",
    body: [
      "We are confident in the results our campaigns deliver. Our guarantee works as follows:",
      [
        "After 30 days, if you are satisfied with the results of the campaign, the €750 balance becomes due and payable.",
        "If you are not satisfied with the results, we will continue working on your campaign for a further 30 days at no additional charge before the balance is due.",
        "If after the extended period you remain unsatisfied, we will discuss resolution in good faith — which may include a partial refund of the deposit at our discretion.",
      ],
      '"Results" means a measurable increase in leads, sales, or bookings attributable to the Meta Ads campaign, as evidenced by campaign data shared with you throughout the period.',
      "The guarantee does not apply if you have withheld access, failed to respond to our requests, or materially changed your business offering during the campaign period.",
    ],
  },
  {
    heading: "4. Deliverables & Timeline",
    body: [
      "We will contact you within 24 hours of receiving your deposit to arrange onboarding. Your campaign will be live within 7 business days of receiving all required access and information.",
      "You will receive a weekly performance report by email every Monday covering the previous week's results.",
    ],
  },
  {
    heading: "5. Your Obligations",
    body: [
      "To deliver the best possible results, you agree to:",
      [
        "Grant us Admin access to your Meta Business Manager and/or Ads account",
        "Provide access to your website or landing page for pixel installation",
        "Respond to our messages within 2 business days",
        "Maintain sufficient ad spend in your Meta account as agreed during onboarding",
        "Provide any product images, videos, or brand assets we request within 3 business days",
      ],
      "Delays caused by failure to provide access or assets will not count against our delivery timeline or the 30-day campaign period.",
    ],
  },
  {
    heading: "6. Cancellation & Refunds",
    body: [
      "The €750 deposit is non-refundable once work has commenced (i.e. once we have begun strategy or campaign setup). If you cancel before any work has begun, a full refund will be issued.",
      "Ongoing monthly management may be cancelled at any time with 7 days' written notice to dublingrowthdigital@gmail.com. You will not be billed for any period beyond the notice period.",
    ],
  },
  {
    heading: "7. Limitation of Liability",
    body: [
      "We cannot guarantee specific outcomes in terms of revenue, profit, or business growth, as results depend on factors outside our control including market conditions, your product or service, and your pricing.",
      "Our total liability to you under these terms shall not exceed the total fees paid by you in the 3 months preceding any claim.",
      "We are not liable for any indirect, consequential, or incidental losses arising from the use of our services.",
    ],
  },
  {
    heading: "8. Governing Law",
    body: [
      "These terms are governed by the laws of the Republic of Ireland. Any disputes shall be subject to the exclusive jurisdiction of the Irish courts.",
      "Last updated: July 2026.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="pt-16">
      <section className="border-b border-hairline bg-bg py-20 md:py-24">
        <div className="mx-auto max-w-container px-5 md:px-10">
          <h1 className="text-5xl font-extrabold leading-[0.95] tracking-display md:text-6xl">
            Terms &amp; Conditions<span className="text-accent">.</span>
          </h1>
          <p className="mt-5 max-w-lg text-[15px] text-text-2">
            These terms apply to the Meta Ads package offered by Dublin Growth
            Digital. Please read them before completing your purchase.
          </p>
        </div>
      </section>

      <section className="bg-bg py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-5 md:px-10">
          {sections.map((s) => (
            <div key={s.heading} className="border-b border-hairline py-10 first:pt-0">
              <h2 className="text-xl font-extrabold tracking-tight">{s.heading}</h2>
              <div className="mt-4 flex flex-col gap-4">
                {s.body.map((b, i) =>
                  Array.isArray(b) ? (
                    <ul key={i} className="flex flex-col gap-2 pl-1">
                      {b.map((li) => (
                        <li key={li} className="flex items-baseline gap-3 text-sm leading-relaxed text-text-2">
                          <span className="text-accent" aria-hidden="true">—</span>
                          {li}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p key={i} className="text-sm leading-relaxed text-text-2">
                      {b}
                    </p>
                  ),
                )}
              </div>
            </div>
          ))}

          <div className="py-10">
            <h2 className="text-xl font-extrabold tracking-tight">9. Contact</h2>
            <p className="mt-4 text-sm leading-relaxed text-text-2">
              For any questions about these terms: Dublin Growth Digital —{" "}
              <a href={`mailto:${site.email}`} className="font-semibold underline underline-offset-2">
                {site.email}
              </a>{" "}
              · {site.phoneDisplay}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
