"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { dict, type Locale } from "@/lib/i18n";
import type { Stone } from "@/lib/types";
import { useCart, useCompare } from "./providers";

export function draftFrom(stone: Stone) {
  return {
    slug: stone.slug,
    sku: stone.sku,
    shape: stone.shape,
    carat: stone.carat,
    color: stone.color,
    clarity: stone.clarity,
    cut: stone.cut,
    cert_lab: stone.cert_lab,
    cert_number: stone.cert_number,
    origin: stone.origin,
  };
}

export function StoneActions({ stone, l, layout = "detail" }: { stone: Stone; l: Locale; layout?: "detail" | "card" | "row" }) {
  const t = dict(l);
  const cart = useCart();
  const compare = useCompare();
  const router = useRouter();
  const [limit, setLimit] = useState(false);
  const [live, setLive] = useState("");
  const inList = cart.has(stone.slug);
  const inCompare = compare.has(stone.slug);

  function add(intent?: "reserve") {
    cart.add(draftFrom(stone));
    setLive(t.detail.addedLive);
    router.push(intent === "reserve" ? `/${l}/anfrage?intent=reserve` : `/${l}/anfrage`);
  }
  function keep() {
    cart.add(draftFrom(stone));
    setLive(t.detail.addedLive);
  }

  if (layout === "card" || layout === "row") {
    return (
      <div className="flex flex-wrap gap-x-5">
        <button type="button" className="inline-flex min-h-11 items-center text-sm underline decoration-line underline-offset-4 hover:decoration-ink" onClick={keep}>
          {inList ? t.added : t.addToList}
        </button>
        <button
          type="button"
          aria-pressed={inCompare}
          className="inline-flex min-h-11 items-center text-sm underline decoration-line underline-offset-4 hover:decoration-ink"
          onClick={() => {
            const ok = compare.toggle(stone.slug);
            setLimit(!ok && !inCompare);
          }}
        >
          {inCompare ? t.compareAdded : t.compareAdd}
        </button>
        {limit ? <p role="alert" className="basis-full text-sm text-danger">{t.compareLimit}</p> : null}
        <p className="sr-only" aria-live="polite">{live}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <button type="button" className="btn btn-solid w-full" onClick={() => add()}>{t.priceOnRequest}</button>
      <button type="button" className="btn btn-line w-full" onClick={() => add("reserve")}>{t.detail.reserve}</button>
      <p className="text-xs leading-relaxed text-muted">{t.detail.reserveNote}</p>
      <div className="flex flex-wrap gap-x-5">
        <button type="button" className="inline-flex min-h-11 items-center text-sm underline decoration-line underline-offset-4 hover:decoration-ink" onClick={keep}>
          {inList ? t.added : t.addToList}
        </button>
        <button
          type="button"
          aria-pressed={inCompare}
          className="inline-flex min-h-11 items-center text-sm underline decoration-line underline-offset-4 hover:decoration-ink"
          onClick={() => {
            const ok = compare.toggle(stone.slug);
            setLimit(!ok && !inCompare);
          }}
        >
          {inCompare ? t.compareAdded : t.compareAdd}
        </button>
      </div>
      {limit ? <p role="alert" className="text-sm text-danger">{t.compareLimit}</p> : null}
      <p className="sr-only" aria-live="polite">{live}</p>
    </div>
  );
}
