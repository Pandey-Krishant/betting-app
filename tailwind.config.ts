import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
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
      fontFamily: {
        sans: ['Tahoma', 'Helvetica', 'sans-serif'],
      },
      fontSize: {
        'body': '14px',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "var(--body-bg)",
        foreground: "#23282c",
        header: {
          bg: "var(--header-bg)",
          text: "#ffffff"
        },
        sports: {
          from: "var(--sports-gradient)",
          to: "var(--sports-gradient)",
          active: "#ffffff"
        },
        exchange: {
          from: "var(--exchange-gradient)",
          to: "var(--exchange-gradient)"
        },
        back: {
          1: "var(--back-1)",
          2: "var(--back-2)",
          3: "var(--back-3)",
          selected: "#1a8ee1",
          slip: "#beddf4"
        },
        lay: {
          1: "var(--lay-1)",
          2: "var(--lay-2)",
          3: "var(--lay-3)",
          selected: "#f4496d",
          slip: "#f3dce2"
        },
        bookmaker: "#faf8d8",
        fancy: {
          from: "var(--fancy-gradient)",
          to: "var(--fancy-gradient)"
        },
        sportsbook: {
          from: "#f26d1c",
          to: "#d14100"
        },
        match: {
          name: "var(--match-name)",
          time: "#777",
          inplay: "#508d0e"
        },
        pl: {
          plus: "var(--pl-plus)",
          minus: "var(--pl-minus)"
        },
        suspended: "#ca1010",
        gold: "#ffb900"
      },
      backgroundImage: {
        'header-gradient': 'var(--header-bg)',
        'sports-gradient': 'var(--sports-gradient)',
        'exchange-gradient': 'var(--exchange-gradient)',
        'fancy-gradient': 'var(--fancy-gradient)',
        'sportsbook-gradient': 'linear-gradient(180deg, #f26d1c 15%, #d14100 100%)',
        'login-btn-bg': 'var(--login-btn-bg)',
        'bottom-nav-gradient': 'linear-gradient(-180deg, #243a48 20%, #172732 91%)',
        'bottom-nav-active': 'linear-gradient(-180deg, #32617f 20%, #1f4258 91%)',
        'back-gradient': 'linear-gradient(90deg, rgba(130,183,221,.15) 0, rgba(130,183,221,.8) 65%)',
        'lay-gradient': 'linear-gradient(270deg, rgba(231,170,184,.15) 5%, rgba(231,170,184,.8) 60%)',
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
        "inplay-pulse": {
          "0%, 100%": { color: "#508d0e" },
          "50%": { color: "#d0021b" },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "inplay-pulse": "inplay-pulse 2s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
