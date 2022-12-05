import type { Card, Color } from "@prisma/client"
import { bgdClass } from "components/base/styles/manaIcons"


// Special codes { 'BRACE CODE': 'mana.css code'  }
const specials: { [key: string]: string } = {
  'T': 'tap'
}

const braceRegex = /\{(.{1,3})\}/g
const symbolTag = (symbol: string, shadow?: boolean) => 
  `<span class="ms ms-cost text-[0.8em]${shadow ? ` ms-shadow my-auto mx-[0.07em]` : ''} ms-${symbol}"></span>`

export const symbolFix = (text: string | null, shadow?: boolean) => !text ? '' :
  text.replaceAll(braceRegex, (_, symb) => {
      if (symb in specials) symb = specials[symb]
      return symbolTag(symb.replace(/\//g,'').toLowerCase(), shadow)
  })

export const splitLines = (text: string | null) => !text ? [] : text.split('\n')

export const getBgdColor = ({ colors, types }: Card) => 
  colors.length == 1 ? bgdClass[colors[0].toLowerCase() as Lowercase<Color>] :
  colors.length ? bgdClass.multi : types.includes('Land') ? bgdClass.land : bgdClass.none
