import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Main, PageHeader } from "@/components/frame";
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
    <Main>
      <Container className="py-12 md:py-16">
        <PageHeader title={t.faqTitle} lede={t.faqIntro} />
        <div className="mt-12 max-w-3xl border-t border-line">
          {faqItems(locale).map((item) => (
            <details key={item.q} className="group border-b border-line">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 font-serif text-2xl font-normal [&::-webkit-details-marker]:hidden">
                {item.q}
                <span aria-hidden="true" className="text-muted group-open:hidden">+</span>
                <span aria-hidden="true" className="hidden text-muted group-open:inline">–</span>
              </summary>
              <p className="max-w-2xl pb-6 text-sm leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </Main>
  );
}
