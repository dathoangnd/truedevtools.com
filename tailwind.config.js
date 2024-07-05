/** @type {import('tailwindcss').Config} */
export default {
  important: true,
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      lineHeight: {
        0: '0'
      }
    },
  },
  plugins: [],
}

