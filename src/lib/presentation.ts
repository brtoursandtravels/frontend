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
    if (typeof value === "string" && value.trim()) return value.trim();
    const record = asObject(value);
    for (const property of ["value", "text", "url", "href", "label"]) {
      const candidate = record[property];
      if (typeof candidate === "string" && candidate.trim())
        return candidate.trim();
    }
  }
  return null;
}

export function whatsappLink(value: string | null | undefined) {
  if (!value) return null;
  if (/^https:\/\/(?:wa\.me|api\.whatsapp\.com)\//i.test(value)) return value;
  const digits = value.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : null;
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
    return url.protocol === "https:" && trustedHost ? url.toString() : null;
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
