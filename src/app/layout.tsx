import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { HtmlLang } from "@/components/html-lang";
import { Providers } from "@/components/providers";
import { FAMILY } from "@/lib/site";

const inter = localFont({
  src: [
    { path: "../../node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../node_modules/@fontsource/inter/files/inter-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
  adjustFontFallback: "Arial",
});

const cormorant = localFont({
  src: [
    { path: "../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-cormorant",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

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
    <html lang="de" className={`${inter.variable} ${cormorant.variable}`}>
      <body>
        <HtmlLang />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
