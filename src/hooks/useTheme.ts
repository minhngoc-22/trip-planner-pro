import { useCallback, useEffect, useState } from "react";

import { STORAGE_KEYS } from "@/constants/storage-keys";
import { isValidThemeId, type ThemeId, type ThemeMode } from "@/lib/themes";

function getInitialMode(): ThemeMode {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(STORAGE_KEYS.THEME_MODE);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getInitialColorTheme(): ThemeId {
  if (typeof window === "undefined") return "lavender";
  const stored = localStorage.getItem(STORAGE_KEYS.COLOR_THEME);
  return isValidThemeId(stored) ? stored : "lavender";
}

function applyThemeToDom(colorTheme: ThemeId, mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", colorTheme);
  if (mode === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
  } else {
    root.classList.remove("dark");
    root.classList.add("light");
  }
}

export function initTheme() {
  applyThemeToDom(getInitialColorTheme(), getInitialMode());
}

export function getActiveColorTheme(): ThemeId {
  if (typeof document !== "undefined") {
    const attr = document.documentElement.getAttribute("data-theme");
    if (isValidThemeId(attr)) return attr;
  }
  return getInitialColorTheme();
}

export function useTheme() {
  const [mode, setModeState] = useState<ThemeMode>(getInitialMode);
  const [colorTheme, setColorThemeState] = useState<ThemeId>(getInitialColorTheme);

  useEffect(() => {
    applyThemeToDom(colorTheme, mode);
    localStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
    localStorage.setItem(STORAGE_KEYS.COLOR_THEME, colorTheme);
  }, [colorTheme, mode]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.THEME_MODE && (e.newValue === "light" || e.newValue === "dark")) {
        setModeState(e.newValue);
      }
      if (e.key === STORAGE_KEYS.COLOR_THEME && isValidThemeId(e.newValue)) {
        setColorThemeState(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
  }, []);

  const setColorTheme = useCallback((next: ThemeId) => {
    setColorThemeState(next);
  }, []);

  return {
    theme: mode,
    mode,
    colorTheme,
    toggleTheme: toggleMode,
    toggleMode,
    setMode,
    setColorTheme,
  } as const;
}
