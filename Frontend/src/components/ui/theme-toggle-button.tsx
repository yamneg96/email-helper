import React from "react";
import { useThemeStore } from "@/shared/hooks/useThemeStore";
import {Sun, Moon} from 'lucide-react'

export default function ThemeToggleButton(): React.ReactElement {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-lg border border-stroke-strong bg-card px-3 py-1.5 text-xs font-semibold text-text-medium shadow-sm transition hover:border-primary hover:text-primary"
      aria-label="Toggle theme"
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <span className="material-symbols-outlined text-[16px]">
        {isDark ? <Sun /> : <Moon />}
      </span>
    </button>
  );
}
