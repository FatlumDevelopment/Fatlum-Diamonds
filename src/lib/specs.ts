import { formatCarat, formatPct, measurements } from "./format";
import { dict, fluorLabel, gradeLabel, labLabel, originLabel, shapeLabel, type Locale } from "./i18n";
import type { Stone } from "./types";

export function specRows(stone: Stone, l: Locale) {
  const t = dict(l);
  const ratio = stone.width_mm ? stone.length_mm / stone.width_mm : 0;
  return [
    [t.specs.shape, shapeLabel(l, stone.shape)],
    [t.specs.carat, `${formatCarat(stone.carat, l)} ct`],
    [t.specs.color, stone.color],
    [t.specs.clarity, stone.clarity],
    [t.specs.cut, gradeLabel(l, stone.cut)],
    [t.specs.polish, gradeLabel(l, stone.polish)],
    [t.specs.symmetry, gradeLabel(l, stone.symmetry)],
    [t.specs.fluorescence, fluorLabel(l, stone.fluorescence)],
    [t.specs.measurements, measurements(stone.length_mm, stone.width_mm, stone.depth_mm, l)],
    [t.detail.ratio, formatCarat(ratio, l)],
    [t.specs.table, formatPct(stone.table_pct, l)],
    [t.specs.depth, formatPct(stone.depth_pct, l)],
    [t.specs.origin, originLabel(l, stone.origin)],
    [t.specs.lab, labLabel(l, stone.cert_lab)],
    [t.specs.cert, stone.cert_number],
    [t.specs.sku, stone.sku],
  ] as const;
}
