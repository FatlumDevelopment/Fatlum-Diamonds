import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/chrome";
import { faqItems } from "@/lib/content";
import { dict, isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "de";
  return pageMeta(l, dict(l).faqTitle, dict(l).faqIntro, "/faq");
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = dict(locale);
  return (
    <SiteShell l={locale}>
      <main id="content" className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-serif text-4xl text-navy">{t.faqTitle}</h1>
        <p className="mt-3 text-sm text-gray-600">{t.faqIntro}</p>
        <div className="mt-8 divide-y divide-gray-200 border-y border-gray-200">
          {faqItems(locale).map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="cursor-pointer font-serif text-xl text-navy">{item.q}</summary>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">{item.a}</p>
            </details>
          ))}
        </div>
      </main>
    </SiteShell>
  );
}
