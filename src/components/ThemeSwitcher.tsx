"use client";

import React, { useEffect, useState } from "react";
import { Switch } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { MoonIcon } from "./MoonIcon";
import { SunIcon } from "./SunIcon";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    // Ensure the component is mounted and theme is set from local storage if available
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Default to light theme if no theme is found in local storage
      setTheme("light");
    }
    setMounted(true);
  }, [setTheme]);

  useEffect(() => {
    if (resolvedTheme) {
      localStorage.setItem("theme", resolvedTheme);
    }
  }, [resolvedTheme]);

  if (!mounted) return null;

  return (
    <div className="flex items-center space-x-4">
      <Switch
        checked={theme === "dark"}
        onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
        size="lg"
        color="primary"
        startContent={<SunIcon />}
        endContent={<MoonIcon />}
      />
    </div>
  );
}
