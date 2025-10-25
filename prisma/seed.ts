import { parseArgs } from 'node:util'
import { config } from 'dotenv'
import prisma from '../src/backend/libs/db'
import updateCards from '../src/backend/services/db/updateCards'
import updateImages from '../src/backend/services/db/updateImages'
import updateSets from '../src/backend/services/db/updateSets'
import { updateVersion } from 'backend/services/db/updateSettings'
import { customDbModify } from 'backend/services/db/updateDb'
import { normalizeName } from 'backend/utils/db/card.utils'
import { cardDbUrl, imageDbUrl, preferredDbUrl, setsDbUrl } from '../src/assets/urls'
import pkg from "../package.json"

// CL Args
const options /*: ParseArgsConfig['options']*/ = {
  /* Command-Line Arguments */              // ARGUMENT  | DESCRIPTION
  quiet:   { short: "q", type: "boolean" }, // (q)uiet   | Run without logging
  modify:  { short: "m", type: "boolean" }, // (m)odify  | ONLY run custom DB modification (Current: Normalize names)
  reset:   { short: "r", type: "boolean" }, // (r)eset   | Full reset
  cards:   { short: "c", type: "boolean" }, // (c)ards   | Ignore cards
  images:  { short: "i", type: "boolean" }, // (i)mages  | Ignore scryfall images
  sets:    { short: "s", type: "boolean" }, // (s)ets    | Ignore sets/boosters
  version: { short: "v", type: "boolean" }, // (v)ersion | Ignore package version update
} as const

const getDbName = () => process.env.DATABASE_URL?.match?.(/[^:/]\/([A-Za-z0-9-_]+)\?/)?.[1] ?? "[Missing]"

async function main() {
  const { values: clArgs } = parseArgs({ options })

  // ENV Args -- Can be set via ENV Vars or .env
  config()
  const args = {
    dbName: getDbName(),
    ...clArgs,                                          // ENV VAR           | DESCRIPTION
    threads: +(process.env.JSON_THREAD_LIMIT ||  1000), // JSON_THREAD_LIMIT | Maximum number of threads to open when ingesting a JSON
    batches: +(process.env.DB_BATCH_LIMIT    ||  5000), // DB_BATCH_LIMIT    | Maximum number of items to insert into the DB at once
    upserts: +(process.env.DB_UPSERT_LIMIT   || 32000), // DB_UPSERT_LIMIT   | Maximum number of upserts to perform (Divided by number of Card fields, ~2000)
  }

  if (!args.quiet)   console.log('Arguments:', args)
  if (args.modify)   return customDbModify('card', ['uuid'], ['normalName'], ({ name }) => name ? ({ normalName: normalizeName(name) }) : null, ['name'], !args.quiet, args.batches)
  if (!args.cards)   await updateCards(cardDbUrl, args.reset, !args.quiet, args.threads, args.batches, args.upserts)
  if (!args.images)  await updateImages(imageDbUrl, preferredDbUrl, args.reset, !args.quiet, args.threads, args.batches, args.upserts)
  if (!args.sets)    await updateSets(setsDbUrl, args.reset, !args.quiet, args.threads, args.batches)
  if (!args.version) await updateVersion(pkg.version, !args.quiet)
  if (!args.quiet)   console.log('DONE')
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

// |-----------------|
// | DEV DB commands |
// |-----------------|
// - `brew install cockroachdb/tap/cockroach`: Installs CockroachDB
// - `npm run devdb`: Starts DB process (Runs in foreground)
// - `npx prisma db push`: Creates DB tables
// - `npx prisma db seed`: Adds card/booster data
