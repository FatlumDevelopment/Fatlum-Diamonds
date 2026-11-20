import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DiamondMedia } from "@/components/media";
import { studio } from "@/lib/images";
import { Container, JsonLd, Main } from "@/components/frame";
import { topicCards } from "@/lib/content";
import { formatCarat } from "@/lib/format";
import { dict, isLocale, labLabel, shapeLabel, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
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
      <section className="bg-white">
        <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[76vh]">
          <Image
            src={studio.heroBrilliant.src}
            alt={l === "de" ? "Runder Brillant" : "Round brilliant"}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-125 md:scale-110"
          />
        </div>
      </section>
      <Container className="py-14 md:py-24">
        <p className="text-[11px] uppercase tracking-[0.28em] text-muted">{t.hero.eyebrow}</p>
        <h1 className="mt-5 max-w-4xl font-serif text-[3.25rem] font-normal leading-[0.92] md:text-8xl">{t.hero.title}</h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">{t.hero.lede}</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href={`/${l}/diamanten`} className="btn btn-solid">{t.hero.cta}</Link>
          <Link href={`/${l}/wissen/4c`} className="btn btn-line">{t.hero.secondary}</Link>
        </div>
      </Container>

      <section aria-labelledby="trust-title" className="border-y border-line">
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
        <section className="py-10 md:py-24">
          <div className="max-w-2xl">
            <h2 className="font-serif text-3xl font-normal md:text-5xl">{t.shapesTitle}</h2>
            <p className="mt-2 text-sm text-muted md:mt-3 md:text-base">{t.shapesIntro}</p>
          </div>
          <ul className="-mx-5 mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 md:mx-0 md:mt-8 md:grid md:grid-cols-5 md:gap-3 md:overflow-visible md:px-0 md:pb-0">
            {SHAPES.map((shape) => (
              <li key={shape} className="w-[42vw] max-w-52 shrink-0 snap-start md:w-auto md:max-w-none">
                <Link href={`/${l}/diamanten?shape=${shape}`} className="group block border border-line bg-white text-center text-ink transition-colors hover:border-ink">
                  <DiamondMedia shape={shape} alt="" decorative eager sizes="(min-width: 768px) 18vw, 42vw" />
                  <span className="flex min-h-11 items-center justify-center px-2 text-sm">{shapeLabel(l, shape)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-t border-line py-10 md:py-24">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-serif text-3xl font-normal md:text-5xl">{t.featuredTitle}</h2>
            <Link href={`/${l}/diamanten`} className="inline-flex min-h-11 items-center text-sm underline underline-offset-4">{t.featuredLink}</Link>
          </div>
          <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 md:mt-10 md:gap-x-8 md:gap-y-14 lg:grid-cols-4">
            {featured.map((stone) => (
              <li key={stone.slug}>
                <Link href={`/${l}/diamanten/${stone.slug}`} className="group block">
                  <span className="block border border-line transition-colors group-hover:border-ink">
                    <DiamondMedia shape={stone.shape} slug={stone.slug} alt="" decorative eager sizes="(min-width: 1024px) 24vw, (min-width: 640px) 46vw, 92vw" />
                  </span>
                  <span className="mt-3 block font-serif text-xl font-normal group-hover:underline md:mt-4 md:text-2xl">{shapeLabel(l, stone.shape)} {formatCarat(stone.carat, l)} ct</span>
                  <span className="mt-1 block text-sm text-muted">{stone.color} · {stone.clarity} · {labLabel(l, stone.cert_lab)}</span>
                  <span className="mt-2 block font-serif text-xl">{t.priceOnRequest}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        </Container>
        <section className="bg-white" aria-label={l === "de" ? "Sechs Formen" : "Six shapes"}>
          <Image
            src={studio.heroLoose.src}
            alt={l === "de" ? "Sechs lose Diamanten" : "Six loose diamonds"}
            width={studio.heroLoose.width}
            height={studio.heroLoose.height}
            sizes="100vw"
            loading="eager"
            className="h-auto w-full"
          />
        </section>
        <Container>
        <section className="py-10 md:py-24">
          <h2 className="font-serif text-3xl font-normal md:text-5xl">{t.stepsTitle}</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {t.steps.map(([title, body], index) => (
              <li key={title} className="border border-line bg-white p-6 md:min-h-64 md:p-8">
                <p className="font-serif text-5xl font-normal leading-none">0{index + 1}</p>
                <h3 className="mt-8 font-serif text-3xl font-normal">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-t border-line py-10 md:py-24">
          <div className="max-w-2xl">
            <h2 className="font-serif text-3xl font-normal md:text-5xl">{t.learnTitle}</h2>
            <p className="mt-3 text-muted">{t.learnIntro}</p>
          </div>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {cards.map((card, index) => (
              <li key={card.slug}>
                <Link href={`/${l}/wissen/${card.slug}`} className="flex h-full min-h-56 flex-col border border-line bg-white p-6 transition-colors hover:border-ink md:p-8">
                  <span className="font-serif text-4xl leading-none">0{index + 1}</span>
                  <h3 className="mt-6 font-serif text-3xl font-normal">{card.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{card.intro}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-t border-line py-10 md:py-24">
          <div className="max-w-2xl">
            <h2 className="font-serif text-3xl font-normal md:text-5xl">{t.sistersTitle}</h2>
            <p className="mt-2 text-sm text-muted md:mt-3 md:text-base">{t.sistersBody}</p>
          </div>
          <ul className="mt-6 grid gap-4 md:mt-10 md:grid-cols-2">
            <li>
              <a href={`${FAMILY.gold}/${l}`} className="group block border border-line bg-white transition-colors hover:border-ink">
                <span className="relative block aspect-[16/10] overflow-hidden bg-white">
                  <Image src={studio.gold.src} alt="" fill sizes="(min-width: 768px) 40vw, 92vw" loading="eager" className="object-contain transition-transform duration-500 group-hover:scale-105" />
                </span>
                <span className="block border-t border-line p-5 md:p-6">
                  <span className="block font-serif text-3xl font-normal md:text-4xl">{t.family.gold}</span>
                  <span className="mt-2 block text-sm text-muted">{t.sistersCards.goldNote}</span>
                </span>
              </a>
            </li>
            <li>
              <a href={`${FAMILY.jewelry}/${l}`} className="group block border border-line bg-white transition-colors hover:border-ink">
                <span className="relative block aspect-[16/10] overflow-hidden bg-white">
                  <Image src={studio.jewelry.src} alt="" fill sizes="(min-width: 768px) 40vw, 92vw" loading="eager" className="object-contain transition-transform duration-500 group-hover:scale-105" />
                </span>
                <span className="block border-t border-line p-5 md:p-6">
                  <span className="block font-serif text-3xl font-normal md:text-4xl">{t.family.jewelry}</span>
                  <span className="mt-2 block text-sm text-muted">{t.sistersCards.jewelryNote}</span>
                </span>
              </a>
            </li>
          </ul>
        </section>

        <section className="border-t border-line py-10 md:py-24">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted">{t.closing.eyebrow}</p>
          <h2 className="mt-4 max-w-xl font-serif text-4xl font-normal md:text-6xl">{t.closing.title}</h2>
          <Link href={`/${l}/diamanten`} className="btn btn-solid mt-8">{t.hero.cta}</Link>
        </section>
      </Container>
    </Main>
  );
}
