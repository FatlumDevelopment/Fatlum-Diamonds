"use client";
import { useState } from "react";
import Link from "next/link";
import { dict, type Locale } from "@/lib/i18n";
import type { RequestDraft } from "@/lib/types";

export function InquiryForm({ l, kind, items = [], onDone }: { l: Locale; kind: "list" | "contact"; items?: RequestDraft[]; onDone?: () => void }) {
  const t = dict(l);
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [ref, setRef] = useState("");
  const [mail, setMail] = useState<"sent" | "skipped" | "failed" | "">("");
  const inp = "w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-gold focus:outline-none";

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const form = e.currentTarget;
    const f = Object.fromEntries(new FormData(form).entries());
    const r = await fetch("/api/request", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...f,
        consent: f.consent === "on",
        locale: l,
        kind,
        items: items.map((item) => item.slug),
      }),
    });
    if (!r.ok) { setState("err"); return; }
    const body = await r.json().catch(() => ({}));
    setRef(String(body.ref || ""));
    setMail(body.email === "sent" || body.email === "failed" ? body.email : "skipped");
    setState("ok");
    onDone?.();
  }

  if (state === "ok") {
    return (
      <p data-testid="success" className="rounded-lg border border-emerald-300 bg-emerald-50 p-6 text-emerald-900">
        {t.request.success} {ref && <span className="mt-2 block font-medium">{t.request.ref}: {ref}</span>}
        <span className="mt-2 block text-sm">{mail === "sent" ? t.request.successMail : t.request.successNoMail}</span>
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-lg border border-gold/40 bg-cream p-6">
      <h2 className="font-serif text-2xl text-navy">{kind === "contact" ? t.contact.formTitle : t.request.formTitle}</h2>
      <input name="name" required minLength={2} maxLength={200} placeholder={t.request.name} aria-label={t.request.name} className={inp} />
      <input name="email" type="email" required maxLength={254} placeholder={t.request.email} aria-label={t.request.email} className={inp} />
      <input name="phone" maxLength={50} placeholder={t.request.phone} aria-label={t.request.phone} className={inp} />
      <input name="company" maxLength={200} placeholder={t.request.company} aria-label={t.request.company} className={inp} />
      <textarea name="message" required={kind === "contact"} minLength={kind === "contact" ? 5 : undefined} rows={4} maxLength={4000} placeholder={kind === "contact" ? t.contact.message : t.request.message} aria-label={kind === "contact" ? t.contact.message : t.request.message} className={inp} />
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <label className="flex gap-2 text-xs text-gray-700">
        <input type="checkbox" name="consent" required className="mt-0.5 accent-[#bf9e50]" />
        <span>{t.request.consent} <Link href={`/${l}/datenschutz`} className="underline">{t.footer.privacy}</Link></span>
      </label>
      <button disabled={state === "sending"} className="w-full rounded bg-navy py-3 font-medium text-white hover:bg-secondary disabled:opacity-60">
        {state === "sending" ? t.request.sending : t.request.submit}
      </button>
      <p className="text-xs text-gray-600">{t.request.noPayment}</p>
      {state === "err" && <p className="text-sm text-red-700">{t.request.error}</p>}
    </form>
  );
}
