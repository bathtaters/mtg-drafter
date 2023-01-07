import type { BoosterCard, BoosterLayout, BoosterSheet, Card, CardSet, SheetsInLayout } from '@prisma/client'
import type { ErrResponse, ListResponse } from "pages/api/setup/upload"
import z from "backend/libs/validation"
import { boosterOptions, commonOptions, cubeOptions } from "./setup.validation"

export type DraftType = "cube"|"booster"

export type PackCard = Pick<GameCard,'cardId'|'foil'>

export type CubeOptions = z.infer<typeof cubeOptions>

export type BoosterOptions = z.infer<typeof boosterOptions>

export interface GenericOptions extends z.infer<typeof commonOptions> {
  roundCount: CubeOptions['roundCount'],
  packs: PackCard[][],
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