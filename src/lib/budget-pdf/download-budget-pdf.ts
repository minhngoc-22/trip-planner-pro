import {
  buildBudgetPdfDocument,
  type BudgetPdfPayload,
} from "@/lib/budget-pdf/budget-pdf-document";

function slugify(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || "trip";
}

export async function downloadBudgetPdf(
  payload: BudgetPdfPayload,
): Promise<void> {
  const doc = await buildBudgetPdfDocument({
    ...payload,
    generatedAt: payload.generatedAt ?? new Date(),
  });
  doc.save(`${slugify(payload.tripTitle)}-budget.pdf`);
}
