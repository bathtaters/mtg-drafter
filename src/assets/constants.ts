import type { BoardLands } from 'types/definitions'
import cardZoomLevels from "components/game/styles/cardZoomLevels"

export const colorOrder = ['w','u','b','r','g'] as Array<keyof BoardLands>,

  rarityOrder = ["bonus","special","mythic","rare","uncommon","common","none"],

  typeOrder = [
    "Creature", "Summon", "Planeswalker",
    "Instant", "Sorcery", "Artifact", "Enchantment", "Land",
    "Conspiracy", "Dungeon", "Emblem", "Phenomenon", "Plane", "Scheme", "Vanguard", "Token",
  ],

  landNames = {
    w: 'Plains',
    u: 'Island',
    b: 'Swamp',
    r: 'Mountain',
    g: 'Forest',
  }

export const storageDefaults = Object.freeze({
  zoom: Math.round(cardZoomLevels.length / 2),
  deckSize: 40,
  sideboardLands: 5,
})

export const nameCharLimit = { minLength: 2, maxLength: 32 }

export const MAX_GAME_CONN = 20

export const debugSockets = false

export const enableDropping = true