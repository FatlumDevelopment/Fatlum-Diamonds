import Image from "next/image";
import { DiamondShape } from "./diamond-shape";
import { mediaFor, shapeImage } from "@/lib/images";
import type { Shape } from "@/lib/types";

const SIZES = {
  card: "(min-width: 1280px) 300px, (min-width: 640px) 46vw, 92vw",
  detail: "(min-width: 1024px) 560px, 92vw",
  thumb: "112px",
  shape: "(min-width: 1024px) 18vw, 46vw",
} as const;

export function DiamondMedia({
  shape,
  slug,
  alt,
  className = "",
  priority = false,
  decorative = false,
  sizes = SIZES.card,
}: {
  shape: Shape;
  slug?: string;
  alt: string;
  className?: string;
  priority?: boolean;
  decorative?: boolean;
  sizes?: string;
}) {
  const src = slug ? mediaFor({ slug, shape }) : shapeImage[shape];
  return (
    <div className={`relative aspect-square overflow-hidden bg-white text-ink ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={decorative ? "" : alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-contain"
        />
      ) : (
        <DiamondShape shape={shape} title={alt} decorative={decorative || !alt} className="h-[72%] w-[72%]" />
      )}
    </div>
  );
}

export function StudioPhoto({
  src,
  alt,
  width,
  height,
  priority = false,
  sizes,
  className = "",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  sizes: string;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes={sizes}
      className={className}
    />
  );
}
