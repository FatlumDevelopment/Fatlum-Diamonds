import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/chrome";
import { aboutParagraphs } from "@/lib/content";
import { dict, isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { ADDRESS, CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_HREF, FAMILY } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "de";
  return pageMeta(l, dict(l).about.title, dict(l).about.lede, "/ueber-uns");
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = dict(locale);
  return (
    <SiteShell l={locale}>
      <main id="content" className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-serif text-4xl text-navy">{t.about.title}</h1>
        <p className="mt-4 text-sm leading-relaxed">{t.about.lede}</p>
        {aboutParagraphs(locale).map((paragraph) => <p key={paragraph.slice(0, 32)} className="mt-4 text-sm leading-relaxed">{paragraph}</p>)}
        <address className="mt-8 rounded-lg border border-gold/40 bg-cream p-5 text-sm not-italic">
          <p>Fatlum<br />{ADDRESS.street}<br />{ADDRESS.postal} {ADDRESS.city}<br />{locale === "de" ? ADDRESS.countryDe : ADDRESS.countryEn}</p>
          <p className="mt-3"><a className="text-secondary underline" href={CONTACT_PHONE_HREF}>{CONTACT_PHONE}</a></p>
          <p><a className="text-secondary underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
        </address>
        <p className="mt-6 text-sm">
          <a className="text-secondary underline" href={`${FAMILY.gold}/${locale}`}>{t.family.gold}</a>
          {" · "}
          <a className="text-secondary underline" href={`${FAMILY.jewelry}/${locale}`}>{t.family.jewelry}</a>
        </p>
      </main>
    </SiteShell>
  );
}
