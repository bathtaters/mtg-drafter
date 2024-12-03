import { DraftType } from "types/setup"
import pkg from "../../package.json"

export const INVALID_PATH = "_INVALID"

export const gameUrlRegEx = /game\/([^\/]+)(?:\/|$)/ // = game/gameUrl

export const
  newGameURL = (type: DraftType) => type === "Cube" ? '/api/setup/cube' : '/api/setup/booster',
  cubeListURL = "/api/setup/upload",
  gameURL = (gameIdentifier: string) => `/game/${gameIdentifier}`,
  gameAPI = (gameURL: any) => `/api/game/${typeof gameURL === 'string' ? gameURL : INVALID_PATH}/all`,
  socketEndpoint = (gameURL: any) => `/api/game/${typeof gameURL === 'string' ? gameURL : INVALID_PATH}/socket`,
  scryfallImageUrl = (sfId: string, front = true, fmt: ScryfallImgFmt = 'large') =>
    `https://${front ? 'cards' : 'backs'}.scryfall.io/${fmt}/${front ? 'front/' : ''}${sfId[0]}/${sfId[1]}/${sfId}.${fmt === 'png' ? 'png' : 'jpg'}`

export const // DB Sources
  setsDbUrl = 'https://mtgjson.com/api/v5/AllPrintings.json',
  cardDbUrl = 'https://mtgjson.com/api/v5/AllIdentifiers.json',
  imageDbUrl = 'https://api.scryfall.com/bulk-data/default-cards',
  preferredDbUrl = 'https://api.scryfall.com/bulk-data/oracle-cards'

export const scryfallHeaders = {
  'User-Agent': `bathtaters-${pkg.name}/${pkg.version}`,
  'Accept': 'application/json;q=0.9,*/*;q=0.8',
}

// Ignore these IDs when retrieving card back images
export const ignoreScryfallBackIds = ['0aeebaf5-8c7d-4636-9e82-8c27447861f7']

type ScryfallImgFmt = "large"|"normal"|"small"|"art_crop"|"border_crop"|"png"