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
  showArt: true,
  sortBy: 0,
})

export const shareGame = {
  title: "MtG Drafter Game",
  message: "Join the draft",
  url: (gameUrl: string) => `http://192.168.0.179:3040/game/${gameUrl}`,
  copyMsg: { message: "Copied link to clipboard", className: "alert-info" },
  failMsg: { message: "Clipboard access disabled by browser", className: "alert-warning" },
}

export const nameCharLimit = { minLength: 1, maxLength: 22 }

export const MAX_GAME_CONN = 20

export const debugSockets = false

export const enableDropping = true