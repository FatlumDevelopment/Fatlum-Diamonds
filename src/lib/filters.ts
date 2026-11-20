import { CLARITIES, COLORS, FLUORESCENCE, GRADES, LABS, SHAPES, type Clarity, type ColorGrade, type Fluorescence, type Grade, type Lab, type Origin, type Shape, type Stone } from "./types";

export type SortKey = "caratDesc" | "caratAsc" | "color" | "clarity" | "cut";
export type ViewMode = "grid" | "list";

export type FilterState = {
  shapes: Shape[];
  caratMin: string;
  caratMax: string;
  colorFrom: string;
  colorTo: string;
  clarityFrom: string;
  clarityTo: string;
  cuts: Grade[];
  polishes: Grade[];
  symmetries: Grade[];
  fluorescences: Fluorescence[];
  labs: Lab[];
  origin: "" | Origin;
  /** True shows the cabinet. False hides it: this house publishes no prices. */
  priceOnRequest: boolean;
  sort: SortKey;
  view: ViewMode;
};

export const emptyFilters = (): FilterState => ({
  shapes: [],
  caratMin: "",
  caratMax: "",
  colorFrom: "",
  colorTo: "",
  clarityFrom: "",
  clarityTo: "",
  cuts: [],
  polishes: [],
  symmetries: [],
  fluorescences: [],
  labs: [],
  origin: "",
  priceOnRequest: true,
  sort: "caratDesc",
  view: "grid",
});

const asList = (value: string | null) => (value ? value.split(",").map((v) => v.trim()).filter(Boolean) : []);
function pick<T extends string>(values: string[], allowed: readonly T[]): T[] {
  const set = new Set(values);
  return allowed.filter((v) => set.has(v));
}

export function filtersFromParams(sp: URLSearchParams): FilterState {
  const origin = sp.get("origin");
  const sort = sp.get("sort");
  const view = sp.get("view");
  const sorts: SortKey[] = ["caratDesc", "caratAsc", "color", "clarity", "cut"];
  return {
    shapes: pick(asList(sp.get("shape")), SHAPES),
    caratMin: sp.get("caratMin") || "",
    caratMax: sp.get("caratMax") || "",
    colorFrom: COLORS.includes(sp.get("colorFrom") as ColorGrade) ? (sp.get("colorFrom") as string) : "",
    colorTo: COLORS.includes(sp.get("colorTo") as ColorGrade) ? (sp.get("colorTo") as string) : "",
    clarityFrom: CLARITIES.includes(sp.get("clarityFrom") as Clarity) ? (sp.get("clarityFrom") as string) : "",
    clarityTo: CLARITIES.includes(sp.get("clarityTo") as Clarity) ? (sp.get("clarityTo") as string) : "",
    cuts: pick(asList(sp.get("cut")), GRADES),
    polishes: pick(asList(sp.get("polish")), GRADES),
    symmetries: pick(asList(sp.get("symmetry")), GRADES),
    fluorescences: pick(asList(sp.get("fluorescence")), FLUORESCENCE),
    labs: pick(asList(sp.get("lab")), LABS),
    origin: origin === "natural" || origin === "lab" ? origin : "",
    priceOnRequest: sp.get("por") !== "0",
    sort: sorts.includes(sort as SortKey) ? (sort as SortKey) : "caratDesc",
    view: view === "list" ? "list" : "grid",
  };
}

export function filtersToQuery(f: FilterState, compare: string[]): string {
  const p = new URLSearchParams();
  if (f.shapes.length) p.set("shape", f.shapes.join(","));
  if (f.caratMin) p.set("caratMin", f.caratMin);
  if (f.caratMax) p.set("caratMax", f.caratMax);
  if (f.colorFrom) p.set("colorFrom", f.colorFrom);
  if (f.colorTo) p.set("colorTo", f.colorTo);
  if (f.clarityFrom) p.set("clarityFrom", f.clarityFrom);
  if (f.clarityTo) p.set("clarityTo", f.clarityTo);
  if (f.cuts.length) p.set("cut", f.cuts.join(","));
  if (f.polishes.length) p.set("polish", f.polishes.join(","));
  if (f.symmetries.length) p.set("symmetry", f.symmetries.join(","));
  if (f.fluorescences.length) p.set("fluorescence", f.fluorescences.join(","));
  if (f.labs.length) p.set("lab", f.labs.join(","));
  if (f.origin) p.set("origin", f.origin);
  if (!f.priceOnRequest) p.set("por", "0");
  if (f.sort !== "caratDesc") p.set("sort", f.sort);
  if (f.view !== "grid") p.set("view", f.view);
  if (compare.length) p.set("compare", compare.slice(0, 4).join(","));
  const s = p.toString();
  return s ? `?${s}` : "";
}

function inRange(index: number, from: string, to: string, scale: readonly string[]) {
  if (!from && !to) return true;
  if (index < 0) return false;
  const a = from ? scale.indexOf(from) : 0;
  const b = to ? scale.indexOf(to) : scale.length - 1;
  if (a < 0 || b < 0) return true;
  return index >= Math.min(a, b) && index <= Math.max(a, b);
}

export function applyFilters(stones: Stone[], f: FilterState): Stone[] {
  const parseCarat = (value: string) => {
    if (value.trim() === "") return null;
    const n = Number(value.replace(",", "."));
    return Number.isFinite(n) ? n : null;
  };
  const min = parseCarat(f.caratMin);
  const max = parseCarat(f.caratMax);
  const lo = min !== null && max !== null && Number.isFinite(min) && Number.isFinite(max) ? Math.min(min, max) : min;
  const hi = min !== null && max !== null && Number.isFinite(min) && Number.isFinite(max) ? Math.max(min, max) : max;
  const rows = stones.filter((s) => {
    if (!f.priceOnRequest) return false;
    if (f.shapes.length && !f.shapes.includes(s.shape)) return false;
    if (lo !== null && Number.isFinite(lo) && s.carat < lo) return false;
    if (hi !== null && Number.isFinite(hi) && s.carat > hi) return false;
    if (!inRange(COLORS.indexOf(s.color), f.colorFrom, f.colorTo, COLORS)) return false;
    if (!inRange(CLARITIES.indexOf(s.clarity), f.clarityFrom, f.clarityTo, CLARITIES)) return false;
    if (f.cuts.length && (!s.cut || !f.cuts.includes(s.cut))) return false;
    if (f.polishes.length && !f.polishes.includes(s.polish)) return false;
    if (f.symmetries.length && !f.symmetries.includes(s.symmetry)) return false;
    if (f.fluorescences.length && !f.fluorescences.includes(s.fluorescence)) return false;
    if (f.labs.length && !f.labs.includes(s.cert_lab)) return false;
    if (f.origin && s.origin !== f.origin) return false;
    return true;
  });
  const gradeRank = (g: Grade | null) => (g ? GRADES.indexOf(g) : GRADES.length);
  const sorted = [...rows];
  if (f.sort === "caratAsc") sorted.sort((a, b) => a.carat - b.carat);
  if (f.sort === "caratDesc") sorted.sort((a, b) => b.carat - a.carat || a.sku.localeCompare(b.sku));
  if (f.sort === "color") sorted.sort((a, b) => COLORS.indexOf(a.color) - COLORS.indexOf(b.color) || b.carat - a.carat);
  if (f.sort === "clarity") sorted.sort((a, b) => CLARITIES.indexOf(a.clarity) - CLARITIES.indexOf(b.clarity) || b.carat - a.carat);
  if (f.sort === "cut") sorted.sort((a, b) => gradeRank(a.cut) - gradeRank(b.cut) || b.carat - a.carat);
  return sorted;
}

export function activeFilterCount(f: FilterState) {
  return [
    f.shapes.length > 0,
    f.caratMin !== "" || f.caratMax !== "",
    f.colorFrom !== "" || f.colorTo !== "",
    f.clarityFrom !== "" || f.clarityTo !== "",
    f.cuts.length > 0,
    f.polishes.length > 0,
    f.symmetries.length > 0,
    f.fluorescences.length > 0,
    f.labs.length > 0,
    f.origin !== "",
    !f.priceOnRequest,
  ].filter(Boolean).length;
}

export const CARAT_PRESETS = [
  { min: "0.30", max: "0.49" },
  { min: "0.50", max: "0.99" },
  { min: "1.00", max: "1.49" },
  { min: "1.50", max: "1.99" },
  { min: "2.00", max: "" },
] as const;

export function nextGradeRange(from: string, to: string, value: string, scale: readonly string[]) {
  if (!from && !to) return { from: value, to: value };
  if (from === to) {
    if (from === value) return { from: "", to: "" };
    const a = scale.indexOf(from);
    const b = scale.indexOf(value);
    if (a < 0 || b < 0) return { from: value, to: value };
    return { from: scale[Math.min(a, b)] || value, to: scale[Math.max(a, b)] || value };
  }
  return { from: value, to: value };
}
