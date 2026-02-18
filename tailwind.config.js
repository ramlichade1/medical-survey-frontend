// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        display: ["Lora", "Georgia", "serif"],
        body:    ["Nunito", "Helvetica Neue", "sans-serif"],
      },
      colors: {
        teal: {
          50:  "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
        navy: {
          DEFAULT: "#0a2540",
          700: "#0c3a5e",
          800: "#081c32",
        },
      },
      borderRadius: {
        xl:   "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
      spacing: {
        // 8px base unit multiples
        "1": "8px",
        "2": "16px",
        "3": "24px",
        "4": "32px",
        "5": "40px",
        "6": "48px",
        "7": "56px",
        "8": "64px",
      },
      boxShadow: {
        soft:    "0 2px 16px 0 rgba(0,0,0,0.06)",
        teal:    "0 8px 32px -4px rgba(13,148,136,0.28)",
        "teal-xl": "0 16px 48px -8px rgba(13,148,136,0.32)",
        navy:    "0 8px 40px -8px rgba(10,37,64,0.16)",
      },
      animation: {
        "fade-up":    "fadeUp 0.5s ease both",
        "pulse-ring": "pulse-ring 2.4s ease infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-ring": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(13, 148, 136, 0.4)" },
          "50%":      { boxShadow: "0 0 0 8px rgba(13, 148, 136, 0)" },
        },
      },
    },
  },
  plugins: [],
};
