export type CurrencyCode = "VND" | "USD" | "EUR" | "GBP" | "JPY" | "SGD" | "AUD";

export interface CurrencyConfig {
  code: CurrencyCode;
  name: string;
  symbol: string;
  decimals: number;
  /** Approximate static reference rate: how many VND equal 1 unit of this currency. */
  vndPerUnit: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  VND: {
    code: "VND",
    name: "Vietnamese Dong",
    symbol: "₫",
    decimals: 0,
    vndPerUnit: 1,
  },
  USD: {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    decimals: 2,
    vndPerUnit: 25400,
  },
  EUR: {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    decimals: 2,
    vndPerUnit: 27500,
  },
  GBP: {
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    decimals: 2,
    vndPerUnit: 32200,
  },
  JPY: {
    code: "JPY",
    name: "Japanese Yen",
    symbol: "¥",
    decimals: 0,
    vndPerUnit: 165,
  },
  SGD: {
    code: "SGD",
    name: "Singapore Dollar",
    symbol: "S$",
    decimals: 2,
    vndPerUnit: 18900,
  },
  AUD: {
    code: "AUD",
    name: "Australian Dollar",
    symbol: "A$",
    decimals: 2,
    vndPerUnit: 16600,
  },
};

export const CURRENCY_LIST: CurrencyConfig[] = Object.values(CURRENCIES);

export function roundForCurrency(amount: number, code: CurrencyCode): number {
  const { decimals } = CURRENCIES[code];
  const factor = 10 ** decimals;
  return Math.round(amount * factor) / factor;
}

export function convertCurrency(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
): number {
  if (!Number.isFinite(amount) || from === to) return amount;
  const amountInVnd = amount * CURRENCIES[from].vndPerUnit;
  const converted = amountInVnd / CURRENCIES[to].vndPerUnit;
  return roundForCurrency(converted, to);
}

export function formatCurrency(amount: number, code: CurrencyCode): string {
  const config = CURRENCIES[code] ?? CURRENCIES.VND;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: config.code,
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function getCurrencyPlaceholder(code: CurrencyCode): string {
  const config = CURRENCIES[code] ?? CURRENCIES.VND;
  return config.decimals === 0 ? `0 ${config.symbol}` : `${config.symbol}0.00`;
}

export function getCurrencyExamplePlaceholder(code: CurrencyCode): string {
  switch (code) {
    case "VND":
      return "e.g., 10,000,000";
    case "JPY":
      return "e.g., 150,000";
    default:
      return "e.g., 1,500.00";
  }
}
