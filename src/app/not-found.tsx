import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-serif text-5xl text-gold">404</p>
      <h1 className="mt-4 font-serif text-3xl text-navy">Seite nicht gefunden</h1>
      <p className="mt-3 text-sm text-gray-600">Page not found.</p>
      <Link href="/de" className="mt-6 inline-block rounded bg-navy px-5 py-2 text-white">Fatlum Diamonds</Link>
    </main>
  );
}
