import type { ErrResponse, ListResponse } from "pages/api/setup/checkList"

interface CommonOptions {
  name: string,
  playerCount: number,
  roundCount: number,
  hostSessionId?: string,
}

export interface GenericOptions extends CommonOptions {
  packs: string[][],
}

export interface CubeOptions extends CommonOptions {
  packSize: number,
  cardList: string[],
}

export type GameOptions = {
  name: string,
  players: string,
  packs: string,
  packSize: string,
}

export type CubeFile = { name: string, data?: ListResponse, error?: ErrResponse['error'] }

export type UploadType = ListResponse | ErrResponse