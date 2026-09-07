import { formatDate, formatMoney, priceBasisLabel } from "./presentation";

export { formatDate, formatMoney, priceBasisLabel };

export function formatDuration(days: number, nights: number) {
  return `${nights} ${nights === 1 ? "night" : "nights"} / ${days} ${days === 1 ? "day" : "days"}`;
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-IN", { notation: "compact" }).format(value);
}
