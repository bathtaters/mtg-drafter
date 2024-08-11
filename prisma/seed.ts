import { parseArgs } from 'node:util'
import prisma from '../src/backend/libs/db'
import updateCards from '../src/backend/services/db/updateCards'
import updateImages from '../src/backend/services/db/updateImages'
import updateSets from '../src/backend/services/db/updateSets'
import { updateVersion } from 'backend/services/db/updateSettings'
import { cardDbUrl, imageDbUrl, preferredDbUrl, setsDbUrl } from '../src/assets/urls'
import pkg from "../package.json"

// CL Args
const options /*: ParseArgsConfig['options']*/ = {
  /* Command-Line Arguments */              // ARGUMENT  | DESCRIPTION
  quiet:   { short: "q", type: "boolean" }, // (q)uiet   | Run without logging
  reset:   { short: "r", type: "boolean" }, // (r)eset   | Full reset
  cards:   { short: "c", type: "boolean" }, // (c)ards   | Ignore cards
  images:  { short: "i", type: "boolean" }, // (i)mages  | Ignore scryfall images
  sets:    { short: "s", type: "boolean" }, // (s)ets    | Ignore sets/boosters
  version: { short: "v", type: "boolean" }, // (v)ersion | Ignore package version update
} as const

async function main() {
  const { values: { quiet, reset, cards, images, sets, version } } = parseArgs({ options })

  if (!cards)   await updateCards(cardDbUrl, reset, !quiet)
  if (!images)  await updateImages(imageDbUrl, preferredDbUrl, reset, !quiet)
  if (!sets)    await updateSets(setsDbUrl, reset, !quiet)
  if (!version) await updateVersion(pkg.version, !quiet)
  if (!quiet)   console.log('DONE')
}

main()
  .then(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

// WEB GUI: npx prisma studio
// REBUILD CONTENT: npx prisma db seed [-- -qrcisv] (See top for arguments)
// UPDATE TABLES: npx prisma migrate dev --name update-reason
// GENERATE UPDATE SQL: npx prisma migrate dev --create-only
// SYNC DB: npx prisma migrate deploy
// REBUILD TS: npx prisma generate
// FULL DB RESET: npx prisma migrate reset
//  (drops db, deploys, generates, seeds)
// UPDATE TRACKING W/O CHANGE: npx prisma migrate --applied/rolled-back <migration folder>

// CHECK FOR MISMATCH: npx prisma --version
