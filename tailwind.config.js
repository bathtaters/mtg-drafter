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
        'msw-focus': '#c0c290',
        msu: '#b5cde3',
        'msu-focus': '#859db3',
        msb: '#aca29a',
        'msb-focus': '#7c726a',
        msr: '#db8664',
        'msr-focus': '#ab5634',
        msg: '#93b483',
        'msg-focus': '#638453',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [ "winter", "night" ],
    darkTheme: "night",
  },
}
