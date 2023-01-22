import type { Card } from "@prisma/client"
import { rarityClass } from "components/base/styles/manaIcons"
import { getArtBoxText, symbolFix, splitLines, getBgdColor } from "./card.services"
import { Border, Layout, CardBox, ArtBox, TextBox, Footer, Name, Mana, Type, Rarity, TextLine } from "./RenderedCardStyles"

export type Props = { card: Card, isFoil?: boolean, splitSide?: 0|1|2, otherFaceCount?: number }

export default function RenderedCard({ card, isFoil = false, splitSide = 0, otherFaceCount = 0 }: Props) {
  const artBoxText = getArtBoxText(card.layout, otherFaceCount)

  return (
    <Border hide={splitSide > 1}><Layout layout={card.layout} split={splitSide} className={getBgdColor(card)}>

      <CardBox>
        <Name>{card.faceName || card.name}</Name>
        <Mana html={symbolFix(card.manaCost, true)} />
      </CardBox>

      <ArtBox hide={!!splitSide}>
        {!splitSide && artBoxText && <div>{artBoxText}</div>}
        {isFoil && <div>Foil</div>}
      </ArtBox>

      <CardBox>
        <Type>{card.type}</Type>
        <Rarity className={rarityClass[card.rarity || 'special']}>⬤</Rarity>
      </CardBox>

      <TextBox>
        {splitLines(card.text).map((line, idx) => <TextLine key={card.uuid+idx} html={symbolFix(line, false)} />)}
      </TextBox>
      
      {card.footer && <Footer>{card.footer}</Footer>}

    </Layout> </Border>
  )
}