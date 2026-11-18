import { cache } from "react";
import { connection } from "next/server";
import fallback from "../../data/stones.json";
import type { Catalog, Grade, Stone } from "./types";
import { CLARITIES, COLORS, FLUORESCENCE, GRADES, LABS, ORIGINS, SHAPES } from "./types";

function num(v: unknown) {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}
function oneOf<T extends string>(v: unknown, allowed: readonly T[]): T | null {
  return typeof v === "string" && (allowed as readonly string[]).includes(v) ? (v as T) : null;
}

export function normalizeStone(row: Record<string, unknown>): Stone | null {
  const shape = oneOf(row.shape, SHAPES);
  const color = oneOf(row.color, COLORS);
  const clarity = oneOf(row.clarity, CLARITIES);
  const polish = oneOf(row.polish, GRADES);
  const symmetry = oneOf(row.symmetry, GRADES);
  const fluorescence = oneOf(row.fluorescence, FLUORESCENCE);
  const cert_lab = oneOf(row.cert_lab, LABS);
  const origin = oneOf(row.origin, ORIGINS);
  const cut = row.cut == null || row.cut === "" ? null : oneOf(row.cut, GRADES);
  if (!shape || !color || !clarity || !polish || !symmetry || !fluorescence || !cert_lab || !origin) return null;
  if (row.cut != null && row.cut !== "" && !cut) return null;
  const slug = String(row.slug || "");
  const sku = String(row.sku || "");
  if (!slug || !sku) return null;
  return {
    id: String(row.id || slug),
    sku,
    slug,
    shape,
    carat: num(row.carat),
    color,
    clarity,
    cut: cut as Grade | null,
    polish,
    symmetry,
    fluorescence,
    cert_lab,
    cert_number: String(row.cert_number || ""),
    origin,
    length_mm: num(row.length_mm),
    width_mm: num(row.width_mm),
    depth_mm: num(row.depth_mm),
    table_pct: num(row.table_pct),
    depth_pct: num(row.depth_pct),
    in_stock: row.in_stock !== false,
    is_example: row.is_example !== false,
    is_active: row.is_active !== false,
    example_marker: "EXAMPLE",
  };
}

function staticCatalog(): Catalog {
  const stones = (fallback as Record<string, unknown>[]).map(normalizeStone).filter((s): s is Stone => !!s);
  return { stones, source: "fallback" };
}

export function supabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key };
}

export const getCatalog = cache(async (): Promise<Catalog> => {
  await connection();
  const env = supabaseEnv();
  if (!env) return staticCatalog();
  try {
    const r = await fetch(
      `${env.url}/rest/v1/diamond_stones?select=*&is_active=eq.true&order=carat.desc`,
      {
        headers: { apikey: env.key, Authorization: `Bearer ${env.key}` },
        next: { revalidate: 60 },
      },
    );
    if (!r.ok) throw new Error(`diamond_stones ${r.status}`);
    const rows = (await r.json()) as Record<string, unknown>[];
    const stones = rows.map(normalizeStone).filter((s): s is Stone => !!s);
    if (!stones.length) return staticCatalog();
    return { stones, source: "supabase" };
  } catch (error) {
    console.error("diamond catalog fallback", error instanceof Error ? error.message : "error");
    return staticCatalog();
  }
});

export async function getStone(slug: string) {
  const { stones, source } = await getCatalog();
  return { stone: stones.find((s) => s.slug === slug) ?? null, source };
}
