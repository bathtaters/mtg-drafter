export const INVALID_PATH = "_INVALID"

export const gameUrlRegEx = /game\/([^\/]+)(?:\/|$)/ // = game/gameUrl

export const
  newGameURL = '/api/setup/createGame',
  cubeListURL = "/api/setup/checkList",
  gameURL = (gameIdentifier: string) => `/game/${gameIdentifier}`,
  socketEndpoint = (gameURL: any) => `/api/game/${typeof gameURL === 'string' ? gameURL : INVALID_PATH}/socket`
