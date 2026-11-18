"use client";
import { useState } from "react";
import Link from "next/link";
import { DiamondShape } from "./diamond-shape";
import { InquiryForm } from "./inquiry-form";
import { useCart } from "./providers";
import { formatCarat } from "@/lib/format";
import { dict, originLabel, shapeLabel, type Locale } from "@/lib/i18n";

export function RequestList({ l }: { l: Locale }) {
  const t = dict(l);
  const { items, remove, clear, ready } = useCart();
  const [sent, setSent] = useState(false);
  if (!ready) return <p className="mt-8 text-sm text-gray-500">…</p>;
  if (items.length === 0 && !sent) {
    return (
      <div className="mt-8">
        <p>{t.request.empty}</p>
        <Link href={`/${l}/diamanten`} className="mt-4 inline-block rounded bg-navy px-5 py-2 text-white">{t.request.toSearch}</Link>
      </div>
    );
  }
  return (
    <div className={sent ? "mt-8 max-w-xl" : "mt-8 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]"}>
      {!sent && <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200">
        {items.map((item) => (
          <li key={item.slug} className="flex items-center gap-4 p-4" data-testid="request-row">
            <div className="h-20 w-20 shrink-0 rounded bg-cream">
              <DiamondShape shape={item.shape} title={shapeLabel(l, item.shape)} idSuffix={item.sku} className="h-full w-full" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-serif text-lg text-navy">{shapeLabel(l, item.shape)} {formatCarat(item.carat, l)} ct</p>
              <p className="text-sm text-gray-600">{item.color} · {item.clarity} · {originLabel(l, item.origin)} · {item.cert_lab}</p>
              <p className="text-xs text-gray-500">{item.sku} · {item.cert_number}</p>
            </div>
            <button type="button" onClick={() => remove(item.slug)} className="text-sm text-red-700 hover:underline">{t.request.remove}</button>
          </li>
        ))}
      </ul>}
      <InquiryForm l={l} kind="list" items={items} onDone={() => { setSent(true); clear(); }} />
    </div>
  );
}
