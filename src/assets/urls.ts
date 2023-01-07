import { DraftType } from "types/setup"

export const INVALID_PATH = "_INVALID"

export const gameUrlRegEx = /game\/([^\/]+)(?:\/|$)/ // = game/gameUrl

export const
  newGameURL = (type: DraftType) => type === "Cube" ? '/api/setup/cube' : '/api/setup/booster',
  cubeListURL = "/api/setup/upload",
  gameURL = (gameIdentifier: string) => `/game/${gameIdentifier}`,
  gameAPI = (gameURL: any) => `/api/game/${typeof gameURL === 'string' ? gameURL : INVALID_PATH}/all`,
  socketEndpoint = (gameURL: any) => `/api/game/${typeof gameURL === 'string' ? gameURL : INVALID_PATH}/socket`

export const // DB Sources
  setsDbUrl = 'https://mtgjson.com/api/v5/AllPrintings.json',
  cardDbUrl = 'https://mtgjson.com/api/v5/AllIdentifiers.json',
  imageDbUrl = 'https://api.scryfall.com/bulk-data/default-cards',
  preferredDbUrl = 'https://api.scryfall.com/bulk-data/oracle-cards'