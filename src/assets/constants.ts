import type { BoardLands } from 'types/game'
import cardZoomLevels from "components/game/CardToolbar/cardZoomLevels"

// MtG library

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

//  Local settings

export const storageDefaults = Object.freeze({
  zoom: Math.round(cardZoomLevels.length / 2),
  deckSize: 40,
  sideboardLands: 5,
  showArt: true,
  sortBy: 0,
})

// Sharing settings

export const shareGame = {
  title: "MtG Drafter Game",
  message: "Join the draft",
  url: (gameUrl: string) => `http://192.168.0.179:3040/game/${gameUrl}`,
  copyMsg: { message: "Copied link to clipboard", className: "alert-info" },
  failMsg: { message: "Clipboard access disabled by browser", className: "alert-warning" },
}

// Setup validation

export const
  setupLimits = {
    name:     { minLength: 1, maxLength: 22 },
    players:  { min: 1, max: 12 },
    packs:    { min: 1, max: 5  },
    packSize: { min: 1, max: 20 },
  }, 

  setupDefaults = { name: "", players: "8", packs: "3", packSize: "15" },

  fileSettings = { id: "cubeFile", type: "text/plain", maxSize: 10 * 1024 * 1024 /* = 10 MB */, },

  urlLength = 9

// Advanced Tweaks + Debug Settings

export const refreshOnRefocusDelay = 3 * 60 * 1000

export const MAX_GAME_CONN = 20

export const debugSockets = false

export const enableDropping = true