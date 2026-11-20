import { headers } from "next/headers";
import { NotFoundView } from "@/components/not-found-view";
import type { Locale } from "@/lib/i18n";

export default async function NotFound() {
  const lang = (await headers()).get("x-locale") === "en" ? "en" : "de";
  const l: Locale = lang;
  return <NotFoundView l={l} />;
}
