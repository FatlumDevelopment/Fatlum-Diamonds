import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RequestList } from "@/components/request-list";
import { Container, Main, PageHeader } from "@/components/frame";
import { dict, isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "de";
  return pageMeta(l, dict(l).request.title, dict(l).request.lede, "/anfrage");
}

export default async function RequestPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ intent?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { intent: raw } = await searchParams;
  const intent = raw === "reserve" ? "reserve" : "list";
  const t = dict(locale);
  return (
    <Main>
      <Container className="py-12 md:py-16">
        <PageHeader
          title={intent === "reserve" ? t.request.reserveTitle : t.request.title}
          lede={intent === "reserve" ? t.request.reserveLede : t.request.lede}
        />
        <RequestList l={locale} intent={intent} />
      </Container>
    </Main>
  );
}
