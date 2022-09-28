/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['EB Garamond', ...defaultTheme.fontFamily.sans],
        'sans': ['Inter', ...defaultTheme.fontFamily.sans],
      }
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [ "winter", "night" ],
    darkTheme: "night",
  },
}
