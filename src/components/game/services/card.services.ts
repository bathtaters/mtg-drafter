import type { Card } from "@prisma/client"
import styles from "../subcomponents/FauxCard.module.css"


// Special codes { 'BRACE CODE': 'mana.css code'  }
const specials: { [key: string]: string } = {
  'T': 'tap'
}

const braceRegex = /\{(.{1,3})\}/g
const symbolTag = (symbol: string, shadow?: boolean) => 
  `<span class="ms ms-cost ${styles.manaFix}${shadow ? ` ms-shadow ${styles.manaFixShadow}` : ''} ms-${symbol}"></span>`

export const symbolFix = (text: string | null, shadow?: boolean) => !text ? '' :
  text.replaceAll(braceRegex, (_, symb) => {
      if (symb in specials) symb = specials[symb]
      return symbolTag(symb.replace(/\//g,'').toLowerCase(), shadow)
  })

export const splitLines = (text: string | null) => !text ? [] : text.split('\n')

export const getBgdColor = (card: Card) => 
  card.colors.length == 1 ? styles[`bgd${card.colors[0]}`] :
  card.colors.length ? styles.bgdMulti :
  card.types.includes('Land') ? styles.bgdLand :
    styles.bgdNone
