import z, { file } from "backend/libs/validation"
import { fileSettings, setupLimits } from "assets/constants"

const commonOptionsObj = {
  name:          z.string().min(setupLimits.name.minLength).max(setupLimits.name.maxLength).trim(),
  playerCount:   z.number().int().gte(setupLimits.players.min).lte(setupLimits.players.max),
  timer:         z.number().int().gte(setupLimits.timer.min).lte(setupLimits.timer.max),
}
export const commonOptions = z.object(commonOptionsObj)

export const boosterOptions = z.object({
  ...commonOptionsObj,
  basics: z.boolean().default(false),
  packList: z.array(
    z.string().min(setupLimits.setCode.min).max(setupLimits.setCode.max).transform((str) => str.toUpperCase())
  ).min(setupLimits.packs.min).max(setupLimits.packs.max)
})

export const cubeOptions = z.object({
  ...commonOptionsObj,
  roundCount: z.number().int().gte(setupLimits.packs.min).lte(setupLimits.packs.max),
  packSize:   z.number().int().gte(setupLimits.packSize.min).lte(setupLimits.packSize.max),
  cardList:   z.array(z.string().uuid()).max(setupLimits.cubeSize.max),
})

export const cubeFileOptions = z.object({
  [fileSettings.id]: file({ count: 1, maxBytes: fileSettings.maxSize, typeList: [fileSettings.type] })
})
