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
        // 背景グラデーション用
        lavender: "#E8E0F0",
        "lavender-light": "#F5F0FA",
        "lavender-dark": "#D5C8E8",

        // カード背景（パステル）
        "card-pink": "#FFD6E0",
        "card-purple": "#E0D4F5",
        "card-mint": "#D4F5E9",
        "card-cream": "#FFF8E7",

        // ボタン
        "btn-purple": "#9B7ED9",
        "btn-purple-light": "#C4B5E0",

        // ステータスバー用
        "heart-red": "#FF6B8A",
        "coin-gold": "#FFD700",

        // グラデーション用
        "gradient-pink": "#FFE5EC",
        "gradient-cream": "#FFF8F0",

        // 既存カラー（互換性維持）
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
          50: "#F5F0FA",
          100: "#E8E0F0",
          200: "#D5C8E8",
          300: "#C4B5E0",
          400: "#9B7ED9",
          500: "#9B7ED9",
          600: "#8668C7",
          700: "#7152B5",
          800: "#4A4A4A",
          900: "#3A3A3A",
        },
        success: "#9CB5A2",
        error: "#FF6B8A",
        warning: "#FFF9C4",
      },
    },
  },
  plugins: [],
};
