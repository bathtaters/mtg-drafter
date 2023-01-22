/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    { // Included from lib/colors.ts 
      pattern: /(text|bg|border)-(blue|yellow|emerald|red|fuchsia|orange|cyan|lime|violet|pink|sky|amber|green|rose|purple|teal|indigo)-(700|500|200|400)/,
      variants: ['hover'],
    },
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['var(--font-garamond)', ...defaultTheme.fontFamily.sans],
        'sans': ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
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

        mythic: '#a52a2a',
        rare: '#ffd700',
        uncommon: '#d3d3d3',
        common: '#000',

        bgw: '#e2ddc6',
        bgu: '#26a0cd',
        bgb: '#354541',
        bgr: '#d66049',
        bgg: '#3d7753',
        bgc: '#afada2',
        bgmulti: '#c3b070',
        bgland: '#b19277',
      },

      // Rendered Card Custom Styles
      backgroundImage: { foil: 'linear-gradient(45deg, #c0fff0 20%, #b0c0f0 36%, #ffd0d0 52%, #ffffc0 67%, #ffafaf 80%)' },
      borderRadius: { card: '5%' },
      gridTemplateRows: { card: '10% 25% 9% 50% 6%', split: '17% 10% 14% 50% 9%' },
      gridTemplateColumns: { card: '77% 23%' },
      boxShadow: {
        top: '0 0 0.15em 0 rgba(0,0,0,0.388)',
        inset: 'inset 0.2em 0.2em 1em -0.2em rgba(0,0,0,0.388)',
      }
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [ "winter", "night" ],
    darkTheme: "night",
  },
}
