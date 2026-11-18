import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Legal } from "@/components/legal";
import { isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "de";
  return pageMeta(l, l === "en" ? "Imprint" : "Impressum", "Fatlum, Maximilianstraße 2, 80539 München", "/impressum");
}

export default async function ImpressumPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  if (locale === "en") {
    return (
      <Legal l={locale} title="Imprint">
        <p><strong>Fatlum</strong><br />Maximilianstraße 2<br />80539 Munich<br />Germany</p>
        <p>Phone: {CONTACT_PHONE}<br />Email: {CONTACT_EMAIL}</p>
        <p>Legal form: [Rechtsform folgt]<br />Managing director: [Geschäftsführung folgt]<br />Register court and number: [Handelsregister folgt]<br />VAT ID: [USt-IdNr. folgt]</p>
        <p>Responsible for content under § 18 (2) MStV: [Name folgt], Maximilianstraße 2, 80539 Munich</p>
        <h2>Dispute resolution</h2>
        <p>[Hinweis zur Verbraucherstreitbeilegung folgt]</p>
      </Legal>
    );
  }
  return (
    <Legal l={locale} title="Impressum">
      <p><strong>Fatlum</strong><br />Maximilianstraße 2<br />80539 München<br />Deutschland</p>
      <p>Telefon: {CONTACT_PHONE}<br />E-Mail: {CONTACT_EMAIL}</p>
      <p>Rechtsform: [Rechtsform folgt]<br />Geschäftsführung: [Geschäftsführung folgt]<br />Registergericht und Registernummer: [Handelsregister folgt]<br />Umsatzsteuer-ID: [USt-IdNr. folgt]</p>
      <p>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV: [Name folgt], Maximilianstraße 2, 80539 München</p>
      <h2>Streitschlichtung</h2>
      <p>[Hinweis zur Verbraucherstreitbeilegung folgt]</p>
    </Legal>
  );
}
