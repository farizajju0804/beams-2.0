import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  prefix: "",
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',  // Changed from 768px to 800px
      'lg': '1024px',
      'custom-md' : '769px'
    },
    extend: {
      colors: {
        background: "rgba(var(--color-background))",
        text: "rgba(var(--color-text))",
        brand: "rgba(var(--color-brand))",
        yellow : "rgba(var(--color-yellow))",
        purple : "rgba(var(--color-purple))",
        grey: {
          1: "rgba(var(--color-grey))",
          2: "rgba(var(--color-grey-2))",
          3: "rgba(var(--color-grey-3))",
          4: "rgba(var(--color-grey-4))"
        },
        secondary: {
          1: "rgba(var(--color-secondary-1))",
          2: "rgba(var(--color-secondary-2))",
          3: "rgba(var(--color-secondary-3))",
        },
        accent: "rgba(var(--color-accent))",
        black: '#181818',
      },
      fontFamily: {
        'display': 'Clover',
        'poppins': ['Poppins']
      },
      aspectRatio: {
        '4/3': '4 / 3',
      },
      animation: {
        spotlight: "spotlight 2s ease .75s 1 forwards",
      },
      keyframes: {
        spotlight: {
          "0%": {
            opacity: '0',
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: '1',
            transform: "translate(-50%,-40%) scale(1)",
          },
        },
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    nextui({
      themes: {
        light: {
          colors: {
            primary: "#f96f2e",
            warning: "#F9D42E",
            secondary: "#F9D42E",
            background: "#FFFFFF",
            foreground: "#181818",
          },
        },
        dark: {
          colors: {
            primary: "#f96f2e",
            warning: "#F9D42E",
            background: "#181818",
            secondary: "#F9D42E",
            foreground: "#FFFFFF",
          },
        },
      },
    })
  ],
} satisfies Config;

export default config;
