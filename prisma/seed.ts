import { Color, Prisma, PrismaClient, Rarity, Side } from '@prisma/client'
import prisma from '../src/backend/libs/db'
import { updateCards } from '../src/backend/services/db/updateDb.services'

const updateDbCards = () => updateCards(undefined, false)

async function main() {
  await updateDbCards()
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

// STUDIO: npx prisma studio
// SEED: npx prisma db seed
// MIGRATE: npx prisma migrate dev --name update-reason
