import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DiamondMedia, StudioPhoto } from "@/components/media";
import { Container, JsonLd, Main } from "@/components/frame";
import { topicCards } from "@/lib/content";
import { formatCarat } from "@/lib/format";
import { dict, isLocale, labLabel, shapeLabel, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { studio } from "@/lib/images";
import { ADDRESS, FAMILY, siteUrl } from "@/lib/site";
import { getCatalog } from "@/lib/stones";
import { SHAPES, type Shape, type Stone } from "@/lib/types";

export const dynamic = "force-dynamic";

const FEATURED: Shape[] = ["round", "oval", "emerald", "pear"];
const GUIDES = ["4c", "zertifikate", "kaufberatung"];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "de";
  const t = dict(l);
  return pageMeta(l, t.hero.title, t.hero.lede, "");
}

function pickFeatured(stones: Stone[]) {
  return FEATURED.map((shape) => stones.filter((s) => s.shape === shape).sort((a, b) => b.carat - a.carat)[0]).filter((s): s is Stone => !!s);
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l: Locale = locale;
  const t = dict(l);
  const { stones } = await getCatalog();
  const featured = pickFeatured(stones);
  const cards = topicCards(l).filter((card) => GUIDES.includes(card.slug));
  const base = siteUrl();
  return (
    <Main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "JewelryStore",
          name: "Fatlum Diamonds",
          url: `${base}/${l}`,
          telephone: "+49892050085858",
          email: "info@fatlum.diamonds",
          image: `${base}/opengraph-image`,
          address: {
            "@type": "PostalAddress",
            streetAddress: ADDRESS.street,
            postalCode: ADDRESS.postal,
            addressLocality: ADDRESS.city,
            addressCountry: "DE",
          },
          parentOrganization: { "@type": "Organization", name: "Fatlum" },
        }}
      />
      <Container className="pb-4 pt-8 md:pt-14">
        <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div className="order-2 lg:order-1">
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted">{t.hero.eyebrow}</p>
            <h1 className="rise mt-4 max-w-xl font-serif text-[2.75rem] font-normal leading-[0.98] md:text-7xl">{t.hero.title}</h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted md:text-lg">{t.hero.lede}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={`/${l}/diamanten`} className="btn btn-solid">{t.hero.cta}</Link>
              <Link href={`/${l}/wissen/4c`} className="btn btn-line">{t.hero.secondary}</Link>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="border border-line bg-white">
              <StudioPhoto
                src={studio.heroBrilliant.src}
                width={studio.heroBrilliant.width}
                height={studio.heroBrilliant.height}
                priority
                sizes="(min-width: 1024px) 46vw, 92vw"
                alt={l === "de" ? "Runder Brillant, Studioaufnahme auf Weiß" : "Round brilliant, studio photograph on white"}
                className="h-auto w-full"
              />
            </div>
          </div>
        </section>
      </Container>

      <section aria-labelledby="trust-title" className="mt-14 border-y border-line md:mt-20">
        <h2 id="trust-title" className="sr-only">{t.trustTitle}</h2>
        <Container>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-4">
            {t.trust.map(([title, body], index) => (
              <li key={title} className="border-line py-8 sm:px-6 lg:border-l lg:first:border-l-0 lg:first:pl-0">
                <p className="text-[11px] tracking-[0.18em] text-muted">0{index + 1}</p>
                <p className="mt-3 font-serif text-3xl font-normal">{title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Container>
        <section className="py-16 md:py-24">
          <div className="max-w-2xl">
            <h2 className="font-serif text-4xl font-normal md:text-5xl">{t.shapesTitle}</h2>
            <p className="mt-3 text-muted">{t.shapesIntro}</p>
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {SHAPES.map((shape) => (
              <li key={shape}>
                <Link href={`/${l}/diamanten?shape=${shape}`} className="block border border-line bg-white text-center text-ink hover:border-ink">
                  <DiamondMedia shape={shape} alt="" decorative sizes="(min-width: 1024px) 18vw, 46vw" />
                  <span className="flex min-h-11 items-center justify-center px-2 text-sm">{shapeLabel(l, shape)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-t border-line py-16 md:py-24">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-serif text-4xl font-normal md:text-5xl">{t.featuredTitle}</h2>
            <Link href={`/${l}/diamanten`} className="inline-flex min-h-11 items-center text-sm underline underline-offset-4">{t.featuredLink}</Link>
          </div>
          <ul className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((stone) => (
              <li key={stone.slug}>
                <Link href={`/${l}/diamanten/${stone.slug}`} className="group block">
                  <span className="block border border-line">
                    <DiamondMedia shape={stone.shape} slug={stone.slug} alt="" decorative sizes="(min-width: 1024px) 24vw, (min-width: 640px) 46vw, 92vw" />
                  </span>
                  <span className="mt-4 block font-serif text-2xl font-normal group-hover:underline">{shapeLabel(l, stone.shape)} {formatCarat(stone.carat, l)} ct</span>
                  <span className="mt-1 block text-sm text-muted">{stone.color} · {stone.clarity} · {labLabel(l, stone.cert_lab)}</span>
                  <span className="mt-2 block font-serif text-xl">{t.priceOnRequest}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-t border-line py-16 md:py-24">
          <div className="border border-line bg-white">
            <StudioPhoto
              src={studio.heroLoose.src}
              width={studio.heroLoose.width}
              height={studio.heroLoose.height}
              sizes="(min-width: 1024px) 1100px, 92vw"
              alt={l === "de" ? "Lose Diamanten in sechs Schliffformen" : "Loose diamonds in six shapes"}
              className="h-auto w-full"
            />
          </div>
          <h2 className="mt-14 font-serif text-4xl font-normal md:mt-16 md:text-5xl">{t.stepsTitle}</h2>
          <ol className="mt-8 grid gap-8 md:grid-cols-3">
            {t.steps.map(([title, body], index) => (
              <li key={title}>
                <p className="text-[11px] tracking-[0.18em] text-muted">0{index + 1}</p>
                <h3 className="mt-3 font-serif text-3xl font-normal">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-t border-line py-16 md:py-24">
          <div className="max-w-2xl">
            <h2 className="font-serif text-4xl font-normal md:text-5xl">{t.learnTitle}</h2>
            <p className="mt-3 text-muted">{t.learnIntro}</p>
          </div>
          <ul className="mt-8 grid gap-px bg-line md:grid-cols-3">
            {cards.map((card) => (
              <li key={card.slug} className="bg-paper">
                <Link href={`/${l}/wissen/${card.slug}`} className="flex h-full min-h-44 flex-col py-6 pr-6 hover:bg-white">
                  <h3 className="font-serif text-3xl font-normal">{card.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{card.intro}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-t border-line py-16 md:py-24">
          <div className="max-w-2xl">
            <h2 className="font-serif text-4xl font-normal md:text-5xl">{t.sistersTitle}</h2>
            <p className="mt-3 text-muted">{t.sistersBody}</p>
          </div>
          <ul className="mt-8 border-y border-line">
            <li className="border-b border-line">
              <a className="flex min-h-16 items-center justify-between text-lg" href={`${FAMILY.gold}/${l}`}>
                {t.family.gold}<span aria-hidden="true">→</span>
              </a>
            </li>
            <li>
              <a className="flex min-h-16 items-center justify-between text-lg" href={`${FAMILY.jewelry}/${l}`}>
                {t.family.jewelry}<span aria-hidden="true">→</span>
              </a>
            </li>
          </ul>
        </section>

        <section className="border-t border-line py-16 md:py-24">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted">{t.closing.eyebrow}</p>
          <h2 className="mt-4 max-w-xl font-serif text-4xl font-normal md:text-6xl">{t.closing.title}</h2>
          <Link href={`/${l}/diamanten`} className="btn btn-solid mt-8">{t.hero.cta}</Link>
        </section>
      </Container>
    </Main>
  );
}
