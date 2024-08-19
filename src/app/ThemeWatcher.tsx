"use client";

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

function ThemeWatcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.body.setAttribute('data-theme', theme as string);
    }
  }, [theme, mounted]);

  return null;
}

export default ThemeWatcher;