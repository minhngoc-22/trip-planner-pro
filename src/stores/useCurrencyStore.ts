import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { STORAGE_KEYS } from "@/constants/storage-keys";
import { convertCurrency, type CurrencyCode } from "@/lib/currency";
import { useBudgetStore } from "@/stores/useBudgetStore";
import { useTripStore } from "@/stores/useTripStore";
import type { TripFeaturesRegistry } from "@/types/trip-data";

interface CurrencyState {
  currency: CurrencyCode;
  setCurrency: (next: CurrencyCode) => void;
}

function convertStoredTripFeaturesRegistry(
  from: CurrencyCode,
  to: CurrencyCode,
): void {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem(STORAGE_KEYS.TRIP_FEATURES);
  if (!raw) return;

  try {
    const registry = JSON.parse(raw) as TripFeaturesRegistry;
    if (!registry || typeof registry !== "object") return;

    const updated: TripFeaturesRegistry = {};
    for (const [tripId, data] of Object.entries(registry)) {
      updated[tripId] = {
        ...data,
        budget: {
          totalBudget: convertCurrency(data.budget.totalBudget, from, to),
          expenses: data.budget.expenses.map((exp) => ({
            ...exp,
            estimatedCost: convertCurrency(exp.estimatedCost, from, to),
            actualCost: convertCurrency(exp.actualCost, from, to),
          })),
        },
      };
    }

    localStorage.setItem(STORAGE_KEYS.TRIP_FEATURES, JSON.stringify(updated));
  } catch {
    // Ignore malformed storage entries
  }
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currency: "VND",

      setCurrency: (next) => {
        const prev = get().currency;
        if (prev === next) return;

        // Convert active budget store
        const budgetState = useBudgetStore.getState();
        useBudgetStore.setState({
          totalBudget: convertCurrency(budgetState.totalBudget, prev, next),
          expenses: budgetState.expenses.map((exp) => ({
            ...exp,
            estimatedCost: convertCurrency(exp.estimatedCost, prev, next),
            actualCost: convertCurrency(exp.actualCost, prev, next),
          })),
        });

        // Convert all trips in trip store
        const tripState = useTripStore.getState();
        useTripStore.setState({
          trips: tripState.trips.map((trip) => ({
            ...trip,
            budget: convertCurrency(trip.budget, prev, next),
          })),
        });

        // Convert persisted feature registry for inactive trips
        convertStoredTripFeaturesRegistry(prev, next);

        set({ currency: next });
      },
    }),
    {
      name: STORAGE_KEYS.CURRENCY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ currency: state.currency }),
    },
  ),
);
