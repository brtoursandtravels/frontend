import type { SiteData } from "./contracts";

export function asObject(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function contentText(value: unknown, key: string, fallback = "") {
  const candidate = asObject(value)[key];
  return typeof candidate === "string" ? candidate : fallback;
}

export function contentNumber(value: unknown, key: string, fallback: number) {
  const candidate = asObject(value)[key];
  return typeof candidate === "number" && Number.isFinite(candidate)
    ? candidate
    : fallback;
}

export function contentArray(value: unknown, key: string) {
  const candidate = asObject(value)[key];
  return Array.isArray(candidate) ? candidate : [];
}

export function settingText(
  site: SiteData | null | undefined,
  keys: string[],
): string | null {
  for (const key of keys) {
    const value = site?.settings[key];
    if (typeof value === "string") return value.trim() || null;
    const record = asObject(value);
    for (const property of ["value", "text", "url", "href", "label"]) {
      const candidate = record[property];
      if (typeof candidate === "string") return candidate.trim() || null;
    }
  }
  return null;
}

// Calls and WhatsApp share the single phone field managed in Public settings.
export function contactPhone(site: SiteData | null | undefined) {
  return settingText(site, ["contact.phone", "business.phone", "phone"]);
}

export function whatsappLink(value: string | null | undefined) {
  if (!value) return null;
  const text = value.trim();
  if (/^\+?[\d\s().-]+$/.test(text)) {
    const digits = text.replace(/\D/g, "");
    return /^\d{7,15}$/.test(digits) ? `https://wa.me/${digits}` : null;
  }
  try {
    const url = new URL(text);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    if (url.hostname === "wa.me" && /^\/\d{7,15}\/?$/.test(url.pathname)) return url.toString();
    if (url.hostname === "api.whatsapp.com" && url.pathname === "/send" && /^\d{7,15}$/.test(url.searchParams.get("phone") ?? "")) return url.toString();
  } catch { /* Invalid links are not displayed. */ }
  return null;
}

export function socialLink(
  value: string | null | undefined,
  network: "facebook" | "instagram",
) {
  if (!value) return null;
  try {
    const url = new URL(value);
    const domain = `${network}.com`;
    const trustedHost =
      url.hostname === domain || url.hostname.endsWith(`.${domain}`);
    return url.protocol === "https:" && !url.username && !url.password && trustedHost ? url.toString() : null;
  } catch {
    return null;
  }
}

export function mapEmbedLink(value: string | null | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    const allowedHost = ["www.google.com", "maps.google.com"].includes(
      url.hostname,
    );
    const embedPath =
      url.pathname.startsWith("/maps/embed") ||
      url.searchParams.get("output") === "embed";
    return url.protocol === "https:" && allowedHost && embedPath
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

export function socialSettingLink(site: SiteData | null | undefined, network: "instagram" | "facebook") {
  const key = `social.${network}`;
  // An explicitly blank link means hidden, not a fallback to an older setting.
  const keys = site?.settings && Object.hasOwn(site.settings, key)
    ? [key]
    : [`contact.${network}`, network];
  return socialLink(settingText(site, keys), network);
}

export function formatMoney(amount: string, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

export function priceBasisLabel(basis: string) {
  return (
    {
      PER_PERSON: "per person",
      PER_GROUP: "per group",
      PER_ROOM: "per room",
      ON_REQUEST: "",
    }[basis] ?? ""
  );
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value.slice(0, 10)}T00:00:00.000Z`));
}
