import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom Ocean-Azure Color Palette
        ocean: {
          50: "rgb(var(--ocean-50) / <alpha-value>)",
          100: "rgb(var(--ocean-100) / <alpha-value>)",
          200: "rgb(var(--ocean-200) / <alpha-value>)",
          300: "rgb(var(--ocean-300) / <alpha-value>)",
          400: "rgb(var(--ocean-400) / <alpha-value>)",
          500: "rgb(var(--ocean-500) / <alpha-value>)",
          600: "rgb(var(--ocean-600) / <alpha-value>)",
          700: "rgb(var(--ocean-700) / <alpha-value>)",
          800: "rgb(var(--ocean-800) / <alpha-value>)",
          900: "rgb(var(--ocean-900) / <alpha-value>)",
          950: "rgb(var(--ocean-950) / <alpha-value>)",
        },
        azure: {
          50: "rgb(var(--azure-50) / <alpha-value>)",
          100: "rgb(var(--azure-100) / <alpha-value>)",
          200: "rgb(var(--azure-200) / <alpha-value>)",
          300: "rgb(var(--azure-300) / <alpha-value>)",
          400: "rgb(var(--azure-400) / <alpha-value>)",
          500: "rgb(var(--azure-500) / <alpha-value>)",
          600: "rgb(var(--azure-600) / <alpha-value>)",
          700: "rgb(var(--azure-700) / <alpha-value>)",
          800: "rgb(var(--azure-800) / <alpha-value>)",
          900: "rgb(var(--azure-900) / <alpha-value>)",
          950: "rgb(var(--azure-950) / <alpha-value>)",
        },
        teal: {
          50: "rgb(var(--teal-50) / <alpha-value>)",
          100: "rgb(var(--teal-100) / <alpha-value>)",
          200: "rgb(var(--teal-200) / <alpha-value>)",
          300: "rgb(var(--teal-300) / <alpha-value>)",
          400: "rgb(var(--teal-400) / <alpha-value>)",
          500: "rgb(var(--teal-500) / <alpha-value>)",
          600: "rgb(var(--teal-600) / <alpha-value>)",
          700: "rgb(var(--teal-700) / <alpha-value>)",
          800: "rgb(var(--teal-800) / <alpha-value>)",
          900: "rgb(var(--teal-900) / <alpha-value>)",
          950: "rgb(var(--teal-950) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-30px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(30px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(14, 165, 233, 0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(14, 165, 233, 0.5)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 6s ease-in-out infinite",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "slide-in-left": "slide-in-left 0.6s ease-out forwards",
        "slide-in-right": "slide-in-right 0.6s ease-out forwards",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        shimmer: "shimmer 1.5s infinite",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
      },
      aspectRatio: {
        "4/3": "4 / 3",
        "3/2": "3 / 2",
        "2/3": "2 / 3",
        "9/16": "9 / 16",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glow: "0 0 20px rgba(14, 165, 233, 0.3)",
        "glow-lg": "0 0 30px rgba(14, 165, 233, 0.4)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
