import type { Card } from "@prisma/client"
import { rarityClass } from "components/base/styles/manaIcons"
import { getArtBoxText, symbolFix, splitLines, getBgdColor } from "./card.services"
import {
  Border, Layout, CardBox, ArtBox, TextBox, Footer, 
  Name, Mana, Type, Rarity, TextLine, ArtMainText, ArtSubText, splitLayouts, CardBgd
} from "./RenderedCardStyles"

export type Props = { card: Card, isFoil?: boolean, side?: number, sideCount?: number }

export default function RenderedCard({ card, isFoil = false, side = 0, sideCount = 0 }: Props) {
  const artBoxText = getArtBoxText(card.layout, sideCount)
  const layout = sideCount === 2 ? splitLayouts[card.layout || 'normal'] : undefined

  return (
    <Border hide={layout && side > 1} flipSide={layout ? -1 : side}>
      <CardBgd color={side === 1 && card.layout === 'adventure' && getBgdColor(card)} />
      <Layout layout={layout} side={side} className={getBgdColor(card)}>

        <CardBox>
          <Name>{card.faceName || card.name}</Name>
          <Mana html={symbolFix(card.manaCost, true)} />
        </CardBox>

        <ArtBox>
          <ArtMainText small={!!layout}>
            {(!layout || !side) && artBoxText && <div>{artBoxText}</div>}
            {isFoil && <div>Foil</div>}
          </ArtMainText>

          {!layout && !!side && <ArtSubText>{side}/{sideCount}</ArtSubText>}
        </ArtBox>

        <CardBox>
          <Type>{card.type}</Type>
          <Rarity className={rarityClass[card.rarity || 'special']}>⬤</Rarity>
        </CardBox>

        <TextBox>
          {splitLines(card.text).map((line, idx) => <TextLine key={card.uuid+idx} html={symbolFix(line, false)} />)}
        </TextBox>
        
        {card.footer && <Footer>{card.footer}</Footer>}

      </Layout>
    </Border>
  )
}