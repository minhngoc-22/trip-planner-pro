import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useActiveTripMeta } from "@/hooks";
import { downloadBudgetPdf } from "@/lib/budget-pdf";
import { useBudgetStore, useCurrencyStore } from "@/stores";

export function BudgetExportActions() {
  const [exporting, setExporting] = useState(false);
  const { title, dateRange } = useActiveTripMeta();
  const totalBudget = useBudgetStore((s) => s.totalBudget);
  const expenses = useBudgetStore((s) => s.expenses);
  const currency = useCurrencyStore((s) => s.currency);

  const hasData = totalBudget > 0 || expenses.length > 0;

  async function handleDownloadPdf() {
    if (!hasData || exporting) return;
    setExporting(true);
    try {
      await downloadBudgetPdf({
        tripTitle: title,
        dateRange,
        totalBudget,
        expenses,
        currency,
      });
    } finally {
      setExporting(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="gap-1.5"
      disabled={!hasData || exporting}
      onClick={handleDownloadPdf}
    >
      {exporting ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : (
        <FileDown className="size-4" aria-hidden />
      )}
      {exporting ? "Exporting…" : "Export Budget PDF"}
    </Button>
  );
}
