import { NextResponse } from "next/server";
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
  if (!env) return NextResponse.json({ error: "unconfigured" }, { status: 503 });

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
  if (!inserted.ok) {
    console.error("diamond_requests", inserted.status);
    return NextResponse.json({ error: "db" }, { status: 500 });
  }
  if (stones.length) {
    const items = stones.map((s) => ({
      request_id: id,
      stone_id: catalog.source === "supabase" ? s.id : null,
      sku: s.sku, slug: s.slug, shape: s.shape, carat: s.carat, color: s.color, clarity: s.clarity,
      cut: s.cut, polish: s.polish, symmetry: s.symmetry, fluorescence: s.fluorescence,
      cert_lab: s.cert_lab, cert_number: s.cert_number, origin: s.origin,
    }));
    const itemInsert = await fetch(`${env.url}/rest/v1/diamond_request_items`, { method: "POST", headers, body: JSON.stringify(items) });
    if (!itemInsert.ok) {
      console.error("diamond_request_items", itemInsert.status);
      return NextResponse.json({ error: "db" }, { status: 500 });
    }
  }

  const ref = id.slice(0, 8).toUpperCase();
  const emailStatus = await notify({ locale, kind, name, email, phone, company, message, ref, id, stones });
  return NextResponse.json({ ok: true, ref, email: emailStatus });
}

function line(locale: Locale, s: Stone) {
  const shape = locale === "en" ? s.shape : s.shape;
  return `${esc(s.sku)} · ${esc(shape)} · ${s.carat.toFixed(2)} ct · ${esc(s.color)} ${esc(s.clarity)} · ${esc(s.origin)} · ${esc(s.cert_lab)} ${esc(s.cert_number)}`;
}

async function notify(input: { locale: Locale; kind: string; name: string; email: string; phone: string; company: string; message: string; ref: string; id: string; stones: Stone[] }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return "skipped";
  const from = process.env.MAIL_FROM || "Fatlum Diamonds <anfragen@fatlum.diamonds>";
  const to = process.env.MAIL_TO || "info@fatlum.diamonds";
  const list = input.stones.map((s) => `<li>${line(input.locale, s)}</li>`).join("");
  const wrap = (body: string) => `<div style="font-family:Arial,sans-serif;color:#2b2f3a;max-width:600px"><div style="background:#03123f;padding:18px 24px"><span style="font-family:Georgia,serif;color:#bf9e50;font-size:22px;letter-spacing:4px">FATLUM</span></div><div style="padding:24px">${body}</div></div>`;
  const facts = `<p><b>${esc(input.name)}</b><br>${esc(input.email)}<br>${esc(input.phone)}<br>${esc(input.company)}</p>${input.message ? `<p>${esc(input.message).replace(/\n/g, "<br>")}</p>` : ""}${list ? `<ul>${list}</ul>` : ""}<p style="font-size:12px;color:#777">${esc(input.kind)} · ${input.locale} · ${input.id}</p>`;
  const internal = wrap(`<h2 style="color:#03123f">Neue Diamantanfrage ${esc(input.ref)}</h2>${facts}<p style="font-size:12px">Keine Preise auf der Website. Bitte Angebot persönlich erstellen.</p>`);
  const confirm = input.locale === "en"
    ? wrap(`<h2 style="color:#03123f">We have your request</h2><p>Dear ${esc(input.name)},</p><p>your request (ref. ${esc(input.ref)}) is stored. We will reply with a personal offer. Nothing has been charged, and the website does not show prices.</p>${list ? `<ul>${list}</ul>` : ""}<p>Fatlum Diamonds · info@fatlum.diamonds · Maximilianstraße 2, 80539 Munich</p>`)
    : wrap(`<h2 style="color:#03123f">Ihre Anfrage ist eingegangen</h2><p>Guten Tag ${esc(input.name)},</p><p>Ihre Anfrage (Ref. ${esc(input.ref)}) ist gespeichert. Wir melden uns mit einem persönlichen Angebot. Es wurde nichts berechnet, und die Website zeigt keine Preise.</p>${list ? `<ul>${list}</ul>` : ""}<p>Fatlum Diamonds · info@fatlum.diamonds · Maximilianstraße 2, 80539 München</p>`);
  const send = (payload: object) => fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({ from, ...payload }),
  });
  try {
    const [a, b] = await Promise.all([
      send({ to: [to], reply_to: input.email, subject: `Neue Diamantanfrage ${input.ref} – ${input.name}`, html: internal }),
      send({ to: [input.email], reply_to: to, subject: input.locale === "en" ? `Your Fatlum Diamonds request ${input.ref}` : `Ihre Anfrage bei Fatlum Diamonds ${input.ref}`, html: confirm }),
    ]);
    if (!a.ok || !b.ok) {
      console.error("resend", a.status, b.status);
      return "failed";
    }
    return "sent";
  } catch (error) {
    console.error("resend", error instanceof Error ? error.message : "error");
    return "failed";
  }
}
