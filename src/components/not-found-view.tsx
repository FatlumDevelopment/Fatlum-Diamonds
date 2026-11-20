import Link from "next/link";
import { Container, Main } from "./frame";
import { dict, type Locale } from "@/lib/i18n";

export function NotFoundView({ l }: { l: Locale }) {
  const t = dict(l);
  const other: Locale = l === "de" ? "en" : "de";
  return (
    <Main>
      <Container className="py-20 md:py-28">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted">404</p>
        <h1 className="mt-4 max-w-xl font-serif text-5xl font-normal leading-[1.02] md:text-6xl">{t.notFoundTitle}</h1>
        <p className="mt-5 max-w-md text-muted">{t.notFoundBody}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href={`/${l}`} className="btn btn-solid">{t.home}</Link>
          <Link href={`/${l}/diamanten`} className="btn btn-line">{t.nav.search}</Link>
        </div>
        <p className="mt-8 text-sm">
          <Link href={`/${other}`} hrefLang={other} className="underline underline-offset-4">{other === "en" ? "English" : "Deutsch"}</Link>
        </p>
      </Container>
    </Main>
  );
}
