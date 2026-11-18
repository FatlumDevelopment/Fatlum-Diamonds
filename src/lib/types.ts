export const SHAPES = ["round", "princess", "cushion", "oval", "emerald", "pear", "marquise", "radiant", "asscher", "heart"] as const;
export const COLORS = ["D", "E", "F", "G", "H", "I", "J", "K", "L", "M"] as const;
export const CLARITIES = ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "I1", "I2", "I3"] as const;
export const GRADES = ["Excellent", "Very Good", "Good", "Fair"] as const;
export const FLUORESCENCE = ["None", "Faint", "Medium", "Strong", "Very Strong"] as const;
export const LABS = ["GIA", "IGI", "HRD"] as const;
export const ORIGINS = ["natural", "lab"] as const;

export type Shape = (typeof SHAPES)[number];
export type ColorGrade = (typeof COLORS)[number];
export type Clarity = (typeof CLARITIES)[number];
export type Grade = (typeof GRADES)[number];
export type Fluorescence = (typeof FLUORESCENCE)[number];
export type Lab = (typeof LABS)[number];
export type Origin = (typeof ORIGINS)[number];

export type Stone = {
  id: string;
  sku: string;
  slug: string;
  shape: Shape;
  carat: number;
  color: ColorGrade;
  clarity: Clarity;
  cut: Grade | null;
  polish: Grade;
  symmetry: Grade;
  fluorescence: Fluorescence;
  cert_lab: Lab;
  cert_number: string;
  origin: Origin;
  length_mm: number;
  width_mm: number;
  depth_mm: number;
  table_pct: number;
  depth_pct: number;
  in_stock: boolean;
  is_example: boolean;
  is_active: boolean;
  example_marker: "EXAMPLE";
};

export type Catalog = { stones: Stone[]; source: "supabase" | "fallback" };

export type RequestDraft = {
  slug: string;
  sku: string;
  shape: Shape;
  carat: number;
  color: ColorGrade;
  clarity: Clarity;
  cut: Grade | null;
  cert_lab: Lab;
  cert_number: string;
  origin: Origin;
};
