import type { LogOptions, TimerOptions } from 'types/game'
import type { GameOptions } from 'types/setup'
import cardZoomLevels from "components/game/CardToolbar/cardZoomLevels"

//  Settings

export const
  storageDefaults = Object.freeze({
    zoom: Math.round(cardZoomLevels.length / 2),
    deckSize: 40,
    sideboardLands: 5,
    showArt: true,
    sortBy: 0,
  }),

  shareGame = {
    title: "MtG Drafter Game",
    message: "Join the draft",
    url: (gameUrl: string) => `${window.location.origin}/game/${gameUrl}`,
    copyMsg: { message: "Copied link to clipboard", className: "alert-info" },
    failMsg: { message: "Clipboard access disabled by browser", className: "alert-warning" },
  },

  logOptions: LogOptions = { hideHost: false, hidePrivate: true },


  defaultTimer: TimerOptions = { secPerCard: 3.3, secOffset: -8, roundTo: 5, minSec: 5 },
  timerOptions: Array<Partial<TimerOptions> | null> = [
    null,
    { secPerCard: 6.6, minSec: 10 }, // Casual: 90 sec / 15 cards
    { secPerCard: 5.0, minSec: 10 }, // Slow: 60 sec / 15 cards
    {}, // Normal (Official rules): 40 sec / 15 cards
    { secPerCard: 2.6 }, // Fast: 30 sec / 15 cards
    { secPerCard: 1.9 }, // Speed: 20 sec / 15 cards
  ]


// Setup validation

export const
  setupLimits = {
    name:     { minLength: 1, maxLength: 22 },
    players:  { min: 1, max: 12 },
    timer:    { min: 0, max: 5  },
    packs:    { min: 1, max: 5  },
    packSize: { min: 1, max: 20 },
    setCode:  { min: 3, max: 4  },
    cubeSize: { max: 720 * 4    },
  }, 

  setupDefaults: GameOptions = { type: "Cube", name: "", players: "8", timer: "3", packs: "3", packSize: "15", packList: ["KLD","KLD","AER"] },

  fileSettings = { id: "cubeFile", type: "text/plain", maxSize: 10 * 1024 * 1024 /* = 10 MB */, },

  urlLength = 9

// UI Tweaks

export const redTimerSeconds = 10


// Advanced Tweaks + Debug Settings

export const refreshOnRefocusDelay = 3 * 60 * 1000

export const MAX_GAME_CONN = 20

export const debugSockets = false

export const clientErrorsInConsole = true

export const enableDropping = true

export const logSheetNames = false