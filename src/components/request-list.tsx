"use client";
import { useState } from "react";
import Link from "next/link";
import { DiamondMedia } from "./media";
import { InquiryForm } from "./inquiry-form";
import { useCart } from "./providers";
import { formatCarat } from "@/lib/format";
import { dict, labLabel, originLabel, shapeLabel, type Locale } from "@/lib/i18n";

export function RequestList({ l, intent = "list" }: { l: Locale; intent?: "list" | "reserve" }) {
  const t = dict(l);
  const { items, remove, clear, ready } = useCart();
  const [sent, setSent] = useState(false);
  if (!ready) {
    return <p className="mt-10 text-sm text-muted" role="status">{t.loading}</p>;
  }
  if (items.length === 0 && !sent) {
    return (
      <div className="mt-12 border border-line bg-white px-6 py-16 text-center">
        <p className="font-serif text-4xl font-normal">{t.request.emptyTitle}</p>
        <p className="mt-3 text-sm text-muted">{t.request.empty}</p>
        <Link href={`/${l}/diamanten`} className="btn btn-solid mt-8">{t.request.toSearch}</Link>
      </div>
    );
  }
  return (
    <div className={sent ? "mt-10 max-w-xl" : "mt-10 grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start"}>
      {!sent ? (
        <ul className="divide-y divide-line border-y border-line">
          {items.map((item) => (
            <li key={item.slug} className="flex items-center gap-4 py-5" data-testid="request-row">
              <Link href={`/${l}/diamanten/${item.slug}`} className="w-24 shrink-0 border border-line">
                <DiamondMedia shape={item.shape} slug={item.slug} alt="" decorative sizes="96px" />
              </Link>
              <div className="min-w-0 flex-1">
                <p className="font-serif text-2xl font-normal leading-none">
                  <Link href={`/${l}/diamanten/${item.slug}`}>{shapeLabel(l, item.shape)} {formatCarat(item.carat, l)} ct</Link>
                </p>
                <p className="mt-2 text-sm text-muted">{item.color} · {item.clarity} · {originLabel(l, item.origin)} · {labLabel(l, item.cert_lab)}</p>
                <p className="text-xs text-muted">{item.sku}</p>
              </div>
              <button type="button" onClick={() => remove(item.slug)} className="inline-flex min-h-11 items-center text-sm underline underline-offset-4">{t.request.remove}</button>
            </li>
          ))}
        </ul>
      ) : null}
      <InquiryForm l={l} kind="list" intent={intent} items={items} onDone={() => { setSent(true); clear(); }} />
    </div>
  );
}
