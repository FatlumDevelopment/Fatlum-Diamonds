import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/chrome";
import { RequestList } from "@/components/request-list";
import { dict, isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "de";
  return pageMeta(l, dict(l).request.title, dict(l).request.noPayment, "/anfrage");
}

export default async function RequestPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = dict(locale);
  return (
    <SiteShell l={locale}>
      <main id="content" className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="font-serif text-4xl text-navy">{t.request.title}</h1>
        <p className="mt-2 text-sm text-gray-600">{t.noPrices}</p>
        <RequestList l={locale} />
      </main>
    </SiteShell>
  );
}
