import type { ErrResponse, ListResponse } from "pages/api/setup/checkList"
import z from "backend/libs/validation"
import { commonOptions, cubeOptions } from "./setup.validation"

export type CubeOptions = z.infer<typeof cubeOptions>

export interface GenericOptions extends z.infer<typeof commonOptions> {
  packs: string[][],
}

export type GameOptions = {
  name: string,
  players: string,
  packs: string,
  packSize: string,
}

export type CubeFile = { name: string, data?: ListResponse, error?: ErrResponse['error'] }

export type UploadType = ListResponse | ErrResponse