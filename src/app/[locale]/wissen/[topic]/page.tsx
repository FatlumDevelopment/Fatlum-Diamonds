import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StudioPhoto } from "@/components/media";
import { Container, Crumbs, Main } from "@/components/frame";
import { studio } from "@/lib/images";
import { getTopic, isTopic, TOPICS } from "@/lib/content";
import { dict, isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";

export function generateStaticParams() {
  return ["de", "en"].flatMap((locale) => TOPICS.map((topic) => ({ locale, topic })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; topic: string }> }): Promise<Metadata> {
  const { locale, topic } = await params;
  const l = isLocale(locale) ? locale : "de";
  if (!isTopic(topic)) return pageMeta(l, dict(l).learnTitle, dict(l).learnIntro, "/wissen");
  const page = getTopic(topic, l);
  return pageMeta(l, page.title, page.intro, `/wissen/${topic}`);
}

export default async function TopicPage({ params }: { params: Promise<{ locale: string; topic: string }> }) {
  const { locale, topic } = await params;
  if (!isLocale(locale) || !isTopic(topic)) notFound();
  const t = dict(locale);
  const page = getTopic(topic, locale);
  const index = TOPICS.indexOf(topic);
  const prev = index > 0 ? TOPICS[index - 1] : null;
  const next = index < TOPICS.length - 1 ? TOPICS[index + 1] : null;
  return (
    <Main>
      <Container className="py-12 md:py-16">
        <Crumbs
          l={locale}
          items={[
            { href: `/${locale}`, label: t.home },
            { href: `/${locale}/wissen`, label: t.nav.learn },
            { label: page.title },
          ]}
        />
        <h1 className="mt-8 max-w-3xl font-serif text-[2.65rem] font-normal leading-[1.02] md:text-6xl">{page.title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted md:text-lg">{page.intro}</p>
        {topic === "zertifikate" ? (
          <div className="mt-10 max-w-xl border border-line bg-white">
            <StudioPhoto
              src={studio.certificate.src}
              width={studio.certificate.width}
              height={studio.certificate.height}
              sizes="(min-width: 768px) 560px, 92vw"
              alt={locale === "de" ? "Diamant auf einem Zertifikat" : "Diamond on a certificate"}
              className="h-auto w-full"
            />
          </div>
        ) : null}
        {topic === "4c" ? (
          <ol className="mt-12 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {page.sections.map((section, i) => (
              <li key={section.heading} className="bg-paper p-6">
                <p className="text-[11px] tracking-[0.18em] text-muted">0{i + 1}</p>
                <p className="mt-3 font-serif text-4xl font-normal">{section.heading}</p>
              </li>
            ))}
          </ol>
        ) : null}
        <div className="mt-12 max-w-2xl">
          {page.sections.map((section) => (
            <section key={section.heading} className="border-t border-line py-8">
              <h2 className="font-serif text-3xl font-normal md:text-4xl">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="mt-4 text-base leading-relaxed">{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-3 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <Link href={`/${locale}/diamanten`} className="btn btn-solid">{t.nav.search}</Link>
          <div className="flex flex-wrap gap-x-6">
            {prev ? <Link className="inline-flex min-h-11 items-center text-sm underline underline-offset-4" href={`/${locale}/wissen/${prev}`}>{getTopic(prev, locale).title}</Link> : null}
            {next ? <Link className="inline-flex min-h-11 items-center text-sm underline underline-offset-4" href={`/${locale}/wissen/${next}`}>{getTopic(next, locale).title}</Link> : null}
          </div>
        </div>
      </Container>
    </Main>
  );
}
