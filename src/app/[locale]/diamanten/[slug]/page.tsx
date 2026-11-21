import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DiamondMedia, StudioPhoto } from "@/components/media";
import { StoneActions } from "@/components/stone-actions";
import { Container, Crumbs, JsonLd, Main, SpecimenNote } from "@/components/frame";
import { formatCarat } from "@/lib/format";
import { dict, isLocale, labLabel, originLabel, shapeLabel, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { studio } from "@/lib/images";
import { ringConfiguratorUrl, siteUrl } from "@/lib/site";
import { specRows } from "@/lib/specs";
import { getCatalog, getStone } from "@/lib/stones";
import type { Stone } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const l: Locale = isLocale(locale) ? locale : "de";
  const { stone } = await getStone(slug);
  if (!stone) return pageMeta(l, dict(l).detail.notFound, dict(l).detail.notFound, `/diamanten/${slug}`);
  const name = `${shapeLabel(l, stone.shape)} ${formatCarat(stone.carat, l)} ct`;
  const description = l === "de"
    ? `${name}, Farbe ${stone.color}, Reinheit ${stone.clarity}, ${labLabel(l, stone.cert_lab)}. Preis auf Anfrage bei Fatlum Diamonds in München.`
    : `${name}, colour ${stone.color}, clarity ${stone.clarity}, ${labLabel(l, stone.cert_lab)}. Price on request from Fatlum Diamonds in Munich.`;
  return pageMeta(l, name, description, `/diamanten/${slug}`);
}

export default async function DetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const { stone } = await getStone(slug);
  if (!stone) notFound();
  const t = dict(locale);
  const name = `${shapeLabel(locale, stone.shape)} ${formatCarat(stone.carat, locale)} ct`;
  const catalog = (await getCatalog()).stones;
  const related = ["round", "oval", "emerald", "pear", "cushion", "princess"]
    .filter((shape) => shape !== stone.shape)
    .map((shape) => catalog.find((s) => s.shape === shape))
    .filter((s): s is Stone => !!s)
    .slice(0, 3);
  const ring = ringConfiguratorUrl(locale, stone);
  const rows = specRows(stone, locale);
  return (
    <Main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name,
          sku: stone.sku,
          brand: { "@type": "Brand", name: "Fatlum Diamonds" },
          category: "Loose diamond",
          description: t.priceOnRequest,
          url: `${siteUrl()}/${locale}/diamanten/${stone.slug}`,
          additionalProperty: rows.map(([name, value]) => ({ "@type": "PropertyValue", name, value })),
        }}
      />
      <Container className="py-8 md:py-12">
        <Crumbs
          l={locale}
          items={[
            { href: `/${locale}`, label: t.home },
            { href: `/${locale}/diamanten`, label: t.nav.search },
            { label: name },
          ]}
        />
        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="lg:sticky lg:top-[calc(var(--header-offset)+1.5rem)] lg:self-start">
            <div className="border border-line">
              <DiamondMedia shape={stone.shape} slug={stone.slug} alt={name} priority sizes="(min-width: 1024px) 50vw, 92vw" />
            </div>
          </div>
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h1 className="font-serif text-[2.65rem] font-normal leading-[1.02] md:text-6xl">{name}</h1>
              {stone.is_example ? <span className="text-[10px] tracking-[0.16em] text-muted">{t.exampleBadge}</span> : null}
            </div>
            <p className="mt-4 text-muted">{stone.color} · {stone.clarity} · {originLabel(locale, stone.origin)} · {labLabel(locale, stone.cert_lab)}</p>
            <p className="mt-6 font-serif text-4xl font-normal">{t.priceOnRequest}</p>
            {stone.is_example ? <div className="mt-4"><SpecimenNote l={locale} show /></div> : null}
            <div className="mt-8 max-w-md">
              <StoneActions stone={stone} l={locale} />
              <a href={ring} className="mt-6 flex min-h-12 flex-col justify-center border-t border-line pt-4">
                <span className="text-sm underline underline-offset-4">{t.detail.setInRing}</span>
                <span className="mt-1 text-xs text-muted">{t.detail.setInRingNote}</span>
              </a>
            </div>

            <h2 className="mt-14 font-serif text-3xl font-normal">{t.detail.specs}</h2>
            <dl className="mt-4 border-t border-line">
              {rows.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-3 border-b border-line py-3 text-sm">
                  <dt className="text-muted">{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>

            <section className="mt-14 border border-line bg-white" aria-labelledby="certificate-title">
              <StudioPhoto
                src={studio.certificate.src}
                width={studio.certificate.width}
                height={studio.certificate.height}
                sizes="(min-width: 1024px) 520px, 92vw"
                alt={locale === "de" ? "Diamant auf einem Zertifikat" : "Diamond on a certificate"}
                className="h-auto w-full"
              />
              <div className="p-6 md:p-8">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted">{labLabel(locale, stone.cert_lab)}</p>
                <h2 id="certificate-title" className="mt-2 font-serif text-3xl font-normal">{t.detail.certificate}</h2>
                <p className="mt-4 text-sm leading-relaxed">{stone.cert_number}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted">{t.detail.certificateLead}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{t.detail.certificateBody}</p>
              </div>
            </section>
          </div>
        </div>

        {related.length > 0 ? (
          <section className="mt-16 border-t border-line pt-12 md:mt-24">
            <h2 className="font-serif text-3xl font-normal md:text-4xl">{t.detail.related}</h2>
            <ul className="mt-6 grid gap-6 sm:grid-cols-3">
              {related.map((other) => (
                <li key={other.slug}>
                  <Link href={`/${locale}/diamanten/${other.slug}`} className="group block">
                    <span className="block border border-line bg-white transition-colors group-hover:border-ink">
                      <DiamondMedia shape={other.shape} slug={other.slug} alt={shapeLabel(locale, other.shape)} eager sizes="(min-width: 640px) 30vw, 92vw" />
                    </span>
                    <span className="mt-3 block font-serif text-2xl group-hover:underline">{formatCarat(other.carat, locale)} ct · {other.color} {other.clarity}</span>
                    <span className="mt-1 block text-sm text-muted">{labLabel(locale, other.cert_lab)} · {t.priceOnRequest}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        <p className="mt-12">
          <Link href={`/${locale}/diamanten`} className="inline-flex min-h-11 items-center text-sm underline underline-offset-4">{t.detail.back}</Link>
        </p>
      </Container>
    </Main>
  );
}
