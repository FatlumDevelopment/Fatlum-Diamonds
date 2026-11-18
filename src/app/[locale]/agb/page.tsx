import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Legal } from "@/components/legal";
import { isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "de";
  return pageMeta(l, l === "en" ? "Terms" : "AGB", "Entwurf der Bedingungen für Anfragen bei Fatlum Diamonds.", "/agb");
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  if (locale === "en") {
    return (
      <Legal l={locale} title="Terms (draft)">
        <p>This text is a placeholder, not a finished set of terms. [Anwaltliche Fassung folgt]</p>
        <h2>1. No prices, no checkout</h2>
        <p>The website shows no prices and takes no payment. A request is not an order and not a contract.</p>
        <h2>2. Example stones</h2>
        <p>Stones marked EXAMPLE, with item numbers FD-EX- and certificate numbers EXAMPLE-, are sample data. They are not an offer and not goods you can buy.</p>
        <h2>3. Offer</h2>
        <p>A contract starts only when you accept a written offer from Fatlum. The offer states the stone, the certificate, the price and the delivery. [Liefer- und Zahlungsbedingungen folgen]</p>
        <h2>4. Law</h2>
        <p>[Anwendbares Recht und Gerichtsstand folgen]</p>
      </Legal>
    );
  }
  return (
    <Legal l={locale} title="AGB (Entwurf)">
      <p>Dieser Text ist ein Platzhalter, keine fertigen Bedingungen. [Anwaltliche Fassung folgt]</p>
      <h2>1. Keine Preise, keine Kasse</h2>
      <p>Die Website zeigt keine Preise und nimmt keine Zahlung an. Eine Anfrage ist keine Bestellung und kein Vertrag.</p>
      <h2>2. Beispielsteine</h2>
      <p>Steine mit der Kennzeichnung EXAMPLE, Artikelnummern FD-EX- und Zertifikatsnummern EXAMPLE- sind Musterdaten. Sie sind kein Angebot und keine Ware, die Sie kaufen können.</p>
      <h2>3. Angebot</h2>
      <p>Ein Vertrag entsteht erst, wenn Sie ein schriftliches Angebot von Fatlum annehmen. Das Angebot nennt Stein, Zertifikat, Preis und Lieferung. [Liefer- und Zahlungsbedingungen folgen]</p>
      <h2>4. Recht</h2>
      <p>[Anwendbares Recht und Gerichtsstand folgen]</p>
    </Legal>
  );
}
