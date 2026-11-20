"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DiamondMedia } from "./media";
import { FilterPanel, activeChips } from "./filter-panel";
import { StoneActions } from "./stone-actions";
import { useCompare } from "./providers";
import { SpecimenNote } from "./frame";
import { activeFilterCount, applyFilters, emptyFilters, filtersFromParams, filtersToQuery, type FilterState } from "@/lib/filters";
import { formatCarat } from "@/lib/format";
import { dict, gradeLabel, labLabel, originLabel, shapeLabel, type Locale } from "@/lib/i18n";
import type { Stone } from "@/lib/types";

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M1 1h6v6H1zM9 1h6v6H9zM1 9h6v6H1zM9 9h6v6H9z" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M1 3h14M1 8h14M1 13h14" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function Search({ stones, l }: { stones: Stone[]; l: Locale }) {
  const t = dict(l);
  const router = useRouter();
  const sp = useSearchParams();
  const compare = useCompare();
  const filters = filtersFromParams(new URLSearchParams(sp.toString()));
  const shown = applyFilters(stones, filters);
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const count = activeFilterCount(filters);
  const examples = stones.some((stone) => stone.is_example);

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

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const close = () => { if (mq.matches) setOpen(false); };
    mq.addEventListener("change", close);
    return () => mq.removeEventListener("change", close);
  }, []);

  function update(partial: Partial<FilterState>) {
    const next = { ...filters, ...partial };
    router.replace(`/${l}/diamanten${filtersToQuery(next, compare.slugs)}`, { scroll: false });
  }

  function reset() {
    update({ ...emptyFilters(), sort: filters.sort, view: filters.view });
  }

  const chips = activeChips(filters, l);
  const emptyCopy = filters.priceOnRequest ? t.search.empty : t.search.priceOffEmpty;

  return (
    <div>
      <div className="max-w-3xl">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted">{t.hero.eyebrow}</p>
        <h1 className="mt-3 font-serif text-[2.65rem] font-normal leading-[1.02] md:text-6xl">{t.search.title}</h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">{t.search.intro}</p>
      </div>

      <div className="mt-8 lg:grid lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start lg:gap-12">
        <aside className="sticky top-[var(--header-offset)] hidden max-h-[calc(100dvh-var(--header-offset)-1.5rem)] overflow-y-auto border border-line bg-white p-5 lg:block">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="font-serif text-3xl font-normal">{t.search.filters}</h2>
            <button type="button" className="inline-flex min-h-11 items-center text-sm underline decoration-line underline-offset-4" onClick={reset}>{t.search.reset}</button>
          </div>
          <FilterPanel l={l} filters={filters} onChange={update} idPrefix="desk" />
        </aside>

        <div className="min-w-0">
          <div className="sticky top-[var(--header-offset)] z-20 -mx-5 border-b border-line bg-paper/95 px-5 py-3 backdrop-blur-md md:-mx-8 md:px-8 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm" aria-live="polite" data-testid="count">{t.search.results(shown.length)}</p>
              <div className="flex flex-wrap items-center gap-2">
                <div className="lg:hidden">
                  <button type="button" className="btn btn-line h-11 min-h-11 px-4" aria-expanded={open} aria-controls="filter-sheet" onClick={() => setOpen(true)}>
                    {t.search.openFilters}{count ? ` · ${count}` : ""}
                  </button>
                </div>
                <label className="sr-only" htmlFor="sort">{t.search.sort}</label>
                <select id="sort" className="select h-11 min-h-11 w-auto" value={filters.sort} onChange={(e) => update({ sort: e.target.value as FilterState["sort"] })}>
                  {(Object.keys(t.sort) as (keyof typeof t.sort)[]).map((key) => <option key={key} value={key}>{t.sort[key]}</option>)}
                </select>
                <div className="flex" role="group" aria-label={`${t.search.grid} / ${t.search.list}`}>
                  <button type="button" className={`grid size-11 place-items-center border ${filters.view === "grid" ? "border-ink bg-ink text-white" : "border-line-strong bg-white"}`} aria-pressed={filters.view === "grid"} onClick={() => update({ view: "grid" })}>
                    <GridIcon /><span className="sr-only">{t.search.grid}</span>
                  </button>
                  <button type="button" className={`-ml-px grid size-11 place-items-center border ${filters.view === "list" ? "border-ink bg-ink text-white" : "border-line-strong bg-white"}`} aria-pressed={filters.view === "list"} onClick={() => update({ view: "list" })}>
                    <ListIcon /><span className="sr-only">{t.search.list}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {examples ? <div className="mt-4"><SpecimenNote l={l} show /></div> : null}

          {chips.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <li key={chip.key}>
                  <button type="button" className="chip gap-2" aria-label={`${t.search.removeFilter}: ${chip.label}`} onClick={() => update(chip.clear)}>
                    {chip.label}
                    <span aria-hidden="true">×</span>
                  </button>
                </li>
              ))}
              <li>
                <button type="button" className="inline-flex min-h-11 items-center px-1 text-sm underline decoration-line underline-offset-4" onClick={reset}>{t.search.reset}</button>
              </li>
            </ul>
          ) : null}

          {shown.length === 0 ? (
            <div className="mt-8 border border-line bg-white px-6 py-16 text-center">
              <p className="font-serif text-4xl font-normal">{t.search.emptyTitle}</p>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">{emptyCopy}</p>
              <button type="button" className="btn btn-line mt-8" onClick={reset}>{t.search.reset}</button>
            </div>
          ) : filters.view === "list" ? (
            <ResultsList stones={shown} l={l} />
          ) : (
            <ul className="mt-6 grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
              {shown.map((stone) => <StoneCard key={stone.slug} stone={stone} l={l} />)}
            </ul>
          )}
        </div>
      </div>

      <dialog
        ref={dialogRef}
        id="filter-sheet"
        className="sheet"
        aria-label={t.search.filters}
        onClose={() => setOpen(false)}
        onCancel={(event) => {
          event.preventDefault();
          setOpen(false);
        }}
      >
        <div className="flex h-full min-h-0 flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
            <h2 className="font-serif text-3xl font-normal">{t.search.filters}</h2>
            <div className="flex items-center">
              <button type="button" className="inline-flex min-h-11 items-center px-2 text-sm underline" onClick={reset}>{t.search.reset}</button>
              <button type="button" className="grid size-11 place-items-center text-2xl leading-none" onClick={() => setOpen(false)} aria-label={t.search.closeFilters}>×</button>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
            <FilterPanel l={l} filters={filters} onChange={update} idPrefix="sheet" />
          </div>
          <div className="border-t border-line bg-white px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <button type="button" className="btn btn-solid w-full" onClick={() => setOpen(false)}>{t.search.showResults(shown.length)}</button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

function StoneCard({ stone, l }: { stone: Stone; l: Locale }) {
  const t = dict(l);
  const name = `${shapeLabel(l, stone.shape)} ${formatCarat(stone.carat, l)} ct`;
  return (
    <li data-testid="stone-card" className="flex flex-col">
      <Link href={`/${l}/diamanten/${stone.slug}`} className="block">
        <span className="block border border-line">
          <DiamondMedia shape={stone.shape} slug={stone.slug} alt="" decorative sizes="(min-width: 1280px) 300px, (min-width: 640px) 46vw, 92vw" />
        </span>
        <span className="mt-4 flex items-baseline justify-between gap-3">
          <h2 className="font-serif text-[1.65rem] font-normal leading-none">{name}</h2>
          {stone.is_example ? <span className="text-[10px] tracking-[0.16em] text-muted">{t.exampleBadge}</span> : null}
        </span>
        <p className="mt-2 text-sm text-muted">{stone.color} · {stone.clarity} · {gradeLabel(l, stone.cut)} · {labLabel(l, stone.cert_lab)}</p>
        <p className="mt-1 text-sm text-muted">{originLabel(l, stone.origin)}</p>
        <p className="mt-3 font-serif text-2xl font-normal">{t.priceOnRequest}</p>
      </Link>
      <div className="mt-1"><StoneActions stone={stone} l={l} layout="card" /></div>
    </li>
  );
}

function ResultsList({ stones, l }: { stones: Stone[]; l: Locale }) {
  const t = dict(l);
  return (
    <>
      <ul className="mt-4 divide-y divide-line border-t border-line lg:hidden">
        {stones.map((stone) => {
          const name = `${shapeLabel(l, stone.shape)} ${formatCarat(stone.carat, l)} ct`;
          return (
            <li key={stone.slug} data-testid="stone-row" className="py-6">
              <div className="flex gap-4">
                <Link href={`/${l}/diamanten/${stone.slug}`} aria-label={name} className="w-28 shrink-0 border border-line">
                  <DiamondMedia shape={stone.shape} slug={stone.slug} alt="" decorative sizes="112px" />
                </Link>
                <div className="min-w-0">
                  <h2 className="font-serif text-3xl font-normal leading-none">
                    <Link href={`/${l}/diamanten/${stone.slug}`}>{name}</Link>
                  </h2>
                  <p className="mt-2 text-sm text-muted">{stone.color} · {stone.clarity} · {gradeLabel(l, stone.cut)}</p>
                  <p className="text-sm text-muted">{originLabel(l, stone.origin)} · {labLabel(l, stone.cert_lab)}</p>
                  <p className="mt-2 font-serif text-xl">{t.priceOnRequest}</p>
                </div>
              </div>
              <div className="mt-4"><StoneActions stone={stone} l={l} layout="row" /></div>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 hidden overflow-x-auto border-t border-line lg:block">
        <table className="w-full text-left text-sm">
          <thead className="text-[11px] uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="py-3 pr-3 font-medium">{t.specs.shape}</th>
              <th className="py-3 pr-3 font-medium">{t.specs.carat}</th>
              <th className="py-3 pr-3 font-medium">{t.specs.color}</th>
              <th className="py-3 pr-3 font-medium">{t.specs.clarity}</th>
              <th className="py-3 pr-3 font-medium">{t.specs.cut}</th>
              <th className="py-3 pr-3 font-medium">{t.specs.lab}</th>
              <th className="py-3 pr-3 font-medium">{t.priceOnRequest}</th>
              <th className="py-3 font-medium"><span className="sr-only">{t.details}</span></th>
            </tr>
          </thead>
          <tbody>
            {stones.map((stone) => (
              <tr key={stone.slug} data-testid="stone-row" className="border-t border-line align-middle">
                <th scope="row" className="py-3 pr-3 font-normal">
                  <Link href={`/${l}/diamanten/${stone.slug}`} className="inline-flex items-center gap-3 font-serif text-xl">
                    <span className="block w-14 border border-line"><DiamondMedia shape={stone.shape} slug={stone.slug} alt="" decorative sizes="56px" /></span>
                    {shapeLabel(l, stone.shape)}
                  </Link>
                </th>
                <td className="py-3 pr-3 tabular-nums">{formatCarat(stone.carat, l)}</td>
                <td className="py-3 pr-3">{stone.color}</td>
                <td className="py-3 pr-3">{stone.clarity}</td>
                <td className="py-3 pr-3">{gradeLabel(l, stone.cut)}</td>
                <td className="py-3 pr-3">{labLabel(l, stone.cert_lab)}</td>
                <td className="py-3 pr-3">{t.priceOnRequest}</td>
                <td className="py-3"><Link href={`/${l}/diamanten/${stone.slug}`} className="underline underline-offset-4">{t.details}</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
