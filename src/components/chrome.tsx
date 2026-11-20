"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useId, useRef, useState } from "react";
import { Mark } from "./diamond-shape";
import { CompareBar } from "./compare-view";
import { useCart } from "./providers";
import { dict, type Locale } from "@/lib/i18n";
import { ADDRESS, CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_HREF, FAMILY } from "@/lib/site";

function swapLocale(pathname: string, next: Locale) {
  const parts = pathname.split("/");
  if (parts[1] === "de" || parts[1] === "en") parts[1] = next;
  else parts.splice(1, 0, next);
  return parts.join("/") || `/${next}`;
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M2 5h16M2 10h16M2 15h16" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M3 3l12 12M15 3L3 15" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
function RequestMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M9 1.6 15.2 6.8 9 16.2 2.8 6.8 Z" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function Header({ l }: { l: Locale }) {
  const t = dict(l);
  const path = usePathname() || `/${l}`;
  const sp = useSearchParams();
  const query = sp.toString();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const href = (loc: Locale) => `${swapLocale(path, loc)}${query ? `?${query}` : ""}`;
  const links = [
    [`/${l}/diamanten`, t.nav.search],
    [`/${l}/wissen`, t.nav.learn],
    [`/${l}/faq`, t.nav.faq],
    [`/${l}/ueber-uns`, t.nav.about],
    [`/${l}/kontakt`, t.nav.contact],
  ] as const;

  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    if (open) {
      if (!el.open) el.showModal();
      closeRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else if (el.open) {
      el.close();
      document.body.style.overflow = "";
      menuButtonRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  function Lang({ className = "" }: { className?: string }) {
    return (
      <span className={`inline-flex items-center gap-3 text-sm ${className}`}>
        <Link href={href("de")} hrefLang="de" lang="de" aria-current={l === "de" ? "page" : undefined} className={l === "de" ? "underline underline-offset-4" : "text-muted"}>DE</Link>
        <Link href={href("en")} hrefLang="en" lang="en" aria-current={l === "en" ? "page" : undefined} className={l === "en" ? "underline underline-offset-4" : "text-muted"}>EN</Link>
      </span>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-md">
      <a href="#content" className="skip-link">{t.skip}</a>
      <div className="hidden h-9 border-b border-line md:block">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
          <nav aria-label={t.family.label} className="flex min-w-0 items-center gap-4 text-[12px] tracking-wide">
            <a href={`${FAMILY.gold}/${l}`} className="text-muted hover:text-ink">{t.family.gold}</a>
            <a href={`${FAMILY.jewelry}/${l}`} className="text-muted hover:text-ink">{t.family.jewelry}</a>
            <span aria-current="page">{t.family.diamonds}</span>
          </nav>
          <Lang />
        </div>
      </div>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-3 md:px-8">
        <Link href={`/${l}`} className="flex min-w-0 items-center gap-2.5 text-ink" aria-label="Fatlum Diamonds">
          <Mark className="h-7 w-7 shrink-0" />
          <span className="flex min-w-0 flex-col">
            <span className="font-serif text-[1.65rem] leading-none tracking-[0.04em]">Fatlum</span>
            <span className="mt-1 text-[10px] uppercase tracking-[0.28em] text-muted">Diamonds</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm lg:flex" aria-label={t.diamonds}>
          {links.map(([hrefLink, label]) => {
            const on = path === hrefLink || path.startsWith(`${hrefLink}/`);
            return (
              <Link key={hrefLink} href={hrefLink} aria-current={on ? "page" : undefined} className={`whitespace-nowrap py-2 ${on ? "underline underline-offset-8" : "text-ink/80 hover:text-ink"}`}>
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center">
          <Link
            href={`/${l}/anfrage`}
            aria-label={`${t.nav.request}: ${count}`}
            className="inline-flex h-11 items-center gap-2 px-2.5 text-sm"
            data-testid="cart-badge"
          >
            <RequestMark />
            <span className="hidden md:inline">{t.nav.request}</span>
            <span className="tabular-nums">{count}</span>
          </Link>
          <button
            ref={menuButtonRef}
            type="button"
            className="grid size-11 place-items-center lg:hidden"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
            <span className="sr-only">{t.nav.menu}</span>
          </button>
        </div>
      </div>
      <dialog
        ref={menuRef}
        id="site-menu"
        className="menu-dialog"
        aria-labelledby={titleId}
        onClose={() => setOpen(false)}
        onCancel={(event) => {
          event.preventDefault();
          setOpen(false);
        }}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-line px-3">
            <p id={titleId} className="font-serif text-2xl tracking-wide">Fatlum</p>
            <button ref={closeRef} type="button" className="grid size-11 place-items-center" onClick={() => setOpen(false)}>
              <CloseIcon />
              <span className="sr-only">{t.nav.close}</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6">
            <nav aria-label={t.diamonds}>
              <ul>
                {links.map(([hrefLink, label]) => (
                  <li key={hrefLink}>
                    <Link href={hrefLink} className="flex min-h-14 items-center font-serif text-[2.15rem] leading-none" onClick={() => setOpen(false)}>
                      {label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href={`/${l}/anfrage`} className="flex min-h-14 items-center font-serif text-[2.15rem] leading-none" onClick={() => setOpen(false)}>
                    {t.nav.request}
                    <span className="ml-3 text-lg text-muted tabular-nums">{count}</span>
                  </Link>
                </li>
              </ul>
            </nav>
            <div className="mt-10 border-t border-line pt-6">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted">{t.nav.houses}</p>
              <ul className="mt-2">
                <li><a className="flex min-h-11 items-center" href={`${FAMILY.gold}/${l}`}>{t.family.gold}</a></li>
                <li><a className="flex min-h-11 items-center" href={`${FAMILY.jewelry}/${l}`}>{t.family.jewelry}</a></li>
                <li><Link className="flex min-h-11 items-center" href={`/${l}`} onClick={() => setOpen(false)}>{t.family.diamonds}</Link></li>
              </ul>
              <div className="mt-6"><Lang /></div>
            </div>
          </div>
        </div>
      </dialog>
    </header>
  );
}

export function Footer({ l }: { l: Locale }) {
  const t = dict(l);
  const year = new Date().getFullYear();
  const link = "inline-flex min-h-11 items-center text-sm hover:underline";
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:px-8 lg:grid-cols-4">
        <div>
          <p className="flex items-center gap-2.5">
            <Mark />
            <span className="font-serif text-3xl leading-none">Fatlum</span>
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{t.noPrices}</p>
        </div>
        <div>
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-muted">{t.footer.contact}</h2>
          <address className="mt-3 text-sm not-italic leading-relaxed">
            <p>Fatlum<br />{ADDRESS.street}<br />{ADDRESS.postal} {ADDRESS.city}</p>
            <p className="mt-3"><a className={link} href={CONTACT_PHONE_HREF}>{CONTACT_PHONE}</a></p>
            <p><a className={link} href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
          </address>
        </div>
        <div>
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-muted">{t.footer.houses}</h2>
          <ul className="mt-3">
            <li><a className={link} href={`${FAMILY.gold}/${l}`}>{t.family.gold}</a></li>
            <li><a className={link} href={`${FAMILY.jewelry}/${l}`}>{t.family.jewelry}</a></li>
            <li><Link className={link} href={`/${l}`}>{t.family.diamonds}</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-muted">{t.footer.guide}</h2>
          <ul className="mt-3">
            <li><Link className={link} href={`/${l}/wissen/4c`}>{t.hero.secondary}</Link></li>
            <li><Link className={link} href={`/${l}/faq`}>{t.nav.faq}</Link></li>
            <li><Link className={link} href={`/${l}/impressum`}>{t.footer.imprint}</Link></li>
            <li><Link className={link} href={`/${l}/datenschutz`}>{t.footer.privacy}</Link></li>
            <li><Link className={link} href={`/${l}/agb`}>{t.footer.terms}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-muted">© {year} Fatlum. {t.footer.rights}</div>
    </footer>
  );
}

export function SiteShell({ l, children }: { l: Locale; children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={<div className="h-16 border-b border-line bg-paper md:h-[6.25rem]" />}>
        <Header l={l} />
      </Suspense>
      {children}
      <Footer l={l} />
      <CompareBar l={l} />
    </>
  );
}
