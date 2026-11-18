"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { dict, type Locale } from "@/lib/i18n";
import { ADDRESS, CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_HREF, FAMILY } from "@/lib/site";
import { CompareBar } from "./compare-view";
import { useCart } from "./providers";

function swapLocale(pathname: string, next: Locale) {
  const parts = pathname.split("/");
  if (parts[1] === "de" || parts[1] === "en") parts[1] = next;
  else parts.splice(1, 0, next);
  return parts.join("/") || `/${next}`;
}

export function Header({ l }: { l: Locale }) {
  const t = dict(l);
  const path = usePathname() || `/${l}`;
  const sp = useSearchParams();
  const query = sp.toString();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const href = (loc: Locale) => `${swapLocale(path, loc)}${query ? `?${query}` : ""}`;
  const links = [
    [`/${l}/diamanten`, t.nav.search],
    [`/${l}/wissen`, t.nav.learn],
    [`/${l}/faq`, t.nav.faq],
    [`/${l}/ueber-uns`, t.nav.about],
    [`/${l}/kontakt`, t.nav.contact],
  ] as const;
  return (
    <header className="sticky top-0 z-30 bg-navy text-white shadow">
      <a href="#content" className="skip-link">{t.skip}</a>
      <div className="border-b border-white/10 bg-[#020c2b] text-xs text-white/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-1.5">
          <nav aria-label={t.family.label} className="flex flex-wrap gap-x-3 gap-y-1">
            <a href={`${FAMILY.gold}/${l}`} className="hover:text-white">{t.family.gold}</a>
            <a href={`${FAMILY.jewelry}/${l}`} className="hover:text-white">{t.family.jewelry}</a>
            <span className="text-gold" aria-current="page">{t.family.diamonds}</span>
          </nav>
          <span className="flex gap-3">
            <Link href={href("de")} hrefLang="de" className={l === "de" ? "text-gold" : "hover:text-white"}>DE</Link>
            <Link href={href("en")} hrefLang="en" className={l === "en" ? "text-gold" : "hover:text-white"}>EN</Link>
          </span>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href={`/${l}`} className="flex items-center gap-3">
          <img src="/images/brand/fatlum-mark.svg" alt="" className="h-11 w-11" />
          <span className="font-serif text-2xl tracking-[0.18em] text-gold">FATLUM</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm lg:flex" aria-label={t.diamonds}>
          {links.map(([hrefLink, label]) => (
            <Link key={hrefLink} href={hrefLink} className="hover:text-gold">{label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" className="rounded border border-white/20 px-3 py-2 text-sm lg:hidden" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            {t.nav.menu}
          </button>
          <Link href={`/${l}/anfrage`} className="relative inline-flex items-center gap-2 rounded-full border border-gold/60 px-4 py-2 text-sm text-white hover:bg-gold hover:text-navy" data-testid="cart-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 5h11M9 12h11M9 19h11M4 5h.01M4 12h.01M4 19h.01" /></svg>
            <span className="hidden sm:inline">{t.nav.request}</span>
            <span className="min-w-5 rounded-full bg-gold px-1.5 text-center text-xs font-semibold text-navy">{count}</span>
          </Link>
        </div>
      </div>
      {open && (
        <nav className="border-t border-white/10 px-4 py-3 lg:hidden" aria-label={t.diamonds}>
          <ul className="space-y-2 text-sm">
            {links.map(([hrefLink, label]) => (
              <li key={hrefLink}><Link href={hrefLink} onClick={() => setOpen(false)} className="block py-1 hover:text-gold">{label}</Link></li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

export function Footer({ l }: { l: Locale }) {
  const t = dict(l);
  return (
    <footer className="mt-20 bg-navy text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <img src="/images/brand/fatlum-mark.svg" alt="" className="h-10 w-10" />
            <span className="font-serif text-xl tracking-[0.18em] text-gold">FATLUM</span>
          </div>
          <p className="mt-4 text-sm">{t.noPrices}</p>
        </div>
        <div>
          <h2 className="font-serif text-lg text-gold">{t.footer.contact}</h2>
          <address className="mt-3 space-y-1 text-sm not-italic">
            <p>Fatlum<br />{ADDRESS.street}<br />{ADDRESS.postal} {ADDRESS.city}</p>
            <p><a className="hover:text-gold" href={CONTACT_PHONE_HREF}>{CONTACT_PHONE}</a></p>
            <p><a className="hover:text-gold" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
          </address>
        </div>
        <div>
          <h2 className="font-serif text-lg text-gold">{t.footer.houses}</h2>
          <ul className="mt-3 space-y-1 text-sm">
            <li><a className="hover:text-gold" href={`${FAMILY.gold}/${l}`}>{t.family.gold}</a></li>
            <li><a className="hover:text-gold" href={`${FAMILY.jewelry}/${l}`}>{t.family.jewelry}</a></li>
            <li><Link className="hover:text-gold" href={`/${l}`}>{t.family.diamonds}</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="font-serif text-lg text-gold">{t.footer.legal}</h2>
          <ul className="mt-3 space-y-1 text-sm">
            <li><Link className="hover:text-gold" href={`/${l}/impressum`}>{t.footer.imprint}</Link></li>
            <li><Link className="hover:text-gold" href={`/${l}/datenschutz`}>{t.footer.privacy}</Link></li>
            <li><Link className="hover:text-gold" href={`/${l}/agb`}>{t.footer.terms}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">© {new Date().getFullYear()} Fatlum. {t.footer.rights}</div>
    </footer>
  );
}

export function SiteShell({ l, children }: { l: Locale; children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={<div className="h-[92px] bg-navy" />}>
        <Header l={l} />
      </Suspense>
      {children}
      <Footer l={l} />
      <CompareBar l={l} />
    </>
  );
}
