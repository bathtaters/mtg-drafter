type Property = "text" | "bg" | "fg" | "border" | "all"
type Options = {
  inverse: boolean,
  hover: boolean,
  dim: boolean,
}

const DEFAULT_COLOR = 'slate'
const COLORS = [
  'blue',
  'yellow',
  'emerald',
  'red',
  'fuchsia',
  'orange',
  'cyan',
  'lime',
  'violet',
  'pink',

  'sky',
  'amber',
  'green',
  'rose',
  'purple',
  'teal',
  'indigo',
]
const VALUES = [['700','500'],['200','400']]

function buildString(color: string, prop: Property = 'fg', options: Partial<Options>): string {
  const { inverse = false, hover = false, dim = false } = options

  switch(prop) {
    case 'text':    
    case 'bg':      
    case 'border':  return `${hover ? 'hover:' : ''}${prop}-${color}-${VALUES[+((prop === 'bg') !== inverse)][+dim]}`
    case 'all':     return `${buildString(color, 'text', options)} ${buildString(color, 'bg', options)} ${buildString(color, 'border', options)}`
    case 'fg':      return `${buildString(color, 'text', options)} ${buildString(color, 'border', options)}`
  }
}

export default function getColorClass(id = -1, prop: Property, options: Partial<Options> = {}) {
  if (id < 0) return buildString(DEFAULT_COLOR,  prop, options)
  return buildString(COLORS[id % COLORS.length], prop, options)
}


/*

Include in tailwind.config.ts:
  safelist: [
    { // Included from lib/colors.ts 
      pattern: /(text|bg|border)-(blue|yellow|emerald|red|fuchsia|orange|cyan|lime|violet|pink|sky|amber|green|rose|purple|teal|indigo)-(700|500|200|400)/,
      variants: ['hover'],
    },
  ],
  
Re-generate pattern for module.exports:
  console.log(`pattern: /(${['text','bg','border'].join('|')})-(${COLORS.join('|')})-(${VALUES.flatMap((v)=>v).join('|')})/,`)

*/