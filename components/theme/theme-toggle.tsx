"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  mode?: "icon" | "inline";
  className?: string;
};

export function ThemeToggle({ mode = "icon", className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    if (mode === "inline") {
      return (
        <Button size="sm" variant="ghost" aria-label="Toggle theme" className={cn("w-full justify-start", className)}>
          <span className="sr-only">Toggle theme</span>
        </Button>
      );
    }
    return <Button size="icon" variant="outline" aria-label="Toggle theme" className={cn("opacity-0", className)} />;
  }

  const isDark = resolvedTheme === "dark";

  if (mode === "inline") {
    return (
      <Button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        size="sm"
        variant="ghost"
        className={cn("w-full justify-start", className)}
      >
        {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
        <span className="block lg:hidden">{isDark ? "Light" : "Dark"}</span>
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      size="icon"
      variant="outline"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "rounded-full border-[#fb7232]/30 bg-white/90 text-[#c75829] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#fff3ec] dark:border-[#fb7232]/40 dark:bg-[#211a17] dark:text-[#ffb489] dark:hover:bg-[#2c241f]",
        className
      )}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
