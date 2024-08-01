import type { Config } from "tailwindcss"
import {nextui} from "@nextui-org/react";
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
    
    extend: {
      colors: {
        background : "rgba(var(--color-background))",
        text : "rgba(var(--color-text))",
        brand : "rgba(var(--color-brand))",
        grey: {
          1 :  "rgba(var(--color-grey))",
          2 :  "rgba(var(--color-grey-2))"
        },
        secondary : {
          1 : "rgba(var(--color-secondary-1))",
          2 : "rgba(var(--color-secondary-2))",
          3 : "rgba(var(--color-secondary-3))"
        },
        accent : "rgba(var(--color-accent))",
        // brand: {
        //   950: '#f96f2e',
        //   100: '#FFF5ED'
        // },
        yellow : {
          900 : '#ffd25d'
        },
        black : '#181818'
      },
      fontFamily: {
        'display' : 'Clover'
      },
      aspectRatio: {
        '4/3': '4 / 3',
      },
      
    },
  },
  plugins: [require("tailwindcss-animate"),nextui(
 {
    themes: {
      light: {
        colors: {
          primary : "#f96f2e",
          warning : "#F9D42E",
          secondary : "#F9D42E",
          background: "#FFFFFF", 
          foreground: "#181818",
        },
      },
      dark: {
        colors: {
          primary : "#f96f2e",
          warning : "#F9D42E",
          background: "#181818", 
          secondary : "#F9D42E",
          foreground: "#FFFFFF",
        },
      },
    },
  } 
  )],
} satisfies Config

export default config