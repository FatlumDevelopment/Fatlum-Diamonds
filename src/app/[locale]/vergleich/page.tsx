import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/chrome";
import { CompareView } from "@/components/compare-view";
import { dict, isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { getCatalog } from "@/lib/stones";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "de";
  return pageMeta(l, dict(l).compare.title, dict(l).compare.intro, "/vergleich");
}

export default async function ComparePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = dict(locale);
  const { stones } = await getCatalog();
  return (
    <SiteShell l={locale}>
      <main id="content" className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="font-serif text-4xl text-navy">{t.compare.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-600">{t.compare.intro}</p>
        <div className="mt-4 rounded border border-dashed border-amber-500 bg-amber-50 p-4 text-sm text-amber-950">{t.exampleBanner}</div>
        <CompareView stones={stones} l={locale} />
      </main>
    </SiteShell>
  );
}
