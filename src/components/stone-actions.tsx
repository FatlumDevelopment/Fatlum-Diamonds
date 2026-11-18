"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { dict, type Locale } from "@/lib/i18n";
import type { Stone } from "@/lib/types";
import { useCart, useCompare } from "./providers";

export function draftFrom(stone: Stone) {
  return {
    slug: stone.slug, sku: stone.sku, shape: stone.shape, carat: stone.carat, color: stone.color,
    clarity: stone.clarity, cut: stone.cut, cert_lab: stone.cert_lab, cert_number: stone.cert_number, origin: stone.origin,
  };
}

export function StoneActions({ stone, l, compact = false }: { stone: Stone; l: Locale; compact?: boolean }) {
  const t = dict(l);
  const cart = useCart();
  const compare = useCompare();
  const router = useRouter();
  const [limit, setLimit] = useState(false);
  const inList = cart.has(stone.slug);
  const inCompare = compare.has(stone.slug);
  return (
    <div className={compact ? "flex flex-wrap gap-2" : "flex flex-col gap-2"}>
      <button type="button" className="rounded bg-navy px-3 py-2 text-sm text-white hover:bg-secondary" onClick={() => cart.add(draftFrom(stone))}>
        {inList ? t.added : t.addToList}
      </button>
      <button type="button" className="rounded border border-navy px-3 py-2 text-sm text-navy hover:bg-navy hover:text-white" onClick={() => { cart.add(draftFrom(stone)); router.push(`/${l}/anfrage`); }}>
        {t.priceOnRequest}
      </button>
      <button
        type="button"
        aria-pressed={inCompare}
        className={`rounded px-3 py-2 text-sm ${inCompare ? "bg-gold text-navy" : "border border-gold text-navy hover:bg-cream"}`}
        onClick={() => { const ok = compare.toggle(stone.slug); setLimit(!ok); }}
      >
        {inCompare ? t.compareAdded : t.compareAdd}
      </button>
      {limit && <p role="alert" className="text-xs text-red-700">{t.compareLimit}</p>}
    </div>
  );
}
