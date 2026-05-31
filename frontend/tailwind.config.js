/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f9ff",
          100: "#dff4ff",
          200: "#b7e8ff",
          300: "#7ed6ff",
          400: "#38bbff",
          500: "#0d9fff",
          600: "#007edc",
          700: "#0264b2",
          800: "#075493",
          900: "#0c4679"
        }
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        sans: ["Manrope", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(56, 189, 248, 0.25), 0 20px 60px rgba(14, 165, 233, 0.18)"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top, rgba(13,159,255,0.22), transparent 30%), linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)"
      },
      backgroundSize: {
        "hero-grid": "auto, 48px 48px, 48px 48px"
      }
    },
  },
  plugins: [],
};
