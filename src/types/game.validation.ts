import z, { fillAndLowerCaseObject, nanoId } from "backend/libs/validation"
import { Board, Color, PlayerStatus } from "@prisma/client"
import { commonOptions } from "./setup.validation"
import { setupLimits, urlLength } from "assets/constants"

export const boardLands = z.object(fillAndLowerCaseObject(Color, z.number().nonnegative().int()))

const gameData = {
  session: nanoId(),
  url:     nanoId(urlLength),
  id:      z.string().cuid(),
  name:    commonOptions.shape.name,
  round:   z.number().int().nonnegative().lte(setupLimits.packs.max + 1),
  status:  z.nativeEnum(PlayerStatus),
  board:   z.nativeEnum(Board),
  basics:  z.object(fillAndLowerCaseObject(Board, boardLands)),
}

export default gameData