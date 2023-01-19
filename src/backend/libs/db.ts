import { PrismaClient } from '@prisma/client'
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