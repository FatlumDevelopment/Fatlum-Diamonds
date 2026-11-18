import { SiteShell } from "./chrome";
import { dict, type Locale } from "@/lib/i18n";

export function Legal({ l, title, children }: { l: Locale; title: string; children: React.ReactNode }) {
  return (
    <SiteShell l={l}>
      <main id="content" className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-6 rounded border-2 border-dashed border-amber-500 bg-amber-50 p-4 text-sm text-amber-950">{dict(l).placeholder}</div>
        <h1 className="font-serif text-4xl text-navy">{title}</h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-navy">{children}</div>
      </main>
    </SiteShell>
  );
}
