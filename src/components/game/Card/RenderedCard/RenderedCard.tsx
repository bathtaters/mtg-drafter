import type { Card } from "@prisma/client"
import { rarityClass } from "components/base/styles/manaIcons"
import { symbolFix, splitLines, getBgdColor } from "./card.services"
import { Border, Layout, CardBox, ArtBox, TextBox, Footer, Name, Mana, Type, Rarity, TextLine } from "./RenderedCardStyles"


export default function FauxCard({ card, isFoil }: { card: Card, isFoil?: boolean }) {
  return (
    <Border> <Layout className={getBgdColor(card)}>

      <CardBox>
        <Name>{card.faceName || card.name}</Name>
        <Mana html={symbolFix(card.manaCost, true)} />
      </CardBox>

      <ArtBox>{isFoil ? 'Foil' : ''}</ArtBox>

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