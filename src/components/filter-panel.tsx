"use client";
import { DiamondShape } from "./diamond-shape";
import { CARAT_PRESETS, nextGradeRange, type FilterState } from "@/lib/filters";
import { formatCarat } from "@/lib/format";
import { dict, fluorLabel, gradeLabel, labLabel, originLabel, shapeLabel, type Locale } from "@/lib/i18n";
import { CLARITIES, COLORS, FLUORESCENCE, GRADES, LABS, SHAPES, type Fluorescence, type Grade, type Lab, type Shape } from "@/lib/types";

function toggle<T extends string>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function FilterPanel({
  l,
  filters,
  onChange,
  idPrefix,
}: {
  l: Locale;
  filters: FilterState;
  onChange: (partial: Partial<FilterState>) => void;
  idPrefix: string;
}) {
  const t = dict(l);
  return (
    <form onSubmit={(event) => event.preventDefault()} className="space-y-7">
      <fieldset>
        <legend className="text-[11px] uppercase tracking-[0.18em] text-muted">{t.search.shape}</legend>
        <div className="mt-3 grid grid-cols-5 gap-1.5">
          {SHAPES.map((shape) => {
            const on = filters.shapes.includes(shape);
            return (
              <button
                key={shape}
                type="button"
                aria-pressed={on}
                className={`flex min-h-[4.25rem] flex-col items-center justify-center gap-1 border px-0.5 text-center ${on ? "border-ink bg-ink text-white" : "border-line bg-white text-ink"}`}
                onClick={() => onChange({ shapes: toggle(filters.shapes, shape) })}
              >
                <DiamondShape shape={shape} decorative className="h-6 w-6" />
                <span className="text-[10px] leading-tight tracking-wide">{shapeLabel(l, shape)}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-[11px] uppercase tracking-[0.18em] text-muted">{t.search.carat}</legend>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {CARAT_PRESETS.map((preset) => {
            const on = filters.caratMin === preset.min && filters.caratMax === preset.max;
            const label = preset.max
              ? `${formatCarat(Number(preset.min), l)}–${formatCarat(Number(preset.max), l)}`
              : `${t.search.caratFrom} ${formatCarat(Number(preset.min), l)}`;
            return (
              <button key={preset.min} type="button" className="chip" aria-pressed={on} onClick={() => onChange(on ? { caratMin: "", caratMax: "" } : { caratMin: preset.min, caratMax: preset.max })}>
                {label}
              </button>
            );
          })}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <label className="block text-xs text-muted">
            {t.search.caratMin}
            <input inputMode="decimal" autoComplete="off" className="field mt-1" value={filters.caratMin} onChange={(e) => onChange({ caratMin: e.target.value })} />
          </label>
          <label className="block text-xs text-muted">
            {t.search.caratMax}
            <input inputMode="decimal" autoComplete="off" className="field mt-1" value={filters.caratMax} onChange={(e) => onChange({ caratMax: e.target.value })} />
          </label>
        </div>
      </fieldset>

      <GradeScale
        label={t.search.color}
        options={COLORS}
        from={filters.colorFrom}
        to={filters.colorTo}
        any={t.search.rangeAll}
        onChange={(colorFrom, colorTo) => onChange({ colorFrom, colorTo })}
      />
      <GradeScale
        label={t.search.clarity}
        options={CLARITIES}
        from={filters.clarityFrom}
        to={filters.clarityTo}
        any={t.search.rangeAll}
        onChange={(clarityFrom, clarityTo) => onChange({ clarityFrom, clarityTo })}
      />

      <Chips legend={t.search.cut} note={t.search.cutNote} options={GRADES} selected={filters.cuts} label={(v) => gradeLabel(l, v)} onToggle={(v) => onChange({ cuts: toggle<Grade>(filters.cuts, v) })} />
      <Chips legend={t.search.polish} options={GRADES} selected={filters.polishes} label={(v) => gradeLabel(l, v)} onToggle={(v) => onChange({ polishes: toggle<Grade>(filters.polishes, v) })} />
      <Chips legend={t.search.symmetry} options={GRADES} selected={filters.symmetries} label={(v) => gradeLabel(l, v)} onToggle={(v) => onChange({ symmetries: toggle<Grade>(filters.symmetries, v) })} />
      <Chips legend={t.search.fluorescence} options={FLUORESCENCE} selected={filters.fluorescences} label={(v) => fluorLabel(l, v)} onToggle={(v) => onChange({ fluorescences: toggle<Fluorescence>(filters.fluorescences, v) })} />
      <Chips legend={t.search.lab} note={t.search.labNote} options={LABS} selected={filters.labs} label={(v) => labLabel(l, v)} onToggle={(v) => onChange({ labs: toggle<Lab>(filters.labs, v) })} />

      <fieldset>
        <legend className="text-[11px] uppercase tracking-[0.18em] text-muted">{t.search.origin}</legend>
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {(["", "natural", "lab"] as const).map((value) => (
            <label key={value || "any"} className={`chip cursor-pointer ${filters.origin === value ? "border-ink bg-ink text-white" : ""}`}>
              <input className="sr-only" type="radio" name={`${idPrefix}-origin`} checked={filters.origin === value} onChange={() => onChange({ origin: value })} />
              {value === "" ? t.search.any : originLabel(l, value)}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="border-t border-line pt-5">
        <button
          type="button"
          role="switch"
          aria-checked={filters.priceOnRequest}
          className="flex w-full items-center justify-between gap-4 py-1 text-left"
          onClick={() => onChange({ priceOnRequest: !filters.priceOnRequest })}
        >
          <span>
            <span className="block text-sm">{t.search.priceToggle}</span>
            <span className="mt-1 block text-xs leading-relaxed text-muted">{t.search.priceHelp}</span>
          </span>
          <span className={`relative h-7 w-12 shrink-0 rounded-full ${filters.priceOnRequest ? "bg-ink" : "bg-line-strong"}`} aria-hidden="true">
            <span className={`absolute top-0.5 size-6 rounded-full bg-white ${filters.priceOnRequest ? "left-5" : "left-0.5"}`} />
          </span>
        </button>
      </div>
    </form>
  );
}

function GradeScale({
  label,
  options,
  from,
  to,
  any,
  onChange,
}: {
  label: string;
  options: readonly string[];
  from: string;
  to: string;
  any: string;
  onChange: (from: string, to: string) => void;
}) {
  const a = from ? options.indexOf(from) : -1;
  const b = to ? options.indexOf(to) : -1;
  const lo = a < 0 || b < 0 ? -1 : Math.min(a, b);
  const hi = a < 0 || b < 0 ? -1 : Math.max(a, b);
  const summary = from && to ? (from === to ? from : `${from}–${to}`) : any;
  return (
    <fieldset>
      <legend className="text-[11px] uppercase tracking-[0.18em] text-muted">{label}</legend>
      <p className="mt-2 text-sm">{summary}</p>
      <div className="mt-2 grid grid-cols-5 gap-1.5">
        {options.map((option, index) => {
          const on = lo >= 0 && index >= lo && index <= hi;
          return (
            <button
              key={option}
              type="button"
              className="chip px-1"
              aria-pressed={on}
              onClick={() => {
                const next = nextGradeRange(from, to, option, options);
                onChange(next.from, next.to);
              }}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function Chips<T extends string>({
  legend,
  note,
  options,
  selected,
  label,
  onToggle,
}: {
  legend: string;
  note?: string;
  options: readonly T[];
  selected: T[];
  label: (value: T) => string;
  onToggle: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="text-[11px] uppercase tracking-[0.18em] text-muted">{legend}</legend>
      {note ? <p className="mt-2 text-xs leading-relaxed text-muted">{note}</p> : null}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button key={option} type="button" className="chip" aria-pressed={selected.includes(option)} onClick={() => onToggle(option)}>
            {label(option)}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function activeChips(filters: FilterState, l: Locale): { key: string; label: string; clear: Partial<FilterState> }[] {
  const t = dict(l);
  const chips: { key: string; label: string; clear: Partial<FilterState> }[] = [];
  filters.shapes.forEach((shape: Shape) => {
    chips.push({ key: `shape-${shape}`, label: shapeLabel(l, shape), clear: { shapes: filters.shapes.filter((s) => s !== shape) } });
  });
  if (filters.caratMin || filters.caratMax) {
    const label = [filters.caratMin, filters.caratMax].filter(Boolean).join("–");
    chips.push({ key: "carat", label: `${t.search.carat} ${label}`, clear: { caratMin: "", caratMax: "" } });
  }
  if (filters.colorFrom || filters.colorTo) {
    chips.push({ key: "color", label: `${t.search.color} ${filters.colorFrom || "D"}–${filters.colorTo || "M"}`, clear: { colorFrom: "", colorTo: "" } });
  }
  if (filters.clarityFrom || filters.clarityTo) {
    chips.push({ key: "clarity", label: `${t.search.clarity} ${filters.clarityFrom || "FL"}–${filters.clarityTo || "I3"}`, clear: { clarityFrom: "", clarityTo: "" } });
  }
  filters.cuts.forEach((grade) => chips.push({ key: `cut-${grade}`, label: gradeLabel(l, grade), clear: { cuts: filters.cuts.filter((g) => g !== grade) } }));
  filters.polishes.forEach((grade) => chips.push({ key: `polish-${grade}`, label: `${t.search.polish} ${gradeLabel(l, grade)}`, clear: { polishes: filters.polishes.filter((g) => g !== grade) } }));
  filters.symmetries.forEach((grade) => chips.push({ key: `sym-${grade}`, label: `${t.search.symmetry} ${gradeLabel(l, grade)}`, clear: { symmetries: filters.symmetries.filter((g) => g !== grade) } }));
  filters.fluorescences.forEach((grade) => chips.push({ key: `fl-${grade}`, label: fluorLabel(l, grade), clear: { fluorescences: filters.fluorescences.filter((g) => g !== grade) } }));
  filters.labs.forEach((lab) => chips.push({ key: `lab-${lab}`, label: labLabel(l, lab), clear: { labs: filters.labs.filter((g) => g !== lab) } }));
  if (filters.origin) chips.push({ key: "origin", label: originLabel(l, filters.origin), clear: { origin: "" } });
  if (!filters.priceOnRequest) chips.push({ key: "por", label: t.search.priceOffChip, clear: { priceOnRequest: true } });
  return chips;
}
