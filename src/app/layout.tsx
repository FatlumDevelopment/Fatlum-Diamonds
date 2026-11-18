import type { Metadata } from "next";
import "./globals.css";
import { HtmlLang } from "@/components/html-lang";
import { Providers } from "@/components/providers";
import { FAMILY } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || FAMILY.diamonds),
  title: { default: "Fatlum Diamonds", template: "%s · Fatlum Diamonds" },
  description: "Lose Diamanten von Fatlum in München. Suche, Vergleich und Preisanfrage. Keine Preise auf der Seite.",
  icons: { icon: "/images/brand/fatlum-mark.svg" },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <HtmlLang />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
