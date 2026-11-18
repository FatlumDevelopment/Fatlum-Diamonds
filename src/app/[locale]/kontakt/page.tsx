import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/chrome";
import { InquiryForm } from "@/components/inquiry-form";
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
    <SiteShell l={locale}>
      <main id="content" className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="font-serif text-4xl text-navy">{t.contact.title}</h1>
        <p className="mt-3 max-w-2xl text-sm text-gray-600">{t.contact.lede}</p>
        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <address className="rounded-lg border border-gold/40 bg-cream p-6 text-sm not-italic">
            <h2 className="font-serif text-2xl text-navy">{t.contact.visit}</h2>
            <p className="mt-3">Fatlum<br />{ADDRESS.street}<br />{ADDRESS.postal} {ADDRESS.city}<br />{locale === "de" ? ADDRESS.countryDe : ADDRESS.countryEn}</p>
            <p className="mt-3"><a className="text-secondary underline" href={CONTACT_PHONE_HREF}>{CONTACT_PHONE}</a></p>
            <p><a className="text-secondary underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
            <p className="mt-3 text-gray-600">{t.contact.hours}</p>
          </address>
          <InquiryForm l={locale} kind="contact" />
        </div>
      </main>
    </SiteShell>
  );
}
