/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FAF9F6",
        "soft-blue": "#E3F2FD",
        "sage-green": "#E8F5E9",
        "warm-blue": "#7DA7C9",
        "warm-sage": "#9CB5A2",
        "soft-charcoal": "#4A4A4A",
        "pastel-yellow": "#FFF9C4",
        "warm-peach": "#FFE5D9",
        "warm-coral": "#FF9B85",
        primary: {
          50: "#FAF9F6",
          100: "#E8F5E9",
          200: "#E3F2FD",
          300: "#9CB5A2",
          400: "#7DA7C9",
          500: "#7DA7C9",
          600: "#6B93B0",
          700: "#5A7F98",
          800: "#4A4A4A",
          900: "#3A3A3A",
        },
        success: "#9CB5A2",
        error: "#FF9B85",
        warning: "#FFF9C4",
      },
    },
  },
  plugins: [],
};
