import type { Metadata, Viewport } from "next";
import "./globals.css";
import { HtmlLang } from "@/components/html-lang";
import { Providers } from "@/components/providers";
import { FAMILY } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || FAMILY.diamonds),
  title: { default: "Fatlum Diamonds", template: "%s · Fatlum Diamonds" },
  description: "Lose Diamanten von Fatlum in München. Suche, Vergleich und persönliche Preisanfrage. Keine Preise, keine Kasse.",
  applicationName: "Fatlum Diamonds",
  authors: [{ name: "Fatlum" }],
  openGraph: { siteName: "Fatlum Diamonds", type: "website" },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#f6f4f0",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
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
