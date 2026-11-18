import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DiamondShape } from "@/components/diamond-shape";
import { SiteShell } from "@/components/chrome";
import { StoneActions } from "@/components/stone-actions";
import { formatCarat, formatPct, measurements } from "@/lib/format";
import { dict, fluorLabel, gradeLabel, isLocale, originLabel, shapeLabel, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { getCatalog, getStone } from "@/lib/stones";
import type { Stone } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const l: Locale = isLocale(locale) ? locale : "de";
  const { stone } = await getStone(slug);
  const title = stone ? `${shapeLabel(l, stone.shape)} ${formatCarat(stone.carat, l)} ct ${stone.color} ${stone.clarity}` : dict(l).detail.notFound;
  return pageMeta(l, title, dict(l).exampleBanner, `/diamanten/${slug}`);
}

function rows(stone: Stone, l: Locale) {
  const t = dict(l);
  const ratio = stone.width_mm ? (stone.length_mm / stone.width_mm) : 0;
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
    [t.specs.lab, stone.cert_lab],
    [t.specs.cert, stone.cert_number],
    [t.specs.sku, stone.sku],
  ] as const;
}

export default async function DetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const { stone } = await getStone(slug);
  if (!stone) notFound();
  const t = dict(locale);
  const name = `${shapeLabel(locale, stone.shape)} ${formatCarat(stone.carat, locale)} ct`;
  const related = (await getCatalog()).stones.filter((s) => s.shape === stone.shape && s.slug !== stone.slug).slice(0, 3);
  return (
    <SiteShell l={locale}>
      <main id="content" className="mx-auto max-w-7xl px-4 py-8">
        <nav className="text-xs text-gray-500" aria-label={t.breadcrumb}>
          <Link href={`/${locale}`} className="hover:text-gold">{t.home}</Link>
          {" · "}
          <Link href={`/${locale}/diamanten`} className="hover:text-gold">{t.nav.search}</Link>
          {" · "}
          <span className="text-navy">{name}</span>
        </nav>
        <div className="mt-4 rounded border border-dashed border-amber-500 bg-amber-50 p-4 text-sm text-amber-950">{t.exampleBanner}</div>
        <div className="mt-8 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <DiamondShape shape={stone.shape} title={name} idSuffix={stone.sku} className="rounded-xl border border-gold/30 bg-cream" />
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-serif text-4xl text-navy md:text-5xl">{name}</h1>
              {stone.is_example && <span className="rounded bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-900">{t.exampleBadge}</span>}
            </div>
            <p className="mt-2 text-gray-600">{stone.color} · {stone.clarity} · {originLabel(locale, stone.origin)} · {stone.cert_lab}</p>
            <p className="mt-2 text-sm text-gray-500">{t.noPrices}</p>
            <h2 className="mt-8 font-serif text-2xl text-navy">{t.detail.specs}</h2>
            <dl className="mt-3 divide-y divide-gray-200 border-y border-gray-200">
              {rows(stone, locale).map(([label, value]) => (
                <div key={label} className="grid grid-cols-2 gap-3 py-2 text-sm">
                  <dt className="text-gray-500">{label}</dt>
                  <dd className="text-navy">{value}</dd>
                </div>
              ))}
            </dl>
            <h2 className="mt-8 font-serif text-2xl text-navy">{t.detail.certificate}</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">{t.detail.certificateBody}</p>
            <p className="mt-2 text-sm font-medium text-navy">{stone.cert_lab} · {stone.cert_number}</p>
            <div className="mt-6 max-w-sm"><StoneActions stone={stone} l={locale} /></div>
          </div>
        </div>
        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="font-serif text-2xl text-navy">{shapeLabel(locale, stone.shape)}</h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-3">
              {related.map((other) => (
                <li key={other.slug}>
                  <Link href={`/${locale}/diamanten/${other.slug}`} className="block rounded-lg border border-gray-200 p-3 hover:border-gold">
                    <p className="font-serif text-xl text-navy">{formatCarat(other.carat, locale)} ct · {other.color} {other.clarity}</p>
                    <p className="text-xs text-gray-500">{other.cert_lab} · {other.sku}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
        <p className="mt-10"><Link href={`/${locale}/diamanten`} className="text-sm text-secondary underline">{t.detail.back}</Link></p>
      </main>
    </SiteShell>
  );
}
