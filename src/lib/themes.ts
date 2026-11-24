export type ThemeId = "lavender" | "ocean" | "sage" | "sand" | "midnight";
export type ThemeMode = "light" | "dark";

export interface PdfThemePalette {
  primary: [number, number, number];
  primaryLight: [number, number, number];
  primaryPale: [number, number, number];
  text: [number, number, number];
  muted: [number, number, number];
  border: [number, number, number];
}

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  description: string;
  swatches: {
    light: { bg: string; primary: string; secondary: string };
    dark: { bg: string; primary: string; secondary: string };
  };
  pdfPalette: PdfThemePalette;
}

export const THEMES: Record<ThemeId, ThemeDefinition> = {
  lavender: {
    id: "lavender",
    name: "Lavender Dream",
    description: "Soft purple and lavender with warm plum accents.",
    swatches: {
      light: { bg: "#f7eef7", primary: "#9e70c7", secondary: "#1770b0" },
      dark: { bg: "#1a1025", primary: "#b88fd9", secondary: "#5ba0d9" },
    },
    pdfPalette: {
      primary: [158, 112, 199],
      primaryLight: [237, 224, 237],
      primaryPale: [247, 238, 247],
      text: [75, 34, 93],
      muted: [122, 93, 138],
      border: [220, 200, 224],
    },
  },
  ocean: {
    id: "ocean",
    name: "Ocean Breeze",
    description: "Crisp coastal blue and refreshing seafoam teal.",
    swatches: {
      light: { bg: "#eef7fb", primary: "#0284c7", secondary: "#0d9488" },
      dark: { bg: "#0c1926", primary: "#38bdf8", secondary: "#2dd4bf" },
    },
    pdfPalette: {
      primary: [2, 132, 199],
      primaryLight: [224, 242, 254],
      primaryPale: [240, 249, 255],
      text: [12, 45, 72],
      muted: [71, 107, 133],
      border: [186, 222, 242],
    },
  },
  sage: {
    id: "sage",
    name: "Sage Nature",
    description: "Calm botanical sage green and earthy olive tones.",
    swatches: {
      light: { bg: "#f1f6f1", primary: "#4d7c5b", secondary: "#846442" },
      dark: { bg: "#111c15", primary: "#6eb884", secondary: "#c79c6e" },
    },
    pdfPalette: {
      primary: [77, 124, 91],
      primaryLight: [225, 237, 227],
      primaryPale: [241, 246, 241],
      text: [30, 54, 38],
      muted: [88, 114, 95],
      border: [194, 217, 198],
    },
  },
  sand: {
    id: "sand",
    name: "Warm Sand",
    description: "Sunlit cream, terracotta, and rich espresso brown.",
    swatches: {
      light: { bg: "#faf5ee", primary: "#b45309", secondary: "#0f766e" },
      dark: { bg: "#1f1812", primary: "#f59e0b", secondary: "#2dd4bf" },
    },
    pdfPalette: {
      primary: [180, 83, 9],
      primaryLight: [245, 232, 214],
      primaryPale: [250, 245, 238],
      text: [67, 43, 24],
      muted: [124, 96, 70],
      border: [228, 210, 187],
    },
  },
  midnight: {
    id: "midnight",
    name: "Midnight",
    description: "Cool slate and electric indigo for focused planning.",
    swatches: {
      light: { bg: "#f1f5f9", primary: "#4f46e5", secondary: "#0284c7" },
      dark: { bg: "#0b1120", primary: "#818cf8", secondary: "#38bdf8" },
    },
    pdfPalette: {
      primary: [79, 70, 229],
      primaryLight: [224, 231, 255],
      primaryPale: [241, 245, 249],
      text: [15, 23, 42],
      muted: [71, 85, 105],
      border: [203, 213, 225],
    },
  },
};

export const THEME_LIST: ThemeDefinition[] = Object.values(THEMES);

export function isValidThemeId(value: string | null): value is ThemeId {
  return value !== null && value in THEMES;
}
