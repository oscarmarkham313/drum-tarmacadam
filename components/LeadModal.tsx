"use client";

/**
 * Lead-capture modal — competitor ad breakdown offer.
 *
 * Trigger: 4 seconds after landing, all devices.
 * Suppressed for 30 days after dismissal or submission (localStorage),
 * on /thank-you, and for visitors arriving from email (utm_medium=email,
 * remembered for the session).
 *
 * Accessibility: role="dialog", aria-modal, labelled by the heading,
 * focus trapped while open, focus restored on close, Escape / backdrop /
 * X all close it. Entrance animation is CSS-only and disabled globally
 * under prefers-reduced-motion.
 */
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { leadModal, site } from "@/config/copy";

const SUPPRESS_KEY = "dgd-lead-suppressed-until";
const EMAIL_VISITOR_KEY = "dgd-lead-email-visitor";
const SUPPRESS_DAYS = 30;
const SHOW_DELAY_MS = 4_000;

function suppressed(): boolean {
  try {
    const until = Number(localStorage.getItem(SUPPRESS_KEY) ?? 0);
    if (until > Date.now()) return true;
    if (sessionStorage.getItem(EMAIL_VISITOR_KEY)) return true;
  } catch {
    /* storage unavailable — never show rather than nag */
    return true;
  }
  return false;
}

function suppressFor30Days() {
  try {
    localStorage.setItem(
      SUPPRESS_KEY,
      String(Date.now() + SUPPRESS_DAYS * 24 * 60 * 60 * 1000),
    );
  } catch {
    /* ignore */
  }
}

type Errors = Partial<Record<"business" | "trade" | "county" | "email", string>>;

export default function LeadModal() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const firedRef = useRef(false);

  /* ————— trigger logic ————— */
  useEffect(() => {
    if (pathname.startsWith("/thank-you")) return;

    // owner/test override: ?leadmodal=1 opens immediately AND clears any
    // stored suppression, so normal visits behave fresh again afterwards
    try {
      if (new URLSearchParams(window.location.search).get("leadmodal") === "1") {
        localStorage.removeItem(SUPPRESS_KEY);
        sessionStorage.removeItem(EMAIL_VISITOR_KEY);
        firedRef.current = true;
        setOpen(true);
        return;
      }
    } catch {
      /* ignore */
    }

    // arriving from an email link — remember for the whole session
    try {
      const params = new URLSearchParams(window.location.search);
      if ((params.get("utm_medium") ?? "").toLowerCase() === "email") {
        sessionStorage.setItem(EMAIL_VISITOR_KEY, "1");
      }
    } catch {
      /* ignore */
    }

    if (suppressed()) return;

    // all devices: show 4 seconds after landing
    const t = window.setTimeout(() => {
      if (!firedRef.current && !suppressed()) {
        firedRef.current = true;
        setOpen(true);
      }
    }, SHOW_DELAY_MS);

    return () => window.clearTimeout(t);
  }, [pathname]);

  /* ————— open/close plumbing ————— */
  const close = useCallback(() => {
    suppressFor30Days();
    setOpen(false);
    previousFocus.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    previousFocus.current = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    document.documentElement.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      // focus trap
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === panelRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, close]);

  /* ————— validation + submit ————— */
  const validate = (data: FormData): Errors => {
    const next: Errors = {};
    if (!String(data.get("business") ?? "").trim())
      next.business = leadModal.errors.business;
    if (!String(data.get("trade") ?? "")) next.trade = leadModal.errors.trade;
    if (!String(data.get("county") ?? "")) next.county = leadModal.errors.county;
    const email = String(data.get("email") ?? "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = leadModal.errors.email;
    return next;
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(false);
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("_gotcha")) return; // honeypot
    const nextErrors = validate(data);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSending(true);
    data.append("form_type", "competitor-ad-breakdown");
    data.append("_subject", "Competitor ad breakdown request");
    try {
      const res = await fetch(leadModal.endpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(String(res.status));
      setDone(true);
      suppressFor30Days();
      // tracking — no-ops until real IDs are in .env
      const w = window as unknown as {
        fbq?: (...args: unknown[]) => void;
        gtag?: (...args: unknown[]) => void;
      };
      if (typeof w.fbq === "function") w.fbq("track", "Lead");
      if (typeof w.gtag === "function")
        w.gtag("event", "generate_lead", {
          event_category: "lead_modal",
          event_label: "competitor-ad-breakdown",
        });
    } catch {
      setSubmitError(true);
    } finally {
      setSending(false);
    }
  }

  if (!open) return null;

  const fieldBase =
    "w-full border-b bg-transparent py-2.5 text-[15px] outline-none transition-colors duration-200 focus:border-ink md:py-3";
  const fieldBorder = (bad: boolean) =>
    bad ? "border-b-2 border-ink" : "border-hairline-dk";

  return (
    <div
      className="modal-fade fixed inset-0 z-[60] flex items-end justify-center bg-ink/55 md:items-center md:p-5"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-modal-heading"
        tabIndex={-1}
        className="modal-pop relative max-h-[92svh] w-full overflow-y-auto border-t bg-bg p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] outline-none md:max-h-[90vh] md:max-w-[480px] md:border md:p-10"
        style={{ borderColor: "rgba(0,0,0,0.12)" }}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={close}
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center text-2xl leading-none text-ink transition-colors duration-200 hover:bg-ink hover:text-inverse"
        >
          ×
        </button>

        {done ? (
          <div>
            <h2
              id="lead-modal-heading"
              className="text-[22px] font-extrabold leading-[1.05] tracking-display md:text-3xl md:leading-[1.02]"
            >
              {leadModal.confirmHeading.replace(".", "")}
              <span className="text-accent">.</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text-2 md:mt-4 md:text-[15px]">
              {leadModal.confirmBody}
            </p>
          </div>
        ) : (
          <>
            <h2
              id="lead-modal-heading"
              className="pr-10 text-[22px] font-extrabold leading-[1.05] tracking-display md:text-3xl md:leading-[1.02]"
            >
              {leadModal.heading}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text-2 md:mt-4 md:text-[15px]">
              {leadModal.body}
            </p>

            <form onSubmit={onSubmit} noValidate className="mt-5 flex flex-col gap-4 md:mt-7 md:gap-5">
              <input
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              <div>
                <label
                  htmlFor="lm-business"
                  className="eyebrow block !text-[10px]"
                >
                  {leadModal.fields.business}
                </label>
                <input
                  id="lm-business"
                  name="business"
                  type="text"
                  className={`${fieldBase} ${fieldBorder(!!errors.business)}`}
                  aria-invalid={!!errors.business}
                />
                {errors.business && (
                  <p className="mt-1.5 text-xs font-semibold text-ink" role="alert">
                    {errors.business}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 md:gap-5">
                <div>
                  <label htmlFor="lm-trade" className="eyebrow block !text-[10px]">
                    {leadModal.fields.trade}
                  </label>
                  <select
                    id="lm-trade"
                    name="trade"
                    defaultValue=""
                    className={`${fieldBase} ${fieldBorder(!!errors.trade)}`}
                    aria-invalid={!!errors.trade}
                  >
                    <option value="" disabled>
                      Select…
                    </option>
                    {leadModal.trades.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  {errors.trade && (
                    <p className="mt-1.5 text-xs font-semibold text-ink" role="alert">
                      {errors.trade}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="lm-county" className="eyebrow block !text-[10px]">
                    {leadModal.fields.county}
                  </label>
                  <select
                    id="lm-county"
                    name="county"
                    defaultValue=""
                    className={`${fieldBase} ${fieldBorder(!!errors.county)}`}
                    aria-invalid={!!errors.county}
                  >
                    <option value="" disabled>
                      Select…
                    </option>
                    {leadModal.counties.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {errors.county && (
                    <p className="mt-1.5 text-xs font-semibold text-ink" role="alert">
                      {errors.county}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="lm-email" className="eyebrow block !text-[10px]">
                  {leadModal.fields.email}
                </label>
                <input
                  id="lm-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  className={`${fieldBase} ${fieldBorder(!!errors.email)}`}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs font-semibold text-ink" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={sending}
                className="mt-1 w-full bg-ink px-8 py-3.5 text-sm font-semibold text-inverse transition-colors duration-300 hover:bg-accent disabled:opacity-50 md:py-4"
              >
                {sending ? leadModal.sending : leadModal.submit}
              </button>

              {submitError && (
                <p className="text-xs font-semibold text-ink" role="alert">
                  {leadModal.errors.submit}{" "}
                  <a href={`mailto:${site.email}`} className="underline">
                    {site.email}
                  </a>
                </p>
              )}

              <p className="text-[11px] leading-relaxed text-text-3 md:text-xs">
                {leadModal.smallPrint}
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
