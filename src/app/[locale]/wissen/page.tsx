import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/chrome";
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
    <SiteShell l={locale}>
      <main id="content" className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="font-serif text-4xl text-navy">{t.learnTitle}</h1>
        <p className="mt-3 max-w-2xl text-sm text-gray-600">{t.learnIntro}</p>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {topicCards(locale).map((card) => (
            <li key={card.slug} className="rounded-lg border border-gray-200 p-6 hover:border-gold">
              <h2 className="font-serif text-2xl text-navy"><Link href={`/${locale}/wissen/${card.slug}`}>{card.title}</Link></h2>
              <p className="mt-2 text-sm text-gray-600">{card.intro}</p>
            </li>
          ))}
        </ul>
      </main>
    </SiteShell>
  );
}
