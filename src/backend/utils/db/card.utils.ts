import type { Prisma, Color, Rarity, Side } from '@prisma/client'
import type { CardSet as JsonCard } from '../../../types/json'
import type { Layout } from 'types/scryfall'
import { scryfallImageUrl } from 'assets/urls'

export const normalizeName = (name: string) => name.replace(/\s\/\/\s.+$/,'').replace(/[^a-zA-Z0-9 ]/g, '').replace('&', 'and').toLowerCase()

export const adaptCardToDb = ({
  uuid, name, number, flavorName, setCode, manaCost, type, text,
  power, toughness, loyalty, defense, rarity, colors,
  types, manaValue, identifiers, layout,
  faceName, side, asciiName
}: JsonCard): Prisma.CardCreateManyInput => ({
  
  uuid, flavorName, setCode, manaCost, type, text, manaValue, faceName,
  
  name: name || 'N/A',
  number: number || null,
  types: types || [], 

  normalName: !side || side === 'a' ? normalizeName(flavorName || asciiName || name || 'N/A') : null,

  scryfallId: identifiers?.scryfallId,
  multiverseId: identifiers?.multiverseId,
  img: side && side !== 'a' ? null : identifiers?.scryfallId ? scryfallImageUrl(identifiers.scryfallId) : null,

  footer: toughness != null ? `${power}/${toughness}` : loyalty || defense,

  monoColor: !colors || colors.length !== 1 ? null : colors[0] as Color, 
  
  colors: colors ? colors as Color[] : [],
  rarity: rarity ? rarity as Rarity : null,
  side: side ? side as Side : null,
  layout: layout ? layout as Layout : null,
})

export const adaptFacesToDb = ({ uuid, layout, side, otherFaceIds, identifiers }: JsonCard): Prisma.FaceInCardCreateManyInput[] => {
  const backImg = side === 'a' && layout === 'meld' && identifiers?.scryfallCardBackId ? scryfallImageUrl(identifiers.scryfallCardBackId, false) : null
  return otherFaceIds ? otherFaceIds.map((cardId) => ({ selfId: uuid, cardId, backImg })) : []
}