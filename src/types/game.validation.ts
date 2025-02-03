import z, { fillAndLowerCaseObject, nanoId } from "backend/libs/validation"
import { Board, Color, PlayerStatus } from "@prisma/client"
import { commonOptions } from "./setup.validation"
import { setupLimits, urlLimits } from "assets/constants"

export const boardLands = z.object(fillAndLowerCaseObject(Color, z.number().nonnegative().int()))

export const authPassword = z.string().min(1).nullable()

const gameData = {
  session: nanoId(),
  url:     nanoId(urlLimits.minLength),
  id:      z.string().cuid2(),
  name:    commonOptions.shape.name,
  round:   z.number().int().nonnegative().lte(setupLimits.packs.max + 1),
  status:  z.nativeEnum(PlayerStatus),
  board:   z.nativeEnum(Board),
  basics:  z.object(fillAndLowerCaseObject(Board, boardLands)),
  idOrNum: z.union([ z.string().cuid2(), z.number() ]),
  bool:    z.boolean().default(false),
  offset:  z.number().int().optional()
}

export default gameData

export const gameOptions = z.object({
  name: commonOptions.shape.name.optional(),
  hostId: gameData.id.optional(),
  url:  gameData.url.optional(),
  timerBase: commonOptions.shape.timer.optional(),
})