import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Legal } from "@/components/legal";
import { isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { CONTACT_EMAIL } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "de";
  return pageMeta(l, l === "en" ? "Privacy" : "Datenschutz", "Datenschutzhinweise für Anfragen bei Fatlum Diamonds.", "/datenschutz");
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  if (locale === "en") {
    return (
      <Legal l={locale} title="Privacy policy">
        <h2>1. Controller</h2>
        <p>Fatlum, Maximilianstraße 2, 80539 Munich, Germany, {CONTACT_EMAIL}. The legal entity is [Rechtsform folgt].</p>
        <h2>2. Requests</h2>
        <p>When you send a request we store your name, email, phone, optional company, message, consent and the stones you selected, so we can answer you (Art. 6 (1) (b) and (a) GDPR). The rows are stored in Supabase. If email delivery is configured, messages are sent through Resend. If it is not configured, we only store the request.</p>
        <h2>3. Local storage</h2>
        <p>The request list and the comparison live in your browser (localStorage). This site does not set tracking, analytics or advertising cookies.</p>
        <h2>4. Hosting</h2>
        <p>The site is hosted at Hostinger. Server log files may include IP address, time and the requested page. [Aufbewahrungsfrist folgt]</p>
        <h2>5. Your rights</h2>
        <p>You can ask for access, rectification, erasure, restriction, portability and you can object or withdraw consent. You can also complain to a supervisory authority. [Zuständige Aufsichtsbehörde folgt]</p>
      </Legal>
    );
  }
  return (
    <Legal l={locale} title="Datenschutz">
      <h2>1. Verantwortlicher</h2>
      <p>Fatlum, Maximilianstraße 2, 80539 München, {CONTACT_EMAIL}. Die Rechtsform ist [Rechtsform folgt].</p>
      <h2>2. Anfragen</h2>
      <p>Wenn Sie eine Anfrage senden, speichern wir Name, E-Mail, Telefon, optionale Firma, Nachricht, Einwilligung und die ausgewählten Steine, um Ihnen zu antworten (Art. 6 Abs. 1 lit. b und a DSGVO). Die Zeilen liegen bei Supabase. Wenn der E-Mail-Versand eingerichtet ist, gehen Nachrichten über Resend. Wenn nicht, speichern wir nur die Anfrage.</p>
      <h2>3. Lokaler Speicher</h2>
      <p>Anfrageliste und Vergleich liegen in Ihrem Browser (localStorage). Diese Website setzt keine Tracking-, Analyse- oder Werbe-Cookies.</p>
      <h2>4. Hosting</h2>
      <p>Die Seite wird bei Hostinger betrieben. Server-Logfiles können IP-Adresse, Zeitpunkt und die aufgerufene Seite enthalten. [Aufbewahrungsfrist folgt]</p>
      <h2>5. Ihre Rechte</h2>
      <p>Sie können Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit verlangen und eine Einwilligung widerrufen oder widersprechen. Sie können sich bei einer Aufsichtsbehörde beschweren. [Zuständige Aufsichtsbehörde folgt]</p>
    </Legal>
  );
}
