import type { ErrResponse, ListResponse } from "pages/api/setup/checkList"

export type GameOptions = {
  name: string,
  players: string,
  packs: string,
  packSize: string,
}

export type CubeFile = { name: string, data?: ListResponse, error?: ErrResponse['error'] }

export type UploadType = ListResponse | ErrResponse