"use client";

import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  function toggleTheme() {
    setTheme(isDark ? "light" : "dark");
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      aria-pressed={isDark}
      onClick={toggleTheme}
    >
      {isDark ? "Light" : "Dark"}
    </Button>
  );
}
