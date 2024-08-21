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
    console.log("useEffect [setTheme] triggered");
    const savedTheme = localStorage.getItem("theme");
    console.log("Saved theme from localStorage:", savedTheme);
    if (savedTheme) {
      setTheme(savedTheme);
      setIsDarkMode(savedTheme === "dark");
      console.log("Theme set to:", savedTheme);
      console.log("Is dark mode:", savedTheme === "dark");
    
    } else {
      setTheme("light");
      setIsDarkMode(false);
      console.log("No saved theme found, setting to light mode");
    }
    setMounted(true);
    console.log("Component mounted");
  }, [setTheme]);

  useEffect(() => {
    console.log("useEffect [resolvedTheme] triggered");
    if (resolvedTheme) {
      localStorage.setItem("theme", resolvedTheme);
      setIsDarkMode(resolvedTheme === "dark");
      console.log("Updated localStorage and isDarkMode based on resolvedTheme");
    }
  }, [resolvedTheme]);

  if (!mounted) {
    console.log("Component not yet mounted, returning null");
    return null;
  }
  console.log("Rendering ThemeSwitcher component, isDarkMode:", isDarkMode);
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
