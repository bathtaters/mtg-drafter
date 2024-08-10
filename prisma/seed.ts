import prisma from '../src/backend/libs/db'
import updateCards from '../src/backend/services/db/updateCards'
import updateImages from '../src/backend/services/db/updateImages'
import updateSets from '../src/backend/services/db/updateSets'
import { updateVersion } from 'backend/services/db/updateSettings'
import { cardDbUrl, imageDbUrl, preferredDbUrl, setsDbUrl } from '../src/assets/urls'
import { version } from "../package.json"

const CONSOLE_LOGGING = true
const FULL_REBUILD = false

async function main() {
  await updateCards(cardDbUrl, FULL_REBUILD, CONSOLE_LOGGING)
  await updateImages(imageDbUrl, preferredDbUrl, FULL_REBUILD, CONSOLE_LOGGING)
  await updateSets(setsDbUrl, FULL_REBUILD, CONSOLE_LOGGING)
  await updateVersion(version, CONSOLE_LOGGING)
  console.log('DONE')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

// WEB GUI: npx prisma studio
// REBUILD CONTENT: npx prisma db seed
// UPDATE TABLES: npx prisma migrate dev --name update-reason
// GENERATE UPDATE SQL: npx prisma migrate dev --create-only
// SYNC DB: npx prisma migrate deploy
// REBUILD TS: npx prisma generate
// FULL DB RESET: npx prisma migrate reset
//  (drops db, deploys, generates, seeds)
// UPDATE TRACKING W/O CHANGE: npx prisma migrate --applied/rolled-back <migration folder>

// CHECK FOR MISMATCH: npx prisma --version
