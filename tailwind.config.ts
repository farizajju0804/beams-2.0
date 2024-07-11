import type { Config } from "tailwindcss"
import {nextui} from "@nextui-org/react";
const config = {
  darkMode: "class",
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
	],
  prefix: "",
  theme: {
    
    extend: {
      colors: {
        brand: {
          950: '#f96f2e',
          100: '#FFF5ED'
        },
        secondary : {
          900 : '#ffd25d'
        },
        black : '#181818'
      },
      fontFamily: {
        'display' : 'Clover'
      },
      aspectRatio: {
        '9/16': '9 / 16',
      },
      
    },
  },
  plugins: [require("tailwindcss-animate"),nextui(
 {
    themes: {
      light: {
        colors: {
          primary : "#f96f2e",
          warning : "#ffd25d"
        },
      },
      dark: {
        colors: {},
      },
    },
  } 
  )],
} satisfies Config

export default config