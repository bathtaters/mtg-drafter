import { CardLayout } from '@prisma/client'
import type { GameOptions } from 'types/setup'
import type { RetryOptions } from 'backend/libs/retry'
import { LogOptions, TimerOptions, Direction } from 'types/game.d'
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
    { secPerCard: 1, minSec: 24 * 60 * 60 }, // Daily: 24 hours
    { secPerCard: 10, minSec: 15 }, // Casual: 150 sec / 15 cards
    { secPerCard: 6.6, minSec: 10 }, // Slow: 90 sec / 15 cards
    {}, // Normal (Official rules): 40 sec / 15 cards
    { secPerCard: 2.6 }, // Fast: 30 sec / 15 cards
    { secPerCard: 1.9, minSec: 3 }, // Speed: 20 sec / 15 cards
  ]


// Setup validation

export const
  setupLimits = {
    name:     { minLength: 1, maxLength: 22 },
    players:  { min: 1, max: 12 },
    timer:    { min: 0, max: timerOptions.length - 1 },
    packs:    { min: 1, max: 5  },
    packSize: { min: 1, max: 20 },
    setCode:  { min: 3, max: 4  },
    cubeSize: { max: 720 * 4    },
  }, 

  setupDefaults: GameOptions = Object.freeze({
    type: "Cube",
    name: "",
    players: "8",
    timer: "4",
    packs: "3",
    packSize: "15",
    packList: ["KLD","KLD","AER"],
    basics: true
  }),

  fileSettings = { id: "cubeFile", type: "text/plain", maxSize: 10 * 1024 * 1024 /* = 10 MB */, },

  urlLength = 9

// UI Tweaks

export const redTimerSeconds = 10

export const layoutDirection: { [layout in CardLayout]?: Direction } = {
  flip: Direction.S,
  split: Direction.E,
  aftermath: Direction.W,
}
export const flippableLayouts = [...Object.keys(layoutDirection),'modal_dfc', 'transform', 'meld'] as const

// Advanced Tweaks + Debug Settings

export const retryDefaults: RetryOptions = { maxRetries: 10, delay: 10, errCodes: ['P2034'], logRetry: console.warn } // delay10/max10 = max delay 5sec

export const refreshOnRefocusDelay = 3 * 60 * 1000

export const hoverAfterClickDelay = 4 * 1000 // How long to wait after clicking before allowing hovering on/off

export const MAX_GAME_CONN = 20

export const debugSockets = false

export const clientErrorsInConsole = true

export const enableDropping = true

export const logSheetNames = false

export const serverSideImageOptimize = false