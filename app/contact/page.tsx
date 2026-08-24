import type { Metadata } from "next";
import { contact, site } from "@/config/copy";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to Dublin Growth Digital. We reply within one working day — usually faster.",
};

const directHref = {
  whatsapp: site.whatsapp,
  email: `mailto:${site.email}`,
  phone: `tel:${site.phone}`,
} as const;

export default function ContactPage() {
  return (
    <main className="pt-16">
      <section className="border-b border-hairline bg-bg py-20 md:py-28">
        <div className="mx-auto max-w-container px-5 md:px-10">
          <h1 className="max-w-3xl text-5xl font-extrabold leading-[0.95] tracking-display md:text-7xl">
            {contact.hero.title}
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-text-2">
            {contact.hero.sub}
          </p>
        </div>
      </section>

      <section className="bg-bg py-20 md:py-28">
        <div className="mx-auto grid max-w-container gap-16 px-5 md:grid-cols-[3fr_2fr] md:gap-24 md:px-10">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={0.1}>
            <span className="eyebrow">{contact.direct.heading}</span>
            <ul className="mt-5 border-t border-hairline">
              {contact.direct.lines.map((l) => (
                <li key={l.label} className="border-b border-hairline">
                  <a
                    href={directHref[l.hrefKey]}
                    target={l.hrefKey === "whatsapp" ? "_blank" : undefined}
                    rel={l.hrefKey === "whatsapp" ? "noopener noreferrer" : undefined}
                    className="group flex items-baseline justify-between gap-6 py-5"
                  >
                    <span className="text-sm text-text-3">{l.label}</span>
                    <span className="text-[15px] font-semibold transition-colors duration-200 group-hover:text-accent">
                      {l.value}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
