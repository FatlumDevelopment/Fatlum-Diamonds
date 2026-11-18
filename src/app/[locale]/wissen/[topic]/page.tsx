import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/chrome";
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
  return (
    <SiteShell l={locale}>
      <main id="content" className="mx-auto max-w-3xl px-4 py-10">
        <nav className="text-xs text-gray-500">
          <Link href={`/${locale}`} className="hover:text-gold">{t.home}</Link>
          {" · "}
          <Link href={`/${locale}/wissen`} className="hover:text-gold">{t.nav.learn}</Link>
        </nav>
        <h1 className="mt-4 font-serif text-4xl text-navy">{page.title}</h1>
        <p className="mt-4 text-sm leading-relaxed text-gray-700">{page.intro}</p>
        {page.sections.map((section) => (
          <section key={section.heading} className="mt-8">
            <h2 className="font-serif text-2xl text-navy">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph.slice(0, 24)} className="mt-3 text-sm leading-relaxed">{paragraph}</p>)}
          </section>
        ))}
        <p className="mt-10"><Link href={`/${locale}/diamanten`} className="rounded bg-navy px-4 py-2 text-sm text-white">{t.nav.search}</Link></p>
      </main>
    </SiteShell>
  );
}
