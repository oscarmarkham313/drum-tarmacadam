"use client";

import { useState } from "react";
import { contact, site } from "@/config/copy";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full border-b border-hairline-md bg-transparent py-3.5 text-[15px] outline-none transition-colors duration-200 placeholder:text-text-4 focus:border-ink";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const f = contact.form;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("_gotcha")) return; // honeypot
    setStatus("sending");
    try {
      const res = await fetch(site.formspree, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="border border-hairline-md p-8">
        <p className="text-lg font-bold">
          {f.success.split(".")[0]}
          <span className="text-accent">.</span>
        </p>
        <p className="mt-2 text-sm text-text-2">
          {f.success.split(".").slice(1).join(".").trim()}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <div className="grid gap-5 md:grid-cols-2">
        <input required name="name" placeholder={f.name} className={field} aria-label={f.name} />
        <input name="business" placeholder={f.business} className={field} aria-label={f.business} />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <input
          required
          type="email"
          name="email"
          placeholder={f.email}
          className={field}
          aria-label={f.email}
        />
        <input name="phone" placeholder={f.phone} className={field} aria-label={f.phone} />
      </div>
      <textarea
        required
        name="message"
        rows={5}
        placeholder={f.message}
        className={`${field} resize-none`}
        aria-label={f.message}
      />
      <div className="mt-2 flex items-center gap-5">
        <button
          type="submit"
          disabled={status === "sending"}
          className="bg-ink px-8 py-4 text-sm font-semibold text-inverse transition-colors duration-300 hover:bg-accent disabled:opacity-50"
        >
          {status === "sending" ? f.sending : f.submit}
        </button>
        {status === "error" && (
          <p className="text-sm text-text-2" role="alert">
            {f.error}{" "}
            <a href={`mailto:${site.email}`} className="font-semibold underline">
              {site.email}
            </a>
          </p>
        )}
      </div>
    </form>
  );
}
