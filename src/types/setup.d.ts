import type { Card, CardSet, Booster } from '@prisma/client'
import type { ErrResponse, ListResponse } from "pages/api/setup/upload"
import type { BoosterType } from './scryfall'
import z from "backend/libs/validation"
import { boosterOptions, commonOptions, cubeOptions } from "./setup.validation"

// -- BOOSTER PACKS PREFERENCE -- \\
// Use keys from MTGJSON Set.booster, ordered by preference [ most -> least ].


// -- RELATED/PARITAL TYPES -- \\

export const draftTypes = [ "Cube", "Booster" ] as const
export type DraftType = (typeof draftTypes)[number]

export type PackCard = Pick<GameCard,'cardId'|'foil'>

export type BoosterData = { boosters: BoosterPack[], boostersTotalWeight: number, sheets: Record<string, BoosterSheet> }
export type BoosterPack = { contents: Partial<Record<string, number>>, weight: number }
export type BoosterSheet = {
    allowDuplicates?: boolean,
    balanceColors?: boolean,
    cards: Record<string, number>,
    foil: boolean,
    fixed?: boolean,
    totalWeight: number,
}

export type SetBooster = Omit<Booster, 'data'> & { data: BoosterData, set: CardSet, cards: Record<string,Card> }

export type BoosterBasic = { boosterType: BoosterType, set: Pick<CardSet, "code"|"name"|"block"> }

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
  basics: boolean,
}


// -- API TYPES -- \\

export type SetupProps = { setList: BoosterBasic[] }

export type UploadType = ListResponse | ErrResponse

export type CubeFile = { name: string, data?: ListResponse, error?: ErrResponse['error'] }
