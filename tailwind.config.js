/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ejs,js}', './public/assets/js/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Manrope',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};

