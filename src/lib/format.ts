type Lang = "de" | "en";

export function formatCarat(n: number, l: Lang) {
  return new Intl.NumberFormat(l === "de" ? "de-DE" : "en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

export function formatMm(n: number, l: Lang) {
  return new Intl.NumberFormat(l === "de" ? "de-DE" : "en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

export function formatPct(n: number, l: Lang) {
  return `${new Intl.NumberFormat(l === "de" ? "de-DE" : "en-GB", { maximumFractionDigits: 1 }).format(n)} %`;
}

export function measurements(length: number, width: number, depth: number, l: Lang) {
  return `${formatMm(length, l)} × ${formatMm(width, l)} × ${formatMm(depth, l)} mm`;
}
