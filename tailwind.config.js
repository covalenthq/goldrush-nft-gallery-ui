const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
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
        danger: "#FA3D1D",
        success: "#4BD17E",
        primary: {
          dark: {
            DEFAULT: "var(--grk-primary-dark-DEFAULT)",
            100: "var(--grk-primary-dark-100)",
            200: "var(--grk-primary-dark-200)",
            300: "var(--grk-primary-dark-300)",
            400: "var(--grk-primary-dark-400)",
            500: "var(--grk-primary-dark-500)",
            600: "var(--grk-primary-dark-600)",
            700: "var(--grk-primary-dark-700)",
            800: "var(--grk-primary-dark-800)",
            900: "var(--grk-primary-dark-900)",
          },
          light: {
            DEFAULT: "var(--grk-primary-light-DEFAULT)",
            100: "var(--grk-primary-light-100)",
            200: "var(--grk-primary-light-200)",
            300: "var(--grk-primary-light-300)",
            400: "var(--grk-primary-light-400)",
            500: "var(--grk-primary-light-500)",
            600: "var(--grk-primary-light-600)",
            700: "var(--grk-primary-light-700)",
            800: "var(--grk-primary-light-800)",
            900: "var(--grk-primary-light-900)",
          },
        },
        background: {
          light: "var(--grk-background-light)",
          dark: "var(--grk-background-dark)",
        },
        foreground: {
          dark: "var(--grk-foreground-dark)",
          light: "var(--grk-foreground-light)",
        },
        secondary: {
          dark: "var(--grk-secondary-dark)",
          light: "var(--grk-secondary-light)",
        },
        fill: {
          DEFAULT: "var(--grk-primary-light)",
        },
        ring: {
          DEFAULT: "var(--grk-primary-light)",
        },
        stroke: {
          DEFAULT: "var(--grk-primary-light)",
        },
      },
      borderColor: {
        light: "var(--grk-secondary-light)",
        dark: "var(--grk-secondary-dark)",
      },
      borderRadius: {
        DEFAULT: "var(--grk-border-radius)",
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--grk-radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: {
            height: "var(--grk-radix-accordion-content-height)",
          },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
