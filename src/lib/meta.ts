import type { Metadata } from "next";
import type { Locale } from "./i18n";
import { siteUrl } from "./site";

export function pageMeta(l: Locale, title: string, description: string, path = ""): Metadata {
  const base = siteUrl();
  const url = `${base}/${l}${path}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        de: `${base}/de${path}`,
        en: `${base}/en${path}`,
        "x-default": `${base}/de${path}`,
      },
    },
    openGraph: {
      title,
      description,
      locale: l === "de" ? "de_DE" : "en_GB",
      url,
      siteName: "Fatlum Diamonds",
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true },
  };
}
