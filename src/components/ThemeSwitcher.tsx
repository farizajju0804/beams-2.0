"use client";

import React, { useEffect, useState } from "react";
import { Switch } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { MoonIcon } from "./MoonIcon";
import { SunIcon } from "./SunIcon";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      setIsDarkMode(savedTheme === "dark");
    
    } else {
      setTheme("light");
      setIsDarkMode(false);
    }
    setMounted(true);
  }, [setTheme]);

  useEffect(() => {
    if (resolvedTheme) {
      localStorage.setItem("theme", resolvedTheme);
      setIsDarkMode(resolvedTheme === "dark");
    }
  }, [resolvedTheme]);

  if (!mounted) {
    
    return null;
  }
  
  return (
    <div className="flex items-center space-x-4">
      <Switch
        defaultSelected={isDarkMode}
        onChange={(e) => {
          const newTheme = e.target.checked ? "dark" : "light";
          setTheme(newTheme);
          setIsDarkMode(e.target.checked);
        }}
        size="lg"
        color="primary"
        startContent={<SunIcon />}
        endContent={<MoonIcon />}
      />
    </div>
  );
}
