import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { getActiveColorTheme } from "@/hooks/useTheme";
import { formatCurrency, type CurrencyCode } from "@/lib/currency";
import {
  PDF_FONT_FAMILY,
  registerPdfUnicodeFonts,
} from "@/lib/itinerary-pdf/pdf-fonts";
import { THEMES, type PdfThemePalette } from "@/lib/themes";
import type { Expense } from "@/types/budget";

export interface BudgetPdfPayload {
  tripTitle: string;
  dateRange?: string;
  totalBudget: number;
  expenses: Expense[];
  currency: CurrencyCode;
  generatedAt?: Date;
}

const PAGE = {
  marginX: 14,
  marginTop: 16,
  width: 210,
  height: 297,
} as const;

type PdfColors = PdfThemePalette & { white: [number, number, number] };

function getPdfColors(): PdfColors {
  const themeId = getActiveColorTheme();
  return {
    ...THEMES[themeId].pdfPalette,
    white: [255, 255, 255],
  };
}

function drawPageFooter(
  doc: jsPDF,
  pageNumber: number,
  totalPages: number,
  COLORS: PdfColors,
) {
  const y = PAGE.height - 10;
  doc.setFont(PDF_FONT_FAMILY, "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.muted);
  doc.text("Trip Planner Pro · Budget export", PAGE.marginX, y);
  doc.text(
    `Page ${pageNumber} of ${totalPages}`,
    PAGE.width - PAGE.marginX,
    y,
    { align: "right" },
  );
}

export async function buildBudgetPdfDocument(
  payload: BudgetPdfPayload,
): Promise<jsPDF> {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  await registerPdfUnicodeFonts(doc);

  const COLORS = getPdfColors();
  const fmt = (amount: number) => formatCurrency(amount, payload.currency);

  let y = 40;
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, PAGE.width, 28, "F");

  doc.setFont(PDF_FONT_FAMILY, "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.white);
  doc.text("Trip Planner Pro", PAGE.marginX, 12);

  doc.setFont(PDF_FONT_FAMILY, "normal");
  doc.setFontSize(8);
  doc.text(`Budget (${payload.currency})`, PAGE.width - PAGE.marginX, 12, {
    align: "right",
  });

  doc.setTextColor(...COLORS.text);
  doc.setFont(PDF_FONT_FAMILY, "bold");
  doc.setFontSize(20);
  doc.text(payload.tripTitle || "Trip Budget", PAGE.marginX, y);

  y += 9;
  doc.setFont(PDF_FONT_FAMILY, "normal");
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.muted);
  if (payload.dateRange) {
    doc.text(payload.dateRange, PAGE.marginX, y);
    y += 6;
  }

  const generated = (payload.generatedAt ?? new Date()).toLocaleString(
    "en-GB",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  );
  doc.setFontSize(9);
  doc.text(`Generated ${generated}`, PAGE.marginX, y);
  y += 10;

  const totalEstimated = payload.expenses.reduce(
    (sum, exp) => sum + (exp.estimatedCost ?? 0),
    0,
  );
  const totalActual = payload.expenses.reduce(
    (sum, exp) => sum + (exp.actualCost ?? 0),
    0,
  );
  const remaining = payload.totalBudget - totalActual;

  autoTable(doc, {
    startY: y,
    margin: { left: PAGE.marginX, right: PAGE.marginX },
    head: [["Total Budget", "Total Estimated", "Total Actual", "Remaining"]],
    body: [
      [
        fmt(payload.totalBudget),
        fmt(totalEstimated),
        fmt(totalActual),
        fmt(remaining),
      ],
    ],
    theme: "grid",
    styles: {
      font: PDF_FONT_FAMILY,
      fontSize: 9,
      cellPadding: 3,
      textColor: COLORS.text,
      fillColor: COLORS.primaryPale,
      lineColor: COLORS.border,
      lineWidth: 0.1,
    },
    headStyles: {
      font: PDF_FONT_FAMILY,
      fillColor: COLORS.primary,
      textColor: COLORS.white,
      fontStyle: "bold",
      fontSize: 8.5,
    },
  });

  const summaryEnd = (
    doc as jsPDF & { lastAutoTable?: { finalY: number } }
  ).lastAutoTable?.finalY;
  y = (summaryEnd ?? y) + 10;

  if (payload.expenses.length === 0) {
    doc.setFont(PDF_FONT_FAMILY, "normal");
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.muted);
    doc.text("No expenses recorded for this trip.", PAGE.marginX, y);
    drawPageFooter(doc, 1, 1, COLORS);
    return doc;
  }

  const rows = payload.expenses.map((exp) => {
    const diff = exp.estimatedCost - (exp.actualCost ?? 0);
    const diffText =
      exp.actualCost === 0
        ? "-"
        : `${diff < 0 ? "-" : "+"}${fmt(Math.abs(diff))}`;
    return [
      exp.name,
      exp.category,
      fmt(exp.estimatedCost),
      fmt(exp.actualCost),
      diffText,
      exp.paymentStatus,
    ];
  });

  autoTable(doc, {
    startY: y,
    margin: { left: PAGE.marginX, right: PAGE.marginX },
    head: [["Item", "Category", "Estimated", "Actual", "Difference", "Status"]],
    body: rows,
    theme: "grid",
    styles: {
      font: PDF_FONT_FAMILY,
      fontSize: 8,
      cellPadding: 2.5,
      textColor: COLORS.text,
      fillColor: COLORS.white,
      lineColor: COLORS.border,
      lineWidth: 0.1,
    },
    alternateRowStyles: {
      font: PDF_FONT_FAMILY,
      fillColor: COLORS.primaryPale,
    },
    headStyles: {
      font: PDF_FONT_FAMILY,
      fillColor: COLORS.primary,
      textColor: COLORS.white,
      fontStyle: "bold",
      fontSize: 8,
    },
    didParseCell(data) {
      data.cell.styles.font = PDF_FONT_FAMILY;
    },
  });

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i += 1) {
    doc.setPage(i);
    drawPageFooter(doc, i, totalPages, COLORS);
  }

  return doc;
}
