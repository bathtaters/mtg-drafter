import prisma from '../src/backend/libs/db'
import updateCards from '../src/backend/services/db/updateCards'
import updateImages from '../src/backend/services/db/updateImages'
import updateSets from '../src/backend/services/db/updateSets'
import { cardDbUrl, imageDbUrl, preferredDbUrl, setsDbUrl } from '../src/assets/urls'

const CONSOLE_LOGGING = true
const FULL_REBUILD = false

async function main() {
  await updateCards(cardDbUrl, FULL_REBUILD, CONSOLE_LOGGING)
  await updateImages(imageDbUrl, preferredDbUrl, FULL_REBUILD, CONSOLE_LOGGING)
  await updateSets(setsDbUrl, FULL_REBUILD, CONSOLE_LOGGING)
  console.log('DONE')
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
