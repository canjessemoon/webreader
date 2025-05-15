/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enables dark mode based on .dark class
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '70ch', // Improve readability with max width
          },
        },
      },
    },
  },
  plugins: [],
}
