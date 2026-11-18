"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function HtmlLang() {
  const path = usePathname() || "/de";
  useEffect(() => {
    const locale = path.split("/")[1] === "en" ? "en" : "de";
    document.documentElement.lang = locale;
  }, [path]);
  return null;
}
