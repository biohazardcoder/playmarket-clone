/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': "#0b4650",
        'secondary': "#0d2f2b",
        'meteor': "#f9f7f2",
        'theme': "#141414",
        'mainly': "#e6ff2b",
        'config': "#33ffc2"
      },
    },
  },
  plugins: [],
}