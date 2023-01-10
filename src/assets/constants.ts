import type { LogOptions } from 'types/game'
import type { GameOptions } from 'types/setup'
import cardZoomLevels from "components/game/CardToolbar/cardZoomLevels"

//  Settings

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
  url: (gameUrl: string) => `${window.location.origin}/game/${gameUrl}`,
  copyMsg: { message: "Copied link to clipboard", className: "alert-info" },
  failMsg: { message: "Clipboard access disabled by browser", className: "alert-warning" },
}

export const logOptions: LogOptions = { hideHost: false, hidePrivate: true }

// Setup validation

export const
  setupLimits = {
    name:     { minLength: 1, maxLength: 22 },
    players:  { min: 1, max: 12 },
    packs:    { min: 1, max: 5  },
    packSize: { min: 1, max: 20 },
    setCode:  { min: 3, max: 4  },
    cubeSize: { max: 720 * 4 },
  }, 

  setupDefaults: GameOptions = { type: "Cube", name: "", players: "8", packs: "3", packSize: "15", packList: ["KLD","KLD","AER"] },

  fileSettings = { id: "cubeFile", type: "text/plain", maxSize: 10 * 1024 * 1024 /* = 10 MB */, },

  urlLength = 9

// Advanced Tweaks + Debug Settings

export const refreshOnRefocusDelay = 3 * 60 * 1000

export const MAX_GAME_CONN = 20

export const debugSockets = false

export const enableDropping = true

export const logSheetNames = false