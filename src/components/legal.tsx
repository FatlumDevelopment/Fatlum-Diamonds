import { dict, type Locale } from "@/lib/i18n";
import { Container, Main, PageHeader } from "./frame";

export function Legal({ l, title, children }: { l: Locale; title: string; children: React.ReactNode }) {
  const t = dict(l);
  return (
    <Main>
      <Container className="py-12 md:py-16">
        <aside className="mb-10 max-w-3xl border border-dashed border-ink/40 bg-white px-5 py-4" role="note">
          <p className="text-[11px] uppercase tracking-[0.2em]">{t.placeholderLabel}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{t.placeholder}</p>
        </aside>
        <PageHeader title={title} />
        <div className="prose-legal mt-8 max-w-3xl text-[15px]">{children}</div>
      </Container>
    </Main>
  );
}
