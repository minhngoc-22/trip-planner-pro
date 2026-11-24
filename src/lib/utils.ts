import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { formatCurrency, type CurrencyCode } from "@/lib/currency";
import { useCurrencyStore } from "@/stores/useCurrencyStore";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const budgetUtils = {
  getStatusColor: (percent: number) => {
    if (percent >= 100) return "text-destructive";
    if (percent >= 80) return "text-warning";
    return "text-secondary";
  },
  getBarColor: (percent: number) => {
    if (percent >= 100) return "bg-destructive";
    if (percent >= 80) return "bg-warning text-warning";
    return "bg-secondary";
  },
  getBgColor: (percent: number) => {
    if (percent <= 0) return "bg-destructive";
    if (percent <= 20) return "bg-warning text-warning";
    return "bg-secondary";
  },
  formatMoney: (amount: number, currencyCode?: CurrencyCode) => {
    const code = currencyCode ?? useCurrencyStore.getState().currency;
    return formatCurrency(amount, code);
  },
};

function to12Hour(time: string) {
  const hour = parseInt(time, 10);
  const minute = time.slice(3);
  const period = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return { formatted: `${h12}:${minute}`, period } as const;
}

export const formatStartToEndTime = (startTime: string, endTime?: string) => {
  const start = to12Hour(startTime);
  if (!endTime) return `${start.formatted} ${start.period}`;

  const end = to12Hour(endTime);
  if (start.period === end.period) {
    return `${start.formatted} - ${end.formatted} ${end.period}`;
  }
  return `${start.formatted} ${start.period} - ${end.formatted} ${end.period}`;
};
