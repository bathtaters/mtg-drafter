import z, { fillAndLowerCaseObject, nanoId, parseJson } from "backend/libs/validation"
import { Board, Color, LogAction, PlayerStatus } from "@prisma/client"
import { commonOptions } from "./setup.validation"
import { logFetchOptions, logOptions, setupLimits, urlLimits } from "assets/constants"

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
  offset:  z.number({ coerce: true }).nonnegative().int().optional(),
  size:    z.number({ coerce: true }).positive().int()
    .max(logFetchOptions.maxSize).default(logFetchOptions.defaultSize),
}

export default gameData

export const gameOptions = z.object({
  name: commonOptions.shape.name.optional(),
  hostId: gameData.id.optional(),
  url:  gameData.url.optional(),
  timerBase: commonOptions.shape.timer.optional(),
})


const logOptionsSchema = Object.keys(logOptions).reduce(
  (opts, option) => ({ ...opts, [option]: z.boolean().optional() }),
  {} as Record<keyof typeof logOptions, z.ZodOptional<z.ZodBoolean>>,
)
export const logFilter = parseJson(
  z.object({
    ...logOptionsSchema,
    players: z.array(z.string().cuid2()).optional(),
    actions: z.array(z.nativeEnum(LogAction)).max(Object.keys(LogAction).length).optional(),
  }),
  z.string().optional(),
).optional()

export type LogFilterParam = z.infer<typeof logFilter>