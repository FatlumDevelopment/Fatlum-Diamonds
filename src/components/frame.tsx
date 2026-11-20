import Link from "next/link";
import { dict, type Locale } from "@/lib/i18n";

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-5 md:px-8 ${className}`}>{children}</div>;
}

export function Main({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <main id="content" tabIndex={-1} className={`pb-24 outline-none ${className}`}>
      {children}
    </main>
  );
}

export function PageHeader({ eyebrow, title, lede }: { eyebrow?: string; title: string; lede?: string }) {
  return (
    <header className="max-w-3xl">
      {eyebrow ? <p className="text-[11px] uppercase tracking-[0.22em] text-muted">{eyebrow}</p> : null}
      <h1 className="mt-3 font-serif text-[2.65rem] font-normal leading-[1.02] text-ink md:text-6xl">{title}</h1>
      {lede ? <p className="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">{lede}</p> : null}
    </header>
  );
}

export function SpecimenNote({ l, show }: { l: Locale; show: boolean }) {
  if (!show) return null;
  return (
    <p data-testid="example-banner" className="max-w-2xl text-[13px] leading-relaxed text-muted">
      {dict(l).exampleBanner}
    </p>
  );
}

export function Crumbs({ l, items }: { l: Locale; items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label={dict(l).breadcrumb}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-2">
            {i > 0 ? <span aria-hidden="true">/</span> : null}
            {item.href ? (
              <Link href={item.href} className="underline decoration-line underline-offset-4 hover:decoration-ink">
                {item.label}
              </Link>
            ) : (
              <span className="text-ink">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
