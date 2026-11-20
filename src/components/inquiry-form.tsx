"use client";
import { useState } from "react";
import Link from "next/link";
import { dict, type Locale } from "@/lib/i18n";
import type { RequestDraft } from "@/lib/types";

type Errors = Partial<Record<"name" | "email" | "phone" | "message" | "consent", string>>;

export function InquiryForm({
  l,
  kind,
  intent = "list",
  items = [],
  onDone,
}: {
  l: Locale;
  kind: "list" | "contact";
  intent?: "list" | "reserve";
  items?: RequestDraft[];
  onDone?: () => void;
}) {
  const t = dict(l);
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [ref, setRef] = useState("");
  const [mail, setMail] = useState<"sent" | "skipped" | "failed" | "">("");
  const reserve = intent === "reserve" && kind === "list";

  function validate(form: HTMLFormElement): Errors {
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const message = String(data.get("message") || "").trim();
    const next: Errors = {};
    if (name.length < 2) next.name = t.request.errors.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = t.request.errors.email;
    if (phone && phone.replace(/\D/g, "").length < 6) next.phone = t.request.errors.phone;
    if (kind === "contact" && message.length < 5) next.message = t.request.errors.message;
    if (data.get("consent") !== "on") next.consent = t.request.errors.consent;
    return next;
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const next = validate(form);
    setErrors(next);
    const first = (Object.keys(next) as (keyof Errors)[])[0];
    if (first) {
      const node = form.elements.namedItem(first);
      if (node instanceof HTMLElement) node.focus();
      return;
    }
    setState("sending");
    const f = Object.fromEntries(new FormData(form).entries());
    const r = await fetch("/api/request", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...f,
        consent: f.consent === "on",
        locale: l,
        kind,
        intent: reserve ? "reserve" : "list",
        items: items.map((item) => item.slug),
      }),
    }).catch(() => null);
    if (!r || !r.ok) { setState("err"); return; }
    const body = await r.json().catch(() => ({}));
    setRef(String(body.ref || ""));
    setMail(body.email === "sent" || body.email === "failed" ? body.email : "skipped");
    setState("ok");
    onDone?.();
  }

  if (state === "ok") {
    return (
      <div data-testid="success" role="status" className="border border-line bg-white px-6 py-10">
        <p className="font-serif text-4xl font-normal leading-tight">{t.request.successTitle}</p>
        <p className="mt-4 text-muted">{t.request.success}</p>
        {ref ? <p className="mt-4 text-sm">{t.request.ref} {ref}</p> : null}
        <p className="mt-3 text-sm leading-relaxed text-muted">{mail === "sent" ? t.request.successMail : t.request.successNoMail}</p>
      </div>
    );
  }

  function fieldError(name: keyof Errors) {
    return errors[name] ? <span id={`${name}-error`} className="mt-1 block text-sm text-danger">{errors[name]}</span> : null;
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5" aria-busy={state === "sending"}>
      <h2 className="font-serif text-3xl font-normal">{kind === "contact" ? t.contact.formTitle : reserve ? t.request.reserveFormTitle : t.request.formTitle}</h2>
      <label className="block text-sm">
        {t.request.name}
        <input name="name" autoComplete="name" required minLength={2} maxLength={200} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} className="field mt-1.5" />
        {fieldError("name")}
      </label>
      <label className="block text-sm">
        {t.request.email}
        <input name="email" type="email" autoComplete="email" required maxLength={254} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} className="field mt-1.5" />
        {fieldError("email")}
      </label>
      <label className="block text-sm">
        {t.request.phone}
        <input name="phone" type="tel" autoComplete="tel" maxLength={50} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-error" : undefined} className="field mt-1.5" />
        {fieldError("phone")}
      </label>
      <label className="block text-sm">
        {t.request.company}
        <input name="company" autoComplete="organization" maxLength={200} className="field mt-1.5" />
      </label>
      <label className="block text-sm">
        {kind === "contact" ? t.contact.message : t.request.message}
        <textarea name="message" required={kind === "contact"} minLength={kind === "contact" ? 5 : undefined} rows={5} maxLength={4000} aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined} className="field mt-1.5" />
        {fieldError("message")}
      </label>
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div>
        <label className="flex min-h-11 items-start gap-3 text-sm leading-relaxed">
          <input type="checkbox" name="consent" className="mt-1 size-5 accent-ink" aria-invalid={!!errors.consent} aria-describedby={errors.consent ? "consent-error" : undefined} />
          <span>{t.request.consent} <Link href={`/${l}/datenschutz`} className="underline underline-offset-4">{t.footer.privacy}</Link>.</span>
        </label>
        {fieldError("consent")}
      </div>
      <button disabled={state === "sending"} className="btn btn-solid w-full">
        {state === "sending" ? t.request.sending : reserve ? t.request.reserveSubmit : t.request.submit}
      </button>
      <p className="text-sm leading-relaxed text-muted">{t.request.noPayment}</p>
      {state === "err" ? <p role="alert" className="text-sm text-danger">{t.request.error}</p> : null}
    </form>
  );
}
