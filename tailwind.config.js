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
      },
      colors: {
        ms:  '#111',
        msw: '#f0f2c0',
        msu: '#b5cde3',
        msb: '#aca29a',
        msr: '#db8664',
        msg: '#93b483',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [ "winter", "night" ],
    darkTheme: "night",
  },
}
