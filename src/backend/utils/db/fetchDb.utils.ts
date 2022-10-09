import type { Prisma, Color, Rarity, Side } from '@prisma/client'
import type { Card } from 'mtggraphql'

export const normalizeName = (name: string) => name.replace(/\s\/\/\s.+$/,'').toLowerCase()

// --- CARDS --- \\

// Pass 1
export const adaptCardToDb = ({
  uuid, name, setCode, manaCost, type, text,
  power, toughness, loyalty, rarity, colors,
  types, manaValue, identifiers, hasContentWarning,
  faceName, side, asciiName
}: JsonCard): Prisma.CardCreateInput => ({
  uuid, setCode, manaCost, type, text, manaValue, faceName,
  
  name: name || 'N/A',
  types: types || [], 
  noGath: !identifiers?.multiverseId || hasContentWarning || false,

  normalName: !side || side === 'a' ? normalizeName(asciiName || name || 'N/A') : null,

  scryfallId: identifiers?.scryfallId,
  multiverseId: identifiers?.multiverseId,

  footer: toughness != null ? `${power}/${toughness}` : loyalty,

  monoColor: !colors || colors.length !== 1 ? null : colors[0] as Color, 
  
  colors: colors ? colors as Color[] : [],
  rarity: rarity ? rarity as Rarity : null,
  side: side ? side as Side : null,
})

// Pass 2
export const adaptCardToConnect = ({
  uuid, otherFaceIds,
}: JsonCard): Prisma.CardUpdateArgs | undefined => otherFaceIds?.length ? ({
  where: { uuid },
  data: {
    otherFaces: otherFaceIds?.length ? { connect: otherFaceIds.map((uuid) => ({ uuid })) } : undefined,
  }
}) : undefined


// TYPES

export type JsonCard = Card & { variations: Card['variation'], manaValue: Card['convertedManaCost'] }