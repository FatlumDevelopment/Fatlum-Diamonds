import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getCatalog, supabaseEnv } from "@/lib/stones";
import type { Locale } from "@/lib/i18n";
import type { Stone } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const text = (v: unknown, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const esc = (v: string) => v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] || c);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad json" }, { status: 400 }); }
  if (text(body.website, 200)) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const locale: Locale = body.locale === "en" ? "en" : "de";
  const kind = body.kind === "contact" ? "contact" : "list";
  const name = text(body.name, 200);
  const email = text(body.email, 254);
  const phone = text(body.phone, 50);
  const company = text(body.company, 200);
  const rawMessage = text(body.message, 3800);
  const reserve = body.intent === "reserve" && kind === "list";
  const note = reserve ? (locale === "en" ? "Reservation request." : "Reservierung.") : "";
  const message = [note, rawMessage].filter(Boolean).join("\n\n").slice(0, 4000);
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || body.consent !== true) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  if (kind === "contact" && message.length < 5) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const env = supabaseEnv();
  const catalog = await getCatalog();
  const wanted = Array.isArray(body.items) ? body.items.slice(0, 20).map((s) => text(s, 180)) : [];
  const stones: Stone[] = [];
  if (kind === "list") {
    for (const slug of wanted) {
      const stone = catalog.stones.find((s) => s.slug === slug);
      if (stone && !stones.some((s) => s.slug === stone.slug)) stones.push(stone);
    }
    if (!stones.length) return NextResponse.json({ error: "empty" }, { status: 400 });
  }

  const id = crypto.randomUUID();
  const ref = id.slice(0, 8).toUpperCase();
  let stored = false;
  if (env) {
    const headers = {
      apikey: env.key,
      Authorization: `Bearer ${env.key}`,
      "content-type": "application/json",
      Prefer: "return=minimal",
    };
    const requestRow = {
      id, locale, kind, name, email, phone: phone || null, company: company || null,
      message: message || null, consent: true,
    };
    const inserted = await fetch(`${env.url}/rest/v1/diamond_requests`, { method: "POST", headers, body: JSON.stringify(requestRow) });
    stored = inserted.ok;
    if (!inserted.ok) console.error("diamond_requests", inserted.status);
    if (stored && stones.length) {
      const items = stones.map((s) => ({
        request_id: id,
        stone_id: catalog.source === "supabase" ? s.id : null,
        sku: s.sku, slug: s.slug, shape: s.shape, carat: s.carat, color: s.color, clarity: s.clarity,
        cut: s.cut, polish: s.polish, symmetry: s.symmetry, fluorescence: s.fluorescence,
        cert_lab: s.cert_lab, cert_number: s.cert_number, origin: s.origin,
      }));
      const itemInsert = await fetch(`${env.url}/rest/v1/diamond_request_items`, { method: "POST", headers, body: JSON.stringify(items) });
      if (!itemInsert.ok) console.error("diamond_request_items", itemInsert.status);
    }
  }

  const emailStatus = await notify({ locale, kind, reserve, name, email, phone, company, message, ref, id, stones });
  if (!stored && emailStatus === "failed") {
    return NextResponse.json({ error: "unavailable", email: emailStatus, stored: false }, { status: 503 });
  }
  return NextResponse.json({ ok: true, ref, email: emailStatus, stored });
}

function mailFrom() {
  return process.env.MAIL_FROM || "Fatlum Diamonds <info@fatlum.diamonds>";
}
function mailTo() {
  return process.env.MAIL_TO || "info@fatlum.diamonds";
}

function stoneLine(s: Stone) {
  return [
    s.sku,
    s.shape,
    `${s.carat.toFixed(2)} ct`,
    `${s.color} ${s.clarity}`,
    s.cut || "—",
    s.polish,
    s.symmetry,
    s.fluorescence,
    s.origin,
    `${s.cert_lab} ${s.cert_number}`,
  ].map((part) => esc(String(part))).join(" · ");
}

async function notify(input: {
  locale: Locale;
  kind: string;
  reserve: boolean;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  ref: string;
  id: string;
  stones: Stone[];
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return "skipped" as const;
  const from = mailFrom();
  const to = mailTo();
  const resend = new Resend(key);
  const list = input.stones.map((s) => `<li>${stoneLine(s)}</li>`).join("");
  const kindLabel = input.reserve ? "Reservierung" : input.kind === "contact" ? "Kontakt" : "Diamantanfrage";
  const fields = [
    ["Name", input.name],
    ["E-Mail", input.email],
    ["Telefon", input.phone || "—"],
    ["Firma", input.company || "—"],
    ["Art", kindLabel],
    ["Sprache", input.locale],
    ["Referenz", input.ref],
  ].map(([label, value]) => `<tr><td style="padding:4px 16px 4px 0;color:#5c564e">${esc(label)}</td><td>${esc(value)}</td></tr>`).join("");
  const wrap = (body: string) => `<div style="font-family:Georgia,serif;color:#1c1b19;max-width:640px;background:#f6f4f0;padding:32px"><p style="letter-spacing:0.18em;font-size:12px">FATLUM DIAMONDS</p>${body}</div>`;
  const internal = wrap(`<h1 style="font-weight:500;font-size:28px">${esc(kindLabel)} ${esc(input.ref)}</h1><table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">${fields}</table>${input.message ? `<p style="font-family:Arial,sans-serif;font-size:14px">${esc(input.message).replace(/\n/g, "<br>")}</p>` : ""}${list ? `<ul style="font-family:Arial,sans-serif;font-size:14px">${list}</ul>` : "<p style=\"font-family:Arial,sans-serif;font-size:14px\">Kein einzelner Stein.</p>"}<p style="font-family:Arial,sans-serif;font-size:12px;color:#5c564e">Preis auf Anfrage. Bitte persönlich antworten.</p>`);
  const confirm = input.locale === "en"
    ? wrap(`<h1 style="font-weight:500;font-size:28px">We have your enquiry</h1><p style="font-family:Arial,sans-serif;font-size:15px">Dear ${esc(input.name)},</p><p style="font-family:Arial,sans-serif;font-size:15px">thank you. Your reference is ${esc(input.ref)}. We will reply in person. Nothing has been charged.</p>${list ? `<ul style="font-family:Arial,sans-serif;font-size:14px">${list}</ul>` : ""}<p style="font-family:Arial,sans-serif;font-size:13px;color:#5c564e">Fatlum Diamonds · Maximilianstraße 2 · 80539 Munich</p>`)
    : wrap(`<h1 style="font-weight:500;font-size:28px">Ihre Anfrage ist eingegangen</h1><p style="font-family:Arial,sans-serif;font-size:15px">Guten Tag ${esc(input.name)},</p><p style="font-family:Arial,sans-serif;font-size:15px">vielen Dank. Ihre Referenz ist ${esc(input.ref)}. Wir antworten persönlich. Es wurde nichts berechnet.</p>${list ? `<ul style="font-family:Arial,sans-serif;font-size:14px">${list}</ul>` : ""}<p style="font-family:Arial,sans-serif;font-size:13px;color:#5c564e">Fatlum Diamonds · Maximilianstraße 2 · 80539 München</p>`);
  const shop = await resend.emails.send(
    {
      from,
      to: [to],
      replyTo: input.email,
      subject: `${kindLabel} ${input.ref} – ${input.name}`,
      html: internal,
    },
    { idempotencyKey: `diamond-enquiry/${input.id}` },
  );
  if (shop.error) {
    console.error("resend", shop.error.message);
    return "failed" as const;
  }
  const customer = await resend.emails.send(
    {
      from,
      to: [input.email],
      replyTo: to,
      subject: input.locale === "en" ? `Your Fatlum Diamonds enquiry ${input.ref}` : `Ihre Anfrage bei Fatlum Diamonds ${input.ref}`,
      html: confirm,
    },
    { idempotencyKey: `diamond-enquiry-confirm/${input.id}` },
  );
  if (customer.error) console.error("resend confirm", customer.error.message);
  return "sent" as const;
}
