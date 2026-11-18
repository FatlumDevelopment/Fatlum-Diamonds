"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { DiamondShape } from "./diamond-shape";
import { StoneActions } from "./stone-actions";
import { useCompare } from "./providers";
import { activeFilterCount, applyFilters, emptyFilters, filtersFromParams, filtersToQuery, type FilterState } from "@/lib/filters";
import { formatCarat } from "@/lib/format";
import { dict, fluorLabel, gradeLabel, originLabel, shapeLabel, type Locale } from "@/lib/i18n";
import { CLARITIES, COLORS, FLUORESCENCE, GRADES, LABS, SHAPES, type Stone } from "@/lib/types";

function toggleValue<T extends string>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function Search({ stones, l }: { stones: Stone[]; l: Locale }) {
  const t = dict(l);
  const router = useRouter();
  const sp = useSearchParams();
  const compare = useCompare();
  const filters = filtersFromParams(new URLSearchParams(sp.toString()));
  const shown = applyFilters(stones, filters);

  useEffect(() => {
    if (!compare.ready) return;
    const params = new URLSearchParams(sp.toString());
    const current = params.get("compare") || "";
    const next = compare.slugs.join(",");
    if (current === next) return;
    if (next) params.set("compare", next);
    else params.delete("compare");
    const q = params.toString();
    router.replace(q ? `/${l}/diamanten?${q}` : `/${l}/diamanten`, { scroll: false });
  }, [compare.ready, compare.slugs, l, router, sp]);

  function update(partial: Partial<FilterState>) {
    const next = { ...filters, ...partial };
    router.replace(`/${l}/diamanten${filtersToQuery(next, compare.slugs)}`, { scroll: false });
  }

  const count = activeFilterCount(filters);
  const checkClass = "flex items-center gap-2 text-sm";

  return (
    <div>
      <div className="mb-6 rounded border border-dashed border-amber-500 bg-amber-50 p-4 text-sm text-amber-950" data-testid="example-banner">{t.exampleBanner}</div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-navy">{t.search.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">{t.search.intro}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded border border-gray-200 p-0.5" role="group" aria-label={`${t.search.grid} / ${t.search.list}`}>
            <button type="button" aria-pressed={filters.view === "grid"} className={`rounded px-3 py-1.5 text-sm ${filters.view === "grid" ? "bg-navy text-white" : ""}`} onClick={() => update({ view: "grid" })}>{t.search.grid}</button>
            <button type="button" aria-pressed={filters.view === "list"} className={`rounded px-3 py-1.5 text-sm ${filters.view === "list" ? "bg-navy text-white" : ""}`} onClick={() => update({ view: "list" })}>{t.search.list}</button>
          </div>
          <label className="text-sm text-gray-600">
            <span className="mr-2">{t.search.sort}</span>
            <select className="rounded border border-gray-300 bg-white px-2 py-1.5" value={filters.sort} onChange={(e) => update({ sort: e.target.value as FilterState["sort"] })}>
              {(Object.keys(t.sort) as (keyof typeof t.sort)[]).map((key) => <option key={key} value={key}>{t.sort[key]}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <form className="h-fit rounded-lg border border-gold/30 bg-cream p-4 lg:sticky lg:top-28" onSubmit={(e) => e.preventDefault()}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif text-2xl text-navy">{t.search.filters}{count ? ` (${count})` : ""}</h2>
            <button type="button" className="text-sm text-secondary underline" onClick={() => update(emptyFilters())}>{t.search.reset}</button>
          </div>

          <fieldset className="mt-4">
            <legend className="text-[10px] font-semibold uppercase tracking-widest text-gold">{t.search.shape}</legend>
            <div className="mt-2 grid grid-cols-5 gap-1">
              {SHAPES.map((shape) => {
                const on = filters.shapes.includes(shape);
                return (
                  <button key={shape} type="button" aria-pressed={on} title={shapeLabel(l, shape)} className={`rounded p-1 ${on ? "bg-navy" : "bg-white hover:bg-gold-light"}`} onClick={() => update({ shapes: toggleValue(filters.shapes, shape) })}>
                    <DiamondShape shape={shape} title={shapeLabel(l, shape)} className="h-10 w-full" />
                    <span className={`mt-0.5 block text-center text-[9px] leading-tight ${on ? "text-gold" : "text-navy"}`}>{shapeLabel(l, shape)}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="mt-4">
            <legend className="text-[10px] font-semibold uppercase tracking-widest text-gold">{t.search.carat}</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <label className="text-xs text-gray-600">{t.search.caratMin}
                <input inputMode="decimal" className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm" value={filters.caratMin} onChange={(e) => update({ caratMin: e.target.value })} />
              </label>
              <label className="text-xs text-gray-600">{t.search.caratMax}
                <input inputMode="decimal" className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm" value={filters.caratMax} onChange={(e) => update({ caratMax: e.target.value })} />
              </label>
            </div>
          </fieldset>

          <RangeSelect label={t.search.color} fromLabel={t.search.colorFrom} toLabel={t.search.colorTo} options={COLORS} from={filters.colorFrom} to={filters.colorTo} any={t.search.any} onFrom={(colorFrom) => update({ colorFrom })} onTo={(colorTo) => update({ colorTo })} />
          <RangeSelect label={t.search.clarity} fromLabel={t.search.clarityFrom} toLabel={t.search.clarityTo} options={CLARITIES} from={filters.clarityFrom} to={filters.clarityTo} any={t.search.any} onFrom={(clarityFrom) => update({ clarityFrom })} onTo={(clarityTo) => update({ clarityTo })} />

          <CheckGroup legend={t.search.cut} options={GRADES} selected={filters.cuts} label={(v) => gradeLabel(l, v)} onToggle={(v) => update({ cuts: toggleValue(filters.cuts, v) })} className={checkClass} />
          <CheckGroup legend={t.search.polish} options={GRADES} selected={filters.polishes} label={(v) => gradeLabel(l, v)} onToggle={(v) => update({ polishes: toggleValue(filters.polishes, v) })} className={checkClass} />
          <CheckGroup legend={t.search.symmetry} options={GRADES} selected={filters.symmetries} label={(v) => gradeLabel(l, v)} onToggle={(v) => update({ symmetries: toggleValue(filters.symmetries, v) })} className={checkClass} />
          <CheckGroup legend={t.search.fluorescence} options={FLUORESCENCE} selected={filters.fluorescences} label={(v) => fluorLabel(l, v)} onToggle={(v) => update({ fluorescences: toggleValue(filters.fluorescences, v) })} className={checkClass} />
          <CheckGroup legend={t.search.lab} options={LABS} selected={filters.labs} label={(v) => v} onToggle={(v) => update({ labs: toggleValue(filters.labs, v) })} className={checkClass} />

          <fieldset className="mt-4">
            <legend className="text-[10px] font-semibold uppercase tracking-widest text-gold">{t.search.origin}</legend>
            <div className="mt-2 flex flex-col gap-1 text-sm">
              {(["", "natural", "lab"] as const).map((value) => (
                <label key={value || "any"} className="flex items-center gap-2">
                  <input type="radio" name="origin" checked={filters.origin === value} onChange={() => update({ origin: value })} />
                  {value === "" ? t.search.any : originLabel(l, value)}
                </label>
              ))}
            </div>
          </fieldset>
        </form>

        <div>
          <p className="text-sm text-gray-500" data-testid="count">{t.search.results(shown.length)}</p>
          {shown.length === 0 ? <p className="mt-6">{t.search.empty}</p> : filters.view === "list" ? (
            <ul className="mt-4 space-y-3">
              {shown.map((stone) => <StoneRow key={stone.slug} stone={stone} l={l} />)}
            </ul>
          ) : (
            <ul className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {shown.map((stone) => <StoneCard key={stone.slug} stone={stone} l={l} />)}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function RangeSelect({ label, fromLabel, toLabel, options, from, to, any, onFrom, onTo }: { label: string; fromLabel: string; toLabel: string; options: readonly string[]; from: string; to: string; any: string; onFrom: (v: string) => void; onTo: (v: string) => void }) {
  return (
    <fieldset className="mt-4">
      <legend className="text-[10px] font-semibold uppercase tracking-widest text-gold">{label}</legend>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <label className="text-xs text-gray-600">{fromLabel}
          <select className="mt-1 w-full rounded border border-gray-300 bg-white px-2 py-1.5 text-sm" value={from} onChange={(e) => onFrom(e.target.value)}>
            <option value="">{any}</option>
            {options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </label>
        <label className="text-xs text-gray-600">{toLabel}
          <select className="mt-1 w-full rounded border border-gray-300 bg-white px-2 py-1.5 text-sm" value={to} onChange={(e) => onTo(e.target.value)}>
            <option value="">{any}</option>
            {options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </label>
      </div>
    </fieldset>
  );
}

function CheckGroup<T extends string>({ legend, options, selected, label, onToggle, className }: { legend: string; options: readonly T[]; selected: T[]; label: (v: T) => string; onToggle: (v: T) => void; className: string }) {
  return (
    <fieldset className="mt-4">
      <legend className="text-[10px] font-semibold uppercase tracking-widest text-gold">{legend}</legend>
      <div className="mt-2 space-y-1">
        {options.map((option) => (
          <label key={option} className={className}>
            <input type="checkbox" checked={selected.includes(option)} onChange={() => onToggle(option)} />
            {label(option)}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function StoneCard({ stone, l }: { stone: Stone; l: Locale }) {
  const t = dict(l);
  const name = `${shapeLabel(l, stone.shape)} ${formatCarat(stone.carat, l)} ct`;
  return (
    <li data-testid="stone-card" className="flex flex-col rounded-lg border border-gray-200 bg-white p-4 hover:border-gold hover:shadow-lg">
      <Link href={`/${l}/diamanten/${stone.slug}`} className="block rounded bg-cream">
        <DiamondShape shape={stone.shape} title={name} idSuffix={stone.sku} className="mx-auto h-44 w-full" />
      </Link>
      <div className="mt-3 flex items-start justify-between gap-2">
        <Link href={`/${l}/diamanten/${stone.slug}`}><h3 className="font-serif text-xl leading-tight text-navy">{name}</h3></Link>
        {stone.is_example && <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-amber-900">{t.exampleBadge}</span>}
      </div>
      <p className="mt-1 text-sm text-gray-600">{stone.color} · {stone.clarity} · {gradeLabel(l, stone.cut)}</p>
      <p className="text-xs text-gray-500">{originLabel(l, stone.origin)} · {stone.cert_lab} · {stone.sku}</p>
      <Link href={`/${l}/diamanten/${stone.slug}`} className="mt-2 text-sm text-secondary underline-offset-2 hover:underline">{t.details}</Link>
      <div className="mt-auto pt-3"><StoneActions stone={stone} l={l} /></div>
    </li>
  );
}

function StoneRow({ stone, l }: { stone: Stone; l: Locale }) {
  const t = dict(l);
  const name = `${shapeLabel(l, stone.shape)} ${formatCarat(stone.carat, l)} ct`;
  return (
    <li data-testid="stone-row" className="flex flex-col gap-4 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center">
      <Link href={`/${l}/diamanten/${stone.slug}`} className="shrink-0 rounded bg-cream sm:w-28">
        <DiamondShape shape={stone.shape} title={name} idSuffix={stone.sku} className="h-24 w-full" />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/${l}/diamanten/${stone.slug}`}><h3 className="font-serif text-2xl text-navy">{name}</h3></Link>
          {stone.is_example && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-900">{t.exampleBadge}</span>}
        </div>
        <p className="mt-1 text-sm text-gray-600">{t.specs.color} {stone.color} · {t.specs.clarity} {stone.clarity} · {t.specs.cut} {gradeLabel(l, stone.cut)} · {t.specs.polish} {gradeLabel(l, stone.polish)} · {t.specs.symmetry} {gradeLabel(l, stone.symmetry)}</p>
        <p className="text-sm text-gray-500">{fluorLabel(l, stone.fluorescence)} · {originLabel(l, stone.origin)} · {stone.cert_lab} {stone.cert_number}</p>
      </div>
      <StoneActions stone={stone} l={l} compact />
    </li>
  );
}
