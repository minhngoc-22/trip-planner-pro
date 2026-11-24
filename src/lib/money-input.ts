import { CURRENCIES, type CurrencyCode } from "@/lib/currency";
import { useCurrencyStore } from "@/stores/useCurrencyStore";

/**
 * Format numeric input for display using en-GB grouping (`,` for thousands, `.` for decimals).
 * Respects the active currency's decimal places (0 for VND/JPY, 2 for USD/EUR/GBP/etc.).
 */
export function formatMoneyInput(
  value: string | number | undefined,
  currencyCode?: CurrencyCode,
): string {
  if (value === undefined || value === null || value === "") return "";
  const code = currencyCode ?? useCurrencyStore.getState().currency;
  const decimals = CURRENCIES[code]?.decimals ?? 0;

  if (decimals === 0) {
    const numericString = String(value).replace(/\D/g, "");
    if (!numericString) return "";
    return new Intl.NumberFormat("en-GB", {
      maximumFractionDigits: 0,
    }).format(Number(numericString));
  }

  const raw = String(value).replace(/,/g, "").replace(/[^\d.]/g, "");
  if (!raw) return "";

  const parts = raw.split(".");
  const intPart = parts[0] ?? "";
  const hasDot = parts.length > 1;
  const decPart = hasDot ? parts.slice(1).join("").slice(0, decimals) : "";

  const formattedInt = intPart
    ? new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(
        Number(intPart),
      )
    : "0";

  return hasDot ? `${formattedInt}.${decPart}` : formattedInt;
}

/** Parse formatted en-GB money string to a number. */
export function parseMoneyInput(
  value: string | number | undefined,
  currencyCode?: CurrencyCode,
): number {
  if (value === undefined || value === null || value === "") return 0;
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;

  const code = currencyCode ?? useCurrencyStore.getState().currency;
  const decimals = CURRENCIES[code]?.decimals ?? 0;

  const cleaned = value.replace(/,/g, "").trim();
  if (!cleaned) return 0;

  const parsed = Number(cleaned);
  if (!Number.isFinite(parsed)) return 0;

  if (decimals === 0) return Math.round(parsed);
  const factor = 10 ** decimals;
  return Math.round(parsed * factor) / factor;
}
