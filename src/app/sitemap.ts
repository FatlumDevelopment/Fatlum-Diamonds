import type { MetadataRoute } from "next";
import stones from "../../data/stones.json";
import { TOPICS } from "@/lib/content";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const paths = [
    "",
    "/diamanten",
    "/wissen",
    ...TOPICS.map((topic) => `/wissen/${topic}`),
    "/faq",
    "/ueber-uns",
    "/kontakt",
    "/impressum",
    "/datenschutz",
    "/agb",
    "/anfrage",
    "/vergleich",
    ...(stones as { slug: string }[]).map((stone) => `/diamanten/${stone.slug}`),
  ];
  const now = new Date();
  return paths.flatMap((path) =>
    (["de", "en"] as const).map((locale) => ({
      url: `${base}/${locale}${path}`,
      lastModified: now,
      alternates: {
        languages: {
          de: `${base}/de${path}`,
          en: `${base}/en${path}`,
        },
      },
    })),
  );
}
