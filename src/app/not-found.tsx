import Link from "next/link";

export default function NotFound() {
  return (
    <main id="content" className="mx-auto max-w-xl px-5 py-24">
      <p className="text-[11px] uppercase tracking-[0.22em] text-muted">404</p>
      <h1 className="mt-4 font-serif text-5xl font-normal leading-tight">Diese Seite gibt es nicht.</h1>
      <p className="mt-3 text-muted">This page is not here.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/de" className="btn btn-solid">Deutsch</Link>
        <Link href="/en" className="btn btn-line">English</Link>
      </div>
    </main>
  );
}
