import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const SHAPES = ["round", "princess", "cushion", "oval", "emerald", "pear", "marquise", "radiant", "asscher", "heart"];
const COLORS = ["D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
const CLARITIES = ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "I1", "I2", "I3"];
const GRADES = ["Excellent", "Very Good", "Good", "Fair"];
const FLUOR = ["None", "Faint", "Medium", "Strong", "Very Strong"];
const LABS = ["GIA", "IGI", "HRD"];
const RATIO = {
  round: 1, princess: 1.02, cushion: 1.08, oval: 1.42, emerald: 1.48,
  pear: 1.55, marquise: 1.95, radiant: 1.3, asscher: 1.03, heart: 1.08,
};

const carats = [0.31, 0.42, 0.5, 0.63, 0.71, 0.9, 1.01, 1.2, 1.51, 2.03, 0.38, 0.55, 0.84, 1.08, 1.7, 2.41, 0.47, 0.96, 1.33, 3.02, 0.34, 0.68, 1.15, 1.84, 0.58, 0.77, 1.27, 2.17, 0.45, 0.88, 1.44, 2.71, 0.36, 0.73, 1.06, 1.62, 0.52, 0.81, 1.18, 2.05];

function r2(n) { return Math.round(n * 100) / 100; }

function dims(shape, carat, depthPct) {
  const equiv = 6.5 * Math.cbrt(carat);
  const ratio = RATIO[shape];
  const width = equiv / Math.sqrt(ratio);
  const length = width * ratio;
  const step = shape === "emerald" || shape === "asscher";
  const depth = width * (depthPct / 100) * (step ? 0.72 : 0.98);
  return { length_mm: r2(length), width_mm: r2(width), depth_mm: r2(depth) };
}

const stones = carats.map((carat, i) => {
  const n = i + 1;
  const nn = String(n).padStart(2, "0");
  const shape = SHAPES[i % SHAPES.length];
  const color = COLORS[i % COLORS.length];
  const clarity = CLARITIES[(i * 3) % CLARITIES.length];
  const cut = GRADES[i % 5 === 4 ? 3 : i % 3];
  const polish = GRADES[i % 4 === 3 ? 2 : i % 2];
  const symmetry = GRADES[(i + 1) % 4 === 3 ? 2 : (i + 1) % 2];
  const fluorescence = FLUOR[i % 7 === 0 ? 3 : i % 5 === 0 ? 2 : i % 3 === 0 ? 1 : 0];
  const cert_lab = LABS[i % LABS.length];
  const origin = i % 3 === 0 ? "lab" : "natural";
  const table_pct = 53 + (i % 9);
  const depth_pct = shape === "emerald" || shape === "asscher" ? 64 + (i % 6) : 59 + (i % 6);
  const id = `d1a00000-0000-4000-8000-${String(n).padStart(12, "0")}`;
  const sku = `FD-EX-${nn}`;
  const cert_number = `EXAMPLE-${cert_lab}-${100000 + n}`;
  const slug = `${shape}-${carat.toFixed(2).replace(".", "-")}-${color.toLowerCase()}-${clarity.toLowerCase()}-${cert_lab.toLowerCase()}-${sku.toLowerCase()}`;
  return {
    id, sku, slug, shape, carat: r2(carat), color, clarity, cut, polish, symmetry, fluorescence,
    cert_lab, cert_number, origin, ...dims(shape, carat, depth_pct), table_pct, depth_pct,
    in_stock: true, is_example: true, is_active: true, example_marker: "EXAMPLE",
  };
});

if (stones.length !== 40) throw new Error(`expected 40 stones, got ${stones.length}`);
const skus = new Set(stones.map((s) => s.sku));
const slugs = new Set(stones.map((s) => s.slug));
if (skus.size !== 40 || slugs.size !== 40) throw new Error("duplicate sku or slug");
for (const s of stones) {
  if (s.example_marker !== "EXAMPLE" || !s.cert_number.startsWith("EXAMPLE-") || !s.sku.startsWith("FD-EX-") || !s.is_example) {
    throw new Error("example marking missing");
  }
}

mkdirSync("data", { recursive: true });
writeFileSync("data/stones.json", JSON.stringify(stones, null, 2) + "\n");

const cols = ["id", "sku", "slug", "shape", "carat", "color", "clarity", "cut", "polish", "symmetry", "fluorescence", "cert_lab", "cert_number", "origin", "length_mm", "width_mm", "depth_mm", "table_pct", "depth_pct", "in_stock", "is_example", "is_active", "example_marker"];
const quote = (v) => (typeof v === "string" ? `'${v}'` : typeof v === "boolean" ? (v ? "true" : "false") : String(v));
const values = stones.map((s) => `  (${cols.map((c) => quote(s[c])).join(", ")})`).join(",\n");

const sql = `-- Fatlum Diamonds example catalog. Every row is marked EXAMPLE and is not live stock.
-- Safe to re-run: upserts on sku. Does not touch gold tables.

insert into public.diamond_stones (${cols.join(", ")})
values
${values}
on conflict (sku) do update set
  slug = excluded.slug,
  shape = excluded.shape,
  carat = excluded.carat,
  color = excluded.color,
  clarity = excluded.clarity,
  cut = excluded.cut,
  polish = excluded.polish,
  symmetry = excluded.symmetry,
  fluorescence = excluded.fluorescence,
  cert_lab = excluded.cert_lab,
  cert_number = excluded.cert_number,
  origin = excluded.origin,
  length_mm = excluded.length_mm,
  width_mm = excluded.width_mm,
  depth_mm = excluded.depth_mm,
  table_pct = excluded.table_pct,
  depth_pct = excluded.depth_pct,
  in_stock = excluded.in_stock,
  is_example = excluded.is_example,
  is_active = excluded.is_active,
  example_marker = excluded.example_marker;

notify pgrst, 'reload schema';
`;

mkdirSync(dirname("supabase/migrations/20261118180100_diamond_seed.sql"), { recursive: true });
writeFileSync("supabase/migrations/20261118180100_diamond_seed.sql", sql);
console.log(`wrote ${stones.length} stones`);
