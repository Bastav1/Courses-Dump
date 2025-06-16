// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // Path to your HTML files
    "./src/**/*.{js,ts,jsx,tsx}", // Path to your JS/TS/JSX/TSX files
  ],
  theme: {
    extend: {
      fontFamily: {
        custom: ['"Manrope"', 'Roboto'],
      },
    },
  },
  plugins: [],
}
