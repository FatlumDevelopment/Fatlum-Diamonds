import type { Shape } from "@/lib/types";

const PATHS: Record<Shape, string> = {
  round: "M100 18 A82 82 0 1 1 99.9 18 Z",
  princess: "M46 46 H154 V154 H46 Z",
  cushion: "M78 36 H122 Q164 36 164 78 V122 Q164 164 122 164 H78 Q36 164 36 122 V78 Q36 36 78 36 Z",
  oval: "M100 18 C148 18 170 56 170 100 C170 144 148 182 100 182 C52 182 30 144 30 100 C30 56 52 18 100 18 Z",
  emerald: "M70 28 H130 L172 64 V136 L130 172 H70 L28 136 V64 Z",
  pear: "M100 20 C152 56 168 112 100 182 C32 112 48 56 100 20 Z",
  marquise: "M100 14 C158 52 172 100 100 186 C28 100 42 52 100 14 Z",
  radiant: "M58 34 H142 L174 66 V134 L142 166 H58 L26 134 V66 Z",
  asscher: "M64 34 H136 L166 64 V136 L136 166 H64 L34 136 V64 Z",
  heart: "M100 172 C26 118 28 68 62 50 C82 40 96 54 100 72 C104 54 118 40 138 50 C172 68 174 118 100 172 Z",
};

export function Mark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M16 3.5 27 12.2 16 28.5 5 12.2 Z" fill="none" stroke="currentColor" strokeWidth="1.15" />
      <path d="M5 12.2h22M11.2 12.2 16 28.5 20.8 12.2M16 3.5 11.2 12.2M16 3.5 20.8 12.2" fill="none" stroke="currentColor" strokeWidth="0.75" />
    </svg>
  );
}

export function DiamondShape({
  shape,
  title,
  className = "",
  decorative = false,
}: {
  shape: Shape;
  title?: string;
  className?: string;
  decorative?: boolean;
}) {
  const labelled = !decorative;
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      aria-hidden={decorative || undefined}
      role={labelled ? "img" : undefined}
      aria-label={labelled ? title || shape : undefined}
    >
      <path d={PATHS[shape]} fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1.6" />
      <path d="M100 42 148 78 100 164 52 78 Z" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.55" />
      <path d="M52 78h96M100 42v122" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.45" />
    </svg>
  );
}
