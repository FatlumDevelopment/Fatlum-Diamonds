import type { Shape } from "./types";

/**
 * Original studio photographs, one frame per shape.
 * Files are normalised to a pure white field and stored as WebP.
 * next/image serves AVIF to browsers that accept it, and WebP otherwise.
 *
 * A later per-stone photograph belongs at /images/products/<slug>.webp
 * and is registered in `productImage`. Until then every stone of a shape
 * uses that shape's frame. Search filters keep the line icons.
 */
export const shapeImage: Record<Shape, string> = {
  round: "/images/shapes/round.webp",
  princess: "/images/shapes/princess.webp",
  cushion: "/images/shapes/cushion.webp",
  oval: "/images/shapes/oval.webp",
  emerald: "/images/shapes/emerald.webp",
  pear: "/images/shapes/pear.webp",
  marquise: "/images/shapes/marquise.webp",
  radiant: "/images/shapes/radiant.webp",
  asscher: "/images/shapes/asscher.webp",
  heart: "/images/shapes/heart.webp",
};

/** slug -> /images/products/<slug>.webp once that file exists. */
export const productImage: Record<string, string> = {};

export const studio = {
  heroBrilliant: { src: "/images/heroes/brilliant.webp", width: 1280, height: 720 },
  heroLoose: { src: "/images/heroes/loose-diamonds.webp", width: 1280, height: 720 },
  certificate: { src: "/images/studio/certificate.webp", width: 1024, height: 1024 },
  tweezers: { src: "/images/studio/tweezers.webp", width: 1024, height: 1024 },
  gold: { src: "/images/houses/gold.webp", width: 1280, height: 720 },
  jewelry: { src: "/images/houses/jewelry.webp", width: 1280, height: 720 },
} as const;

export function mediaFor(stone: { slug: string; shape: Shape }): string {
  return productImage[stone.slug] ?? shapeImage[stone.shape];
}
