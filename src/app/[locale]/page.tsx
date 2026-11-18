import Link from "next/link";
import type { Metadata } from "next";
import { DiamondShape } from "@/components/diamond-shape";
import { SiteShell } from "@/components/chrome";
import { topicCards } from "@/lib/content";
import { formatCarat } from "@/lib/format";
import { dict, isLocale, shapeLabel, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { ADDRESS, FAMILY } from "@/lib/site";
import { getCatalog } from "@/lib/stones";
import { SHAPES, type Stone } from "@/lib/types";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "de";
  const t = dict(l);
  return pageMeta(l, t.hero.title, t.hero.lede, "");
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l: Locale = locale;
  const t = dict(l);
  const { stones } = await getCatalog();
  const featured = SHAPES.map((shape) => stones.find((s) => s.shape === shape)).filter((s): s is Stone => !!s).slice(0, 5);
  const cards = topicCards(l);
  return (
    <SiteShell l={l}>
      <main id="content">
        <section className="bg-gradient-to-r from-navy via-secondary to-navy text-white">
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-14 md:grid-cols-[1.3fr_0.7fr] md:py-20">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-gold">{t.hero.eyebrow}</p>
              <h1 className="mt-3 font-serif text-5xl text-gold md:text-6xl">{t.hero.title}</h1>
              <p className="mt-4 max-w-xl text-white/85">{t.hero.lede}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/${l}/diamanten`} className="rounded bg-gold px-5 py-2.5 font-medium text-navy hover:bg-gold-light">{t.hero.cta}</Link>
                <Link href={`/${l}/wissen/4c`} className="rounded border border-white/30 px-5 py-2.5 hover:border-gold hover:text-gold">{t.hero.secondary}</Link>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3" aria-hidden="true">
              {(["round", "oval", "emerald"] as const).map((shape) => (
                <DiamondShape key={shape} shape={shape} idSuffix={`hero-${shape}`} className="rounded-lg bg-white/5" />
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4">
          <section className="mt-10 grid gap-4 rounded-xl border border-gold/30 bg-cream p-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.trust.map(([title, body]) => (
              <div key={title}><p className="font-serif text-xl text-navy">{title}</p><p className="mt-1 text-sm text-gray-600">{body}</p></div>
            ))}
          </section>

          <section className="mt-14">
            <h2 className="font-serif text-3xl text-navy">{t.shapesTitle}</h2>
            <p className="mt-2 max-w-2xl text-sm text-gray-600">{t.shapesIntro}</p>
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {SHAPES.map((shape) => (
                <li key={shape}>
                  <Link href={`/${l}/diamanten?shape=${shape}`} className="block rounded-lg border border-gray-200 p-3 hover:border-gold">
                    <DiamondShape shape={shape} title={shapeLabel(l, shape)} idSuffix={`home-${shape}`} className="h-24 w-full" />
                    <span className="mt-2 block text-center font-serif text-lg text-navy">{shapeLabel(l, shape)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-serif text-3xl text-navy">{t.featuredTitle}</h2>
              <Link href={`/${l}/diamanten`} className="text-sm text-secondary underline">{t.nav.search}</Link>
            </div>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {featured.map((stone) => (
                <li key={stone.slug} className="rounded-lg border border-gray-200 p-3">
                  <Link href={`/${l}/diamanten/${stone.slug}`}>
                    <DiamondShape shape={stone.shape} title={shapeLabel(l, stone.shape)} idSuffix={stone.sku} className="h-32 w-full rounded bg-cream" />
                    <p className="mt-2 font-serif text-lg text-navy">{shapeLabel(l, stone.shape)} {formatCarat(stone.carat, l)} ct</p>
                    <p className="text-xs text-gray-500">{stone.color} · {stone.clarity} · {stone.cert_lab}</p>
                    <p className="mt-1 text-[10px] font-semibold text-amber-800">{t.exampleBadge}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14">
            <h2 className="font-serif text-3xl text-navy">{t.learnTitle}</h2>
            <p className="mt-2 max-w-2xl text-sm text-gray-600">{t.learnIntro}</p>
            <ul className="mt-6 grid gap-4 md:grid-cols-3">
              {cards.map((card) => (
                <li key={card.slug} className="rounded-lg border border-gray-200 p-5">
                  <h3 className="font-serif text-2xl text-navy"><Link href={`/${l}/wissen/${card.slug}`} className="hover:text-secondary">{card.title}</Link></h3>
                  <p className="mt-2 text-sm text-gray-600">{card.intro}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14 rounded-xl bg-navy px-6 py-8 text-white">
            <h2 className="font-serif text-3xl text-gold">{t.sistersTitle}</h2>
            <p className="mt-3 max-w-2xl text-white/80">{t.sistersBody}</p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <a className="rounded-full border border-gold/60 px-4 py-2 hover:bg-gold hover:text-navy" href={`${FAMILY.gold}/${l}`}>{t.family.gold}</a>
              <a className="rounded-full border border-gold/60 px-4 py-2 hover:bg-gold hover:text-navy" href={`${FAMILY.jewelry}/${l}`}>{t.family.jewelry}</a>
              <span className="rounded-full bg-gold px-4 py-2 text-navy">{t.family.diamonds}</span>
            </div>
            <p className="mt-6 text-sm text-white/70">{ADDRESS.street}, {ADDRESS.postal} {ADDRESS.city}</p>
          </section>
        </div>
      </main>
    </SiteShell>
  );
}
