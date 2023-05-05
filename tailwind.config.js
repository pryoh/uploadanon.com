/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*"
  ],
  theme: {
    extend: {
      fontFamily: {
        Underwood: "'My Underwood', serif",
      }
    },
  },
  plugins: [],
}