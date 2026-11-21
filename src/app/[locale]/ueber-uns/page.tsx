import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StudioPhoto } from "@/components/media";
import { Container, Main, PageHeader } from "@/components/frame";
import { studio } from "@/lib/images";
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
    <Main>
      <Container className="py-12 md:py-16">
        <PageHeader title={t.about.title} lede={t.about.lede} />
        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="max-w-2xl space-y-5 text-base leading-relaxed">
          {aboutParagraphs(locale).map((paragraph) => <p key={paragraph.slice(0, 40)}>{paragraph}</p>)}
        </div>
        <div className="border border-line bg-white">
          <StudioPhoto
            src={studio.tweezers.src}
            width={studio.tweezers.width}
            height={studio.tweezers.height}
            sizes="(min-width: 1024px) 280px, 92vw"
            alt={locale === "de" ? "Diamant in einer Pinzette" : "Diamond held in tweezers"}
            className="h-auto w-full"
          />
        </div>
        </div>
        <address className="mt-12 max-w-xl border-t border-line pt-8 text-sm not-italic leading-relaxed">
          <h2 className="font-serif text-3xl font-normal">{t.contact.visit}</h2>
          <p className="mt-4">Fatlum<br />{ADDRESS.street}<br />{ADDRESS.postal} {ADDRESS.city}<br />{locale === "de" ? ADDRESS.countryDe : ADDRESS.countryEn}</p>
          <p className="mt-4"><a className="underline underline-offset-4" href={CONTACT_PHONE_HREF}>{CONTACT_PHONE}</a></p>
          <p><a className="underline underline-offset-4" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
          <p className="mt-4 text-muted">{t.contact.hours}</p>
        </address>
        <ul className="mt-8 max-w-xl border-y border-line">
          <li className="border-b border-line"><a className="flex min-h-14 items-center justify-between" href={`${FAMILY.gold}/${locale}`}>{t.family.gold}<span aria-hidden="true">→</span></a></li>
          <li><a className="flex min-h-14 items-center justify-between" href={`${FAMILY.jewelry}/${locale}`}>{t.family.jewelry}<span aria-hidden="true">→</span></a></li>
        </ul>
      </Container>
    </Main>
  );
}
