import type { Metadata } from "next";
import type { Locale } from "./i18n";
import { siteUrl } from "./site";

export function pageMeta(l: Locale, title: string, description: string, path = ""): Metadata {
  const base = siteUrl();
  return {
    title,
    description,
    alternates: { languages: { de: `${base}/de${path}`, en: `${base}/en${path}`, "x-default": `${base}/de${path}` } },
    openGraph: { title, description, locale: l === "de" ? "de_DE" : "en_GB", url: `${base}/${l}${path}` },
    robots: { index: false, follow: false },
  };
}
