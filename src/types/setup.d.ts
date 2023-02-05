import type { BoosterCard, BoosterLayout, BoosterSheet, Card, CardSet, SheetsInLayout } from '@prisma/client'
import type { ErrResponse, ListResponse } from "pages/api/setup/upload"
import z from "backend/libs/validation"
import { boosterOptions, commonOptions, cubeOptions } from "./setup.validation"

// -- RELATED/PARITAL TYPES -- \\

export const draftTypes = [ "Cube", "Booster" ] as const
export type DraftType = (typeof draftTypes)[number]

export type PackCard = Pick<GameCard,'cardId'|'foil'>

export type BoosterCardFull = BoosterCard & { card: Card }
export type BoosterLayoutFull = BoosterLayout & { sheets: SheetsInLayout[] }
export type BoosterSheetFull = BoosterSheet & { cards: BoosterCardFull[] }

export interface SetFull extends CardSet {
  boosters: BoosterLayoutFull[],
  sheets: { [name in BoosterSheet['name']]: BoosterSheetFull | undefined }
}

export type SetBasic = Pick<CardSet, "code"|"name"|"block"|"boosterType">

// -- USER OPTIONS -- \\

export type CubeOptions = z.infer<typeof cubeOptions>
export type BoosterOptions = z.infer<typeof boosterOptions>
export interface GenericOptions extends z.infer<typeof commonOptions> {
  roundCount: CubeOptions['roundCount'],
  packs: PackCard[][],
}

export type GameOptions = {
  type: DraftType,
  name: string,
  players: string,
  timer: string,
  packs: string,
  packSize: string,
  packList: string[],
}


// -- API TYPES -- \\

export type SetupProps = { setList: SetBasic[] }

export type UploadType = ListResponse | ErrResponse

export type CubeFile = { name: string, data?: ListResponse, error?: ErrResponse['error'] }
