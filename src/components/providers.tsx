"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { RequestDraft } from "@/lib/types";

type CartCtx = {
  items: RequestDraft[];
  add: (item: RequestDraft) => void;
  remove: (slug: string) => void;
  clear: () => void;
  has: (slug: string) => boolean;
  count: number;
  ready: boolean;
};
const CartContext = createContext<CartCtx | null>(null);
const CART_KEY = "fatlum-diamonds-request";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<RequestDraft[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      if (Array.isArray(raw)) setItems(raw.filter((i) => i && typeof i.slug === "string"));
    } catch { /* ignore broken local storage */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem(CART_KEY, JSON.stringify(items)); }, [items, ready]);
  const add = (item: RequestDraft) => setItems((list) => (list.some((i) => i.slug === item.slug) ? list : [...list, item]));
  const remove = (slug: string) => setItems((list) => list.filter((i) => i.slug !== slug));
  const clear = () => setItems([]);
  const has = (slug: string) => items.some((i) => i.slug === slug);
  return <CartContext.Provider value={{ items, add, remove, clear, has, count: items.length, ready }}>{children}</CartContext.Provider>;
}
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart");
  return ctx;
}

type CompareCtx = { slugs: string[]; toggle: (slug: string) => boolean; remove: (slug: string) => void; has: (slug: string) => boolean; ready: boolean };
const CompareContext = createContext<CompareCtx | null>(null);
const COMPARE_KEY = "fatlum-diamonds-compare";

function readCompare(): string[] {
  if (typeof window === "undefined") return [];
  const fromUrl = new URLSearchParams(window.location.search).get("compare");
  if (fromUrl) return fromUrl.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 4);
  try {
    const raw = JSON.parse(localStorage.getItem(COMPARE_KEY) || "[]");
    if (Array.isArray(raw)) return raw.filter((s) => typeof s === "string").slice(0, 4);
  } catch { /* ignore */ }
  return [];
}

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => { setSlugs(readCompare()); setReady(true); }, []);
  useEffect(() => { if (ready) localStorage.setItem(COMPARE_KEY, JSON.stringify(slugs)); }, [slugs, ready]);
  const toggle = (slug: string) => {
    if (!slugs.includes(slug) && slugs.length >= 4) return false;
    setSlugs((list) => {
      if (list.includes(slug)) return list.filter((s) => s !== slug);
      if (list.length >= 4) return list;
      return [...list, slug];
    });
    return true;
  };
  const remove = (slug: string) => setSlugs((list) => list.filter((s) => s !== slug));
  const has = (slug: string) => slugs.includes(slug);
  return <CompareContext.Provider value={{ slugs, toggle, remove, has, ready }}>{children}</CompareContext.Provider>;
}
export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare");
  return ctx;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <CompareProvider>{children}</CompareProvider>
    </CartProvider>
  );
}
