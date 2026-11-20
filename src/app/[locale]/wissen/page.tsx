import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Main, PageHeader } from "@/components/frame";
import { topicCards } from "@/lib/content";
import { dict, isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "de";
  return pageMeta(l, dict(l).learnTitle, dict(l).learnIntro, "/wissen");
}

export default async function LearnPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = dict(locale);
  return (
    <Main>
      <Container className="py-12 md:py-16">
        <PageHeader title={t.learnTitle} lede={t.learnIntro} />
        <ul className="mt-12 grid gap-px bg-line md:grid-cols-2">
          {topicCards(locale).map((card) => (
            <li key={card.slug} className="bg-paper">
              <Link href={`/${locale}/wissen/${card.slug}`} className="flex h-full min-h-40 flex-col p-6 hover:bg-white md:p-8">
                <h2 className="font-serif text-3xl font-normal md:text-4xl">{card.title}</h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">{card.intro}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Main>
  );
}
