import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        // Neo-Brutalism Primary Colors
        'neo-blue': '#0066FF',
        'neo-pink': '#FF3366',
        'neo-lime': '#CCFF00',
        'neo-yellow': '#FFE600',
        'neo-purple': '#9933FF',

        // Neo-Brutalism Base Colors
        'neo-white': '#FFFDF7',
        'neo-cream': '#FFF8E7',
        'neo-black': '#1A1A1A',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      borderWidth: {
        '3': '3px',
      },
      boxShadow: {
        'neo-sm': '1px 1px 0px 0px #1A1A1A',
        'neo': '2px 2px 0px 0px #1A1A1A',
        'neo-lg': '3px 3px 0px 0px #1A1A1A',
        'neo-xl': '4px 4px 0px 0px #1A1A1A',
        'neo-blue': '2px 2px 0px 0px #0066FF',
        'neo-pink': '2px 2px 0px 0px #FF3366',
        'neo-lime': '2px 2px 0px 0px #CCFF00',
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
