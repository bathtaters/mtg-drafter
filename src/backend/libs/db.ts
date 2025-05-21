import { Prisma, PrismaClient } from '@prisma/client'
declare global { var db: PrismaClient | undefined }

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production')
  prisma = new PrismaClient()

// For hot loading in dev env (Prevent multiple instances)
else {
  if (!global.db) global.db = new PrismaClient()
  prisma = global.db
}

export default prisma

const prismaErrors = [
  Prisma.PrismaClientRustPanicError,
  Prisma.PrismaClientValidationError,
  Prisma.PrismaClientKnownRequestError,
  Prisma.PrismaClientUnknownRequestError,
  Prisma.PrismaClientInitializationError,
]

export type DatabaseError = typeof prismaErrors[number]

export const isDbErr = (err: any): err is DatabaseError => 
  prismaErrors.some((errorType) => err instanceof errorType)