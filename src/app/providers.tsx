"use client"; // Ensures this component runs on the client side

// Import NextUIProvider for NextUI's global styles and components
import { NextUIProvider } from '@nextui-org/react';

// Import NextThemesProvider for handling dynamic theming via next-themes
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Providers component that wraps its children with the necessary theme and UI context
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // NextUIProvider to provide global styles and context for NextUI components
    <NextUIProvider>
    
      <NextThemesProvider attribute="data-theme" defaultTheme="light">
        {children} 
      </NextThemesProvider>
    </NextUIProvider>
  );
}
