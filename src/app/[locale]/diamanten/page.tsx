import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Search } from "@/components/search";
import { Container, Main } from "@/components/frame";
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
    <Main>
      <Container className="py-10 md:py-14">
        <Suspense fallback={<p className="text-sm text-muted">{dict(locale).loading}</p>}>
          <Search stones={stones} l={locale} />
        </Suspense>
      </Container>
    </Main>
  );
}
