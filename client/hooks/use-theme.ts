import { useEffect, useState } from "react";

export type ThemeMode = "light" | "dark";
const STORAGE_KEY = "alumni-theme";

export function useTheme(): [ThemeMode, (mode: ThemeMode) => void, () => void] {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (stored === "light" || stored === "dark") return stored;
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = (mode: ThemeMode) => setThemeState(mode);
  const toggle = () => setThemeState((t) => (t === "dark" ? "light" : "dark"));

  return [theme, setTheme, toggle];
}
