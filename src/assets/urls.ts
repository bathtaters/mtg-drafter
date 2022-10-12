export const INVALID_PATH = "_INVALID"

export const gameUrlRegEx = /game\/([^\/]+)(?:\/|$)/ // = game/gameUrl

export const
  newGameURL = '/api/setup/createGame',
  cubeListURL = "/api/setup/checkList",
  gameURL = (gameIdentifier: string) => `/game/${gameIdentifier}`,
  socketEndpoint = (gameURL: any) => `/api/game/${typeof gameURL === 'string' ? gameURL : INVALID_PATH}/socket`

export const // Image URLs
  gathererUrl = (multiverseId: string) => `https://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=${multiverseId}`,
  scryfallUrl = (scryfallId: string, isBack = false) => `https://api.scryfall.com/cards/${scryfallId}?format=image${isBack ? '&face=back' : ''}`
