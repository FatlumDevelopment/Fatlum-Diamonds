"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DiamondShape } from "./diamond-shape";
import { StoneActions } from "./stone-actions";
import { useCompare } from "./providers";
import { formatCarat, formatPct, measurements } from "@/lib/format";
import { dict, fluorLabel, gradeLabel, originLabel, shapeLabel, type Locale } from "@/lib/i18n";
import type { Stone } from "@/lib/types";

export function CompareView({ stones, l }: { stones: Stone[]; l: Locale }) {
  const t = dict(l);
  const compare = useCompare();
  const picked = compare.slugs.map((slug) => stones.find((s) => s.slug === slug)).filter((s): s is Stone => !!s);
  if (!compare.ready) return <p className="mt-8 text-sm text-gray-500">…</p>;
  if (picked.length === 0) {
    return (
      <div className="mt-8">
        <p>{t.compare.empty}</p>
        <Link href={`/${l}/diamanten`} className="mt-4 inline-block rounded bg-navy px-5 py-2 text-white">{t.compare.toSearch}</Link>
      </div>
    );
  }
  const rows: { label: string; value: (s: Stone) => string }[] = [
    { label: t.specs.carat, value: (s) => `${formatCarat(s.carat, l)} ct` },
    { label: t.specs.color, value: (s) => s.color },
    { label: t.specs.clarity, value: (s) => s.clarity },
    { label: t.specs.cut, value: (s) => gradeLabel(l, s.cut) },
    { label: t.specs.polish, value: (s) => gradeLabel(l, s.polish) },
    { label: t.specs.symmetry, value: (s) => gradeLabel(l, s.symmetry) },
    { label: t.specs.fluorescence, value: (s) => fluorLabel(l, s.fluorescence) },
    { label: t.specs.measurements, value: (s) => measurements(s.length_mm, s.width_mm, s.depth_mm, l) },
    { label: t.specs.table, value: (s) => formatPct(s.table_pct, l) },
    { label: t.specs.depth, value: (s) => formatPct(s.depth_pct, l) },
    { label: t.specs.lab, value: (s) => s.cert_lab },
    { label: t.specs.cert, value: (s) => s.cert_number },
    { label: t.specs.origin, value: (s) => originLabel(l, s.origin) },
    { label: t.specs.sku, value: (s) => s.sku },
  ];
  return (
    <div className="mt-8 overflow-x-auto" data-testid="compare-table">
      {picked.length < 2 && <p className="mb-4 text-sm text-gray-600">{t.compare.needTwo}</p>}
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr>
            <th className="w-36 p-3 text-left font-medium text-gray-500">{t.compare.title}</th>
            {picked.map((stone) => (
              <th key={stone.slug} className="p-3 text-left align-top">
                <DiamondShape shape={stone.shape} title={shapeLabel(l, stone.shape)} idSuffix={stone.sku} className="h-28 w-full rounded bg-cream" />
                <Link href={`/${l}/diamanten/${stone.slug}`} className="mt-2 block font-serif text-xl text-navy">{shapeLabel(l, stone.shape)}</Link>
                {stone.is_example && <span className="mt-1 inline-block rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-900">{t.exampleBadge}</span>}
                <button type="button" className="mt-2 block text-xs text-red-700 underline" onClick={() => compare.remove(stone.slug)}>{t.compare.remove}</button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-gray-200">
              <th className="p-3 text-left font-medium text-gray-500">{row.label}</th>
              {picked.map((stone) => <td key={stone.slug} className="p-3 text-navy">{row.value(stone)}</td>)}
            </tr>
          ))}
          <tr className="border-t border-gray-200">
            <th className="p-3 text-left font-medium text-gray-500">{t.priceOnRequest}</th>
            {picked.map((stone) => (
              <td key={stone.slug} className="p-3"><StoneActions stone={stone} l={l} /></td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function CompareBar({ l }: { l: Locale }) {
  const t = dict(l);
  const { slugs } = useCompare();
  const path = usePathname() || "";
  if (!slugs.length || path.includes("/vergleich")) return null;
  return (
    <div className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full border border-gold/50 bg-navy px-4 py-2 text-sm text-white shadow-lg">
      <span>{slugs.length} / 4</span>
      <Link href={`/${l}/vergleich?compare=${slugs.join(",")}`} className="rounded-full bg-gold px-3 py-1 font-medium text-navy">{t.nav.compare}</Link>
    </div>
  );
}
