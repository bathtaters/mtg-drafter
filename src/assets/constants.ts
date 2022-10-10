import type { BoardLands } from 'types/definitions'
import cardZoomLevels from "components/game/styles/cardZoomLevels"

export const colorOrder = ['w','u','b','r','g'] as Array<keyof BoardLands>

export const INVALID_PATH = "_INVALID"

export const storageDefaults = Object.freeze({
  zoom: Math.round(cardZoomLevels.length / 2),
  deckSize: 40,
  sideboardLands: 5,
})

export const MAX_GAME_CONN = 20

export const debugSockets = false

export const enableDropping = true