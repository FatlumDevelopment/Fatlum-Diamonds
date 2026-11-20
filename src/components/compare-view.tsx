"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DiamondMedia } from "./media";
import { StoneActions } from "./stone-actions";
import { useCompare } from "./providers";
import { specRows } from "@/lib/specs";
import { dict, shapeLabel, type Locale } from "@/lib/i18n";
import type { Stone } from "@/lib/types";

export function CompareView({ stones, l }: { stones: Stone[]; l: Locale }) {
  const t = dict(l);
  const compare = useCompare();
  const picked = compare.slugs.map((slug) => stones.find((s) => s.slug === slug)).filter((s): s is Stone => !!s);
  if (!compare.ready) return <p className="mt-8 text-sm text-muted" role="status">{t.loading}</p>;
  if (picked.length === 0) {
    return (
      <div className="mt-12 border border-line bg-white px-6 py-16 text-center">
        <p className="font-serif text-4xl font-normal">{t.compare.emptyTitle}</p>
        <p className="mt-3 text-sm text-muted">{t.compare.empty}</p>
        <Link href={`/${l}/diamanten`} className="btn btn-solid mt-8">{t.compare.toSearch}</Link>
      </div>
    );
  }
  const rows = specRows(picked[0], l).map(([label]) => label);
  return (
    <div className="mt-8">
      {picked.length < 2 ? <p className="mb-4 text-sm text-muted">{t.compare.needTwo}</p> : null}
      <div className="overflow-x-auto border border-line bg-white" data-testid="compare-table">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-40 p-4 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-muted">{t.compare.title}</th>
              {picked.map((stone) => (
                <th key={stone.slug} className="min-w-48 p-4 text-left align-top font-normal">
                  <Link href={`/${l}/diamanten/${stone.slug}`} className="block w-28 border border-line">
                    <DiamondMedia shape={stone.shape} slug={stone.slug} alt="" decorative sizes="112px" />
                  </Link>
                  <Link href={`/${l}/diamanten/${stone.slug}`} className="mt-3 block font-serif text-2xl font-normal">{shapeLabel(l, stone.shape)}</Link>
                  {stone.is_example ? <p className="mt-1 text-[10px] tracking-[0.16em] text-muted">{t.exampleBadge}</p> : null}
                  <button type="button" className="mt-2 inline-flex min-h-11 items-center text-sm underline underline-offset-4" onClick={() => compare.remove(stone.slug)}>{t.compare.remove}</button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((label, index) => (
              <tr key={label} className="border-t border-line">
                <th className="p-4 text-left font-medium text-muted">{label}</th>
                {picked.map((stone) => <td key={stone.slug} className="p-4">{specRows(stone, l)[index]?.[1]}</td>)}
              </tr>
            ))}
            <tr className="border-t border-line">
              <th className="p-4 text-left font-medium text-muted">{t.priceOnRequest}</th>
              {picked.map((stone) => (
                <td key={stone.slug} className="p-4 align-top"><StoneActions stone={stone} l={l} /></td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function CompareBar({ l }: { l: Locale }) {
  const t = dict(l);
  const { slugs } = useCompare();
  const path = usePathname() || "";
  if (!slugs.length || path.includes("/vergleich")) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-8">
        <p className="text-sm">{t.compare.count(slugs.length)}</p>
        <Link href={`/${l}/vergleich?compare=${slugs.join(",")}`} className="btn btn-solid min-h-11 px-5">{t.nav.compare}</Link>
      </div>
    </div>
  );
}
