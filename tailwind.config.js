/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/Views/**/*.ejs", "./public/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "app-gray": "#f2f2f2",
        "app-deep": "#1a2b2a",
        "app-dark": "#0a0c0d",
        "app-green": {
          DEFAULT: "#348e91",
          dark: "#2b6f72",
        },
        "app-muted": "#1c5052",
        "app-card": "#ffffff",
      },
      borderColor: {
        "app-border": "rgba(28, 80, 82, 0.15)",
      },
      boxShadow: {
        custom: "0 25px 50px -12px rgba(28, 80, 82, 0.25)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
