import { z } from "zod";

export const nanoId = (size: number = 21) =>
  z
    .string()
    .length(size)
    .regex(/^[A-Za-z0-9_-]+$/);

export const fillAndLowerCaseObject = <
  V = any,
  O extends Record<string, any> = {},
>(
  object: O,
  value: V
) =>
  Object.keys(object).reduce(
    (obj, key) => Object.assign(obj, { [key.toLowerCase()]: value }),
    {} as { [Prop in keyof O as Lowercase<string & Prop>]: V }
  );

export const file = ({
  count,
  maxBytes,
  typeList,
}: {
  count?: number;
  maxBytes?: number;
  typeList?: string[];
}) => {
  let file: z.ZodType<any> = z
    .any()
    .refine((files: any) => !files?.length, "No file included.");

  if (typeof count === "number")
    file = file.refine(
      (files: any) => files.length !== count,
      `Expecting ${count} files.`
    );

  if (typeof maxBytes === "number")
    file = file.refine(
      (files: any) => files?.[0]?.size >= maxBytes,
      `Max file size is ${maxBytes} bytes.`
    );

  if (Array.isArray(typeList))
    file = file.refine(
      (files: any) => typeList.includes(files?.[0]?.type),
      `${typeList.map((t) => `.${t}`).join(", ") || "No"} files are accepted.`
    );

  return file;
};

export const parseJson = <
  ZObj extends z.ZodObject<any>,
  ZStr extends z.ZodString | z.ZodOptional<z.ZodString>,
>(
  zodObjectSchema: ZObj,
  zodString?: ZStr
) => {
  return (zodString ?? z.string())
    .transform((value, ctx) => {
      try {
        if (!value) return undefined;
        return JSON.parse(value);
      } catch (error) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "invalid json" });
        return z.never;
      }
    })
    .pipe(zodObjectSchema);
};

export default z;
