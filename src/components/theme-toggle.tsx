"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && resolvedTheme === "dark";
  return (
    <button
      aria-label="Ganti tema"
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="rounded-md border border-border p-2 text-muted transition hover:text-fg"
    >
      {mounted ? (dark ? <Sun size={16} /> : <Moon size={16} />) : <span className="block h-4 w-4" />}
    </button>
  );
}
