import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompareView } from "@/components/compare-view";
import { Container, Main, PageHeader, SpecimenNote } from "@/components/frame";
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
    <Main>
      <Container className="py-12 md:py-16">
        <PageHeader title={t.compare.title} lede={t.compare.intro} />
        <div className="mt-6"><SpecimenNote l={locale} show={stones.some((stone) => stone.is_example)} /></div>
        <CompareView stones={stones} l={locale} />
      </Container>
    </Main>
  );
}
