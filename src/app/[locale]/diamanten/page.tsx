import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/chrome";
import { Search } from "@/components/search";
import { dict, isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { getCatalog } from "@/lib/stones";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "de";
  const t = dict(l);
  return pageMeta(l, t.search.title, t.search.intro, "/diamanten");
}

export default async function DiamondsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { stones } = await getCatalog();
  return (
    <SiteShell l={locale}>
      <main id="content" className="mx-auto max-w-7xl px-4 py-8">
        <Suspense fallback={<p className="text-sm text-gray-500">…</p>}>
          <Search stones={stones} l={locale} />
        </Suspense>
      </main>
    </SiteShell>
  );
}
