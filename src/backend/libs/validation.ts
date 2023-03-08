import { z } from "zod"

export const nanoId = (size: number = 21) => z.string().length(size).regex(/^[A-Za-z0-9_-]+$/)


export const fillAndLowerCaseObject = <V = any, O extends Record<string,any> = {}>(object: O, value: V) => Object.keys(object)
  .reduce((obj, key) => Object.assign(obj, { [key.toLowerCase()]: value }), {} as { [Prop in keyof O as Lowercase<string & Prop>]: V })


export const file = ({ count, maxBytes, typeList }: { count?: number, maxBytes?: number, typeList?: string[] }) => {
  let file: ZodFile = z.any().refine((files) => !files?.length, "No file included.")
  
  if (typeof count === 'number') file = file.refine((files) => files.length !== count, `Expecting ${count} files.`)
  
  if (typeof maxBytes === 'number') file = file.refine((files) => files?.[0]?.size >= maxBytes, `Max file size is ${maxBytes} bytes.`)

  if (Array.isArray(typeList)) file = file.refine(
    (files) => typeList.includes(files?.[0]?.type),
    `${typeList.map((t) => `.${t}`).join(', ') || 'No'} files are accepted.`
  )

  return file
}


export default z


type ZodFile = z.ZodEffects<z.ZodAny, any, any> | z.ZodEffects<z.ZodEffects<z.ZodAny, any, any>, any, any> |
  z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodAny, any, any>, any, any>, any, any> |
  z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodAny, any, any>, any, any>, any, any>, any, any>