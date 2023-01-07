import type { BoardLands, LogOptions } from 'types/game'
import type { GameOptions } from 'types/setup'
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
  },

  boosterSortOrder = [
    'sta', // strixhaven
    'playtest', 'oldFrame', // Playtest set
    'dfc', 'therosGods', 'contraption', 'conspiracy', 'legendary', 'special',
    'mythicPartner1', 'nondraftRareMythic',

    'pcRare', 'modaldfcRareMythic', 'dfcRareMythic', 'legendaryRareMythic',
    'nonlessonRareMythic',
    'planeswalkerRareMythic','rareMythic', 'sfcRareMythic', 'nonlegendaryRareMythic',
    'nonplaneswalkerRareMythic', 'nonconspiracyRareMythic', 'rarePartner1',
    'rarePartner2', 'rarePartner3', 'rarePartner4', 'rarePartner5', 'rare',
    
    'pcCsUncommonRare',
    'pcUncommon', 'modaldfcUncommon', 'planeswalkerUncommon', 'legendaryUncommon',
    'uncommon', 'sfcUncommon', 'nonplaneswalkerUncommon', 'nonlegendaryUncommon',
    'nonconspiracyUncommon', 'nondraftUncommon', 'uncommonPartner1',
    'uncommonPartner2', 'uncommonPartner3', 'uncommonPartner4', 'uncommonPartner5',

    // Playtest set
    'multicolor','colorless',
    'whiteA','blueA','blackA','redA','greenA',
    'whiteB','blueB','blackB','redB','greenB',
    
    'dfcCommonUncommon',
    'pcCsCommon', 'pcCommon', 'nonlessonCommon',
    'sfcCommon', 'nonconspiracyCommon', 'nondraftCommon',
    'nongainlandCommon', 'nonlandCommon', 'nonBasictypeCommon', 'common',
    
    'lesson', 'commonOrBasic', 'basicOrCommonLand',
    'basicOrGainland', 'basictype', 'basic', 'land'
  ].reverse()

//  Local settings

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