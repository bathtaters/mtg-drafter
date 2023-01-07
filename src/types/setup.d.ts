import type { BoosterCard, BoosterLayout, BoosterSheet, Card, CardSet, SheetsInLayout } from '@prisma/client'
import type { ErrResponse, ListResponse } from "pages/api/setup/upload"
import z from "backend/libs/validation"
import { commonOptions, cubeOptions } from "./setup.validation"

export type DraftType = "cube"|"booster"

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

export type BoosterCardFull = BoosterCard & { card: Card }
export type BoosterLayoutFull = BoosterLayout & { sheets: SheetsInLayout[] }
export type BoosterSheetFull = BoosterSheet & { cards: BoosterCardFull[] }

export interface SetFull extends CardSet {
  boosters: BoosterLayoutFull[],
  sheets: { [name in BoosterSheet['name']]: BoosterSheetFull | undefined }
}