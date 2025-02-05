import z, { parseJson } from "backend/libs/validation"
import { LogAction } from "@prisma/client"
import { logFetchOptions, logOptions } from "assets/constants"


const logOptionsSchema = Object.keys(logOptions).reduce(
  (opts, option) => ({ ...opts, [option]: z.boolean().optional() }),
  {} as Record<keyof typeof logOptions, z.ZodOptional<z.ZodBoolean>>,
)

const logParams = {
    offset:  z.number({ coerce: true }).nonnegative().int().optional(),
    size:    z.number({ coerce: true }).positive().int()
        .max(logFetchOptions.maxSize).default(logFetchOptions.minSize),
    filter: parseJson(
        z.object({
          ...logOptionsSchema,
          players: z.array(z.string().cuid2()).optional(),
          actions: z.array(z.nativeEnum(LogAction)).max(Object.keys(LogAction).length).optional(),
        }),
        z.string().optional(),
    ).optional()
}

export default logParams

export type LogFilterParam = z.infer<typeof logParams.filter>
export type LogParams = { [Param in keyof typeof logParams]?: z.infer<(typeof logParams)[Param]> }