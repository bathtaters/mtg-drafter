import z, { file } from "backend/libs/validation"
import { fileSettings, setupLimits } from "assets/constants"

const commonOptionsObj = {
  name:          z.string().min(setupLimits.name.minLength).max(setupLimits.name.maxLength).trim(),
  playerCount:   z.number().int().gte(setupLimits.players.min).lte(setupLimits.players.max),
  roundCount:    z.number().int().gte(setupLimits.packs.min).lte(setupLimits.packs.max),
}
export const commonOptions = z.object(commonOptionsObj)

export const cubeOptions = z.object({
  ...commonOptionsObj,
  packSize: z.number().int().gte(setupLimits.packSize.min).lte(setupLimits.packSize.max),
  cardList: z.array(z.string().uuid()),
})

export const cubeFileOptions = z.object({
  [fileSettings.id]: file({ count: 1, maxBytes: fileSettings.maxSize, typeList: [fileSettings.type] })
})