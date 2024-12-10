/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    { // Included from lib/colors.ts 
      pattern: /(text|bg|border)-(slate|blue|yellow|emerald|red|fuchsia|orange|cyan|lime|violet|pink|sky|amber|green|rose|purple|teal|indigo)-(700|500|200|400)/,
      variants: ['hover'],
    }
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

      // Add Text Shadow support (From hyperui.dev/blog/text-shadow-with-tailwindcss)
      textShadow: {
        sm: '0 1px 2px var(--tw-shadow-color)',
        DEFAULT: '0 2px 4px var(--tw-shadow-color)',
        lg: '0 8px 16px var(--tw-shadow-color)',

        card: '0.03em 0.03em 0.05em var(--tw-shadow-color)',
        icon: '0.03em 0.03em 0.01em var(--tw-shadow-color)',
      },

      // Pause pulse + Foil animation
      keyframes: {
        pulse70: {
          '0%': { opacity: '0.6' },
          '50%': { opacity: '0.2' },
          '100%': { opacity: '0.6' },
        },
        moveBg: {
          '0%': {
            backgroundPosition: '0% 50%',
            opacity: '1.0',
          },
          '50%': {
            backgroundPosition: '100% 50%',
            opacity: '0.8',
          },
          '100%': {
            backgroundPosition: '0% 50%',
            opacity: '1.0'
          }
        }
      },
      animation: {
        'pulse-pause': 'pulse70 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'foil': 'moveBg 8s both infinite',
      },
      backgroundImage: {
        /* Copied from @wittyshizard MTGJSON Discord */
        foil: `linear-gradient(
          135deg,
          rgba(154, 18, 179, 0.3),
          rgba(44, 130, 201, 0.3),
          rgba(42, 187, 155, 0.3),
          rgba(233, 212, 96, 0.3),
          rgba(240, 52, 52, 0.3),
          rgba(154, 18, 179, 0.3),
          rgba(44, 130, 201, 0.3),
          rgba(42, 187, 155, 0.3),
          rgba(233, 212, 96, 0.3),
          rgba(240, 52, 52, 0.3),
          rgba(154, 18, 179, 0.3)
        )`
      },

      // Rendered Card Custom Styles
      width: { card: 'var(--card-w)' },
      height: { card: 'var(--card-h)' },
      fontSize: { card: 'var(--card-sz)' },
      borderRadius: { card: '5%' },
      gridTemplateRows: { card: '10% 25% 9% 50% 6%', split: '17% 10% 14% 50% 9%' },
      gridTemplateColumns: { card: '77% 23%', rotate: '89% 11%' },
      boxShadow: {
        top: '0 0 0.15em 0 rgba(0,0,0,0.388)',
        inset: 'inset 0.2em 0.2em 1em -0.2em rgba(0,0,0,0.388)',
      },
    },
  },
  plugins: [
    require('daisyui'),
    // Add Text Shadow support (From hyperui.dev/blog/text-shadow-with-tailwindcss)
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        { 'text-shadow': (value) => ({ textShadow: value }) },
        { values: theme('textShadow') }
      )
    }),
  ],
  daisyui: {
    themes: [ "winter", "night" ],
    darkTheme: "night",
  },
}
