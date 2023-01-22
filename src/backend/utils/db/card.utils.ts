import type { Prisma, Color, Rarity, Side, CardLayout } from '@prisma/client'
import type { Card } from 'mtggraphql'

export const normalizeName = (name: string) => name.replace(/\s\/\/\s.+$/,'').toLowerCase()

export const adaptCardToDb = ({
  uuid, name, setCode, manaCost, type, text,
  power, toughness, loyalty, rarity, colors,
  types, manaValue, identifiers, layout,
  faceName, side, asciiName
}: JsonCard): Prisma.CardCreateManyInput => ({
  uuid, setCode, manaCost, type, text, manaValue, faceName,
  
  name: name || 'N/A',
  types: types || [], 

  normalName: !side || side === 'a' ? normalizeName(asciiName || name || 'N/A') : null,

  scryfallId: identifiers?.scryfallId,
  multiverseId: identifiers?.multiverseId,

  footer: toughness != null ? `${power}/${toughness}` : loyalty,

  monoColor: !colors || colors.length !== 1 ? null : colors[0] as Color, 
  
  colors: colors ? colors as Color[] : [],
  rarity: rarity ? rarity as Rarity : null,
  side: side ? side as Side : null,
  layout: layout ? layout as CardLayout : null,
})

export const adaptFacesToDb = ({ uuid, otherFaceIds }: JsonCard): Prisma.FaceInCardCreateManyInput[] =>
  otherFaceIds ? otherFaceIds.map((cardId) => ({ selfId: uuid, cardId })) : []


// TYPES

export interface JsonCard extends Card {
  variations: Card['variation'],
  manaValue: Card['convertedManaCost']
}