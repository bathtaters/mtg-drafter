import type { Card } from "@prisma/client"
import { symbolFix, splitLines, getBgdColor } from "../services/card.services"
import styles from "./FauxCard.module.css"


export default function FauxCard({ card, isFoil }: { card: Card, isFoil?: boolean }) {
  const cardClass = `${styles.card} ${isFoil ? styles.foil : ''}`
  const bgdClass = `${styles[`cardBgd${isFoil ? 'Foil' : ''}`]} ${card.side ? styles[`side-${card.side}`] : ''}`

  return (
    <div className={bgdClass}>
      <div className={cardClass}>
        <div className={styles.genCard}>
          <div className={`${styles.genLayout} ${getBgdColor(card)}`}>
            <div className={styles.genHeader}>
              <span className={styles.genName}>{card.faceName || card.name}</span>
              <span className={styles.genMana} dangerouslySetInnerHTML={{__html: symbolFix(card.manaCost, true)}} />
            </div>
            <div className={styles.genArtBox}>{isFoil ? 'Foil' : ''}</div>
            <div className={styles.genTypeBox}>
              <span className={styles.genType}>{card.type}</span>
              <span className={`${styles.genRarity} ${card.rarity ? styles[card.rarity] : ''}`}>⬤</span>
            </div>
            <div className={styles.genTextBox}>
              <div className={styles.genTextContainer}>
                {splitLines(card.text).map((line) => 
                  <p key={line} className={styles.genText} dangerouslySetInnerHTML={{__html: symbolFix(line, false)}} />
                )}
              </div>
            </div>
            {card.footer &&
              <div className={styles.genFooterNums}>{card.footer}</div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}