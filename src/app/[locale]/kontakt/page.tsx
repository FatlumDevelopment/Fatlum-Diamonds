import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InquiryForm } from "@/components/inquiry-form";
import { Container, Main, PageHeader } from "@/components/frame";
import { dict, isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { ADDRESS, CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_HREF } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "de";
  return pageMeta(l, dict(l).contact.title, dict(l).contact.lede, "/kontakt");
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = dict(locale);
  return (
    <Main>
      <Container className="py-12 md:py-16">
        <PageHeader title={t.contact.title} lede={t.contact.lede} />
        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-20">
          <address className="text-sm not-italic leading-relaxed">
            <h2 className="font-serif text-3xl font-normal">{t.contact.visit}</h2>
            <p className="mt-4">Fatlum<br />{ADDRESS.street}<br />{ADDRESS.postal} {ADDRESS.city}<br />{locale === "de" ? ADDRESS.countryDe : ADDRESS.countryEn}</p>
            <p className="mt-4"><a className="inline-flex min-h-11 items-center underline underline-offset-4" href={CONTACT_PHONE_HREF}>{CONTACT_PHONE}</a></p>
            <p><a className="inline-flex min-h-11 items-center underline underline-offset-4" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
            <p className="mt-4 text-muted">{t.contact.hours}</p>
          </address>
          <InquiryForm l={locale} kind="contact" />
        </div>
      </Container>
    </Main>
  );
}
