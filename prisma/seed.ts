import prisma from '../src/backend/libs/db'
import updateCards from '../src/backend/services/db/updateCards'
import updateImages from '../src/backend/services/db/updateImages'
import { cardDbUrl, imageDbUrl, preferredDbUrl } from '../src/assets/urls'

async function main() {
  await updateCards(cardDbUrl, false)
  await updateImages(imageDbUrl, preferredDbUrl, false)
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
