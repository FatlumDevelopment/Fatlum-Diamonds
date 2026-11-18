export const SITE_NAME = "Fatlum Diamonds";
export const CONTACT_EMAIL = "info@fatlum.diamonds";
export const CONTACT_PHONE = "+49 89 20 500 85858";
export const CONTACT_PHONE_HREF = "tel:+49892050085858";
export const ADDRESS = {
  street: "Maximilianstraße 2",
  postal: "80539",
  city: "München",
  countryDe: "Deutschland",
  countryEn: "Germany",
};

export const FAMILY = {
  gold: "https://honeydew-seahorse-267054.hostingersite.com",
  jewelry: "https://devoted-mintcream-goshawk-42.hostingersite.com",
  diamonds: "https://quantum-darkseagreen-salamander-62.hostingersite.com",
} as const;

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || FAMILY.diamonds).replace(/\/$/, "");
}
