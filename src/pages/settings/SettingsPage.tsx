import { Check, Coins, Moon, Palette, Sun } from "lucide-react";

import { BudgetExportActions } from "@/components/budget/BudgetExportActions";
import { ItineraryExportActions } from "@/components/itinerary";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useActiveTripMeta } from "@/hooks";
import { useTheme } from "@/hooks/useTheme";
import { CURRENCY_LIST, type CurrencyCode } from "@/lib/currency";
import { THEME_LIST } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { useCurrencyStore, useItineraryStore } from "@/stores";

export default function SettingsPage() {
  const { mode, colorTheme, toggleMode, setColorTheme } = useTheme();
  const currency = useCurrencyStore((s) => s.currency);
  const setCurrency = useCurrencyStore((s) => s.setCurrency);
  const { title, dateRange } = useActiveTripMeta();
  const days = useItineraryStore((s) => s.days);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 rounded-xl bg-muted/40 px-2 py-4 sm:px-4 sm:gap-5 md:px-6 md:py-6 md:gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your app preferences, currency, and colour themes.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Palette className="size-4 text-primary" />
            Appearance & Colour Theme
          </CardTitle>
          <CardDescription>
            Choose a colour palette and toggle between light and dark mode.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3">
            <div className="flex items-center gap-3">
              {mode === "dark" ? (
                <Moon className="size-5 text-muted-foreground" />
              ) : (
                <Sun className="size-5 text-muted-foreground" />
              )}
              <div>
                <p className="text-sm font-medium">
                  {mode === "dark" ? "Dark mode" : "Light mode"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Applies to the selected colour theme.
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={toggleMode}>
              Switch to {mode === "dark" ? "light" : "dark"} mode
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {THEME_LIST.map((item) => {
              const isSelected = colorTheme === item.id;
              const swatch = mode === "dark" ? item.swatches.dark : item.swatches.light;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setColorTheme(item.id)}
                  aria-pressed={isSelected}
                  className={cn(
                    "flex items-start justify-between gap-3 rounded-xl border p-3.5 text-left transition-all",
                    isSelected
                      ? "border-primary bg-primary/10 ring-1 ring-primary"
                      : "border-border bg-card hover:bg-muted/50",
                  )}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {item.name}
                      </span>
                      {isSelected ? (
                        <Check className="size-4 shrink-0 text-primary" />
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 pt-0.5">
                    <span
                      className="size-4 rounded-full border border-border"
                      style={{ backgroundColor: swatch.bg }}
                      title="Background"
                    />
                    <span
                      className="size-4 rounded-full border border-border"
                      style={{ backgroundColor: swatch.primary }}
                      title="Primary"
                    />
                    <span
                      className="size-4 rounded-full border border-border"
                      style={{ backgroundColor: swatch.secondary }}
                      title="Secondary"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Coins className="size-4 text-primary" />
            Currency
          </CardTitle>
          <CardDescription>
            Select your preferred currency. Existing trip budgets and expenses
            are converted automatically using built-in reference exchange rates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-medium text-foreground">
              Display & calculation currency
            </span>
            <Select
              value={currency}
              onValueChange={(val) => setCurrency(val as CurrencyCode)}
            >
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCY_LIST.map((item) => (
                  <SelectItem key={item.code} value={item.code}>
                    {item.code} ({item.symbol}) — {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Data Sharing</CardTitle>
          <CardDescription>
            Export your trip's itinerary or budget summary as a PDF document.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <BudgetExportActions />
            <ItineraryExportActions
              tripTitle={title}
              dateRange={dateRange}
              days={days}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
