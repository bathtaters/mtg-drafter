import type { Prisma } from '@prisma/client'
import prisma from '../../libs/db'
import fetchJson from '../../libs/fetchJson'
import batchCallback from '../../libs/batcher'
import { createMultiUpsert } from '../../utils/db/db.utils'
import { adaptCardToDb, adaptFacesToDb, cardFields, JsonCard } from '../../utils/db/card.utils'

const DL_THREADS = 1000, CARD_BATCH = 5000, UPSERT_BATCH = Math.floor(32000 / cardFields.length)

const multiUpsert = createMultiUpsert<Prisma.CardCreateManyInput>('Card', cardFields, prisma)

export default async function updateCards(url: string, fullUpdate = false, enableLog = false) {

  let existing: number | undefined
  if (!fullUpdate) existing = await prisma.card.count()
  else {
    enableLog && console.log('Erasing All Cards')
    // DOESNT WORK UNTIL COCKRAOCH IMPLEMENTS DEFERRING CONSTRAINTS >> await prisma.card.deleteMany()
    await prisma.faceInCard.deleteMany() // CAN REMOVE THIS ONCE I ADD THAT ^
  }

  enableLog && console.log('Updating Cards',typeof existing === 'number' ? `(${existing} exisiting)` : '')
  enableLog && console.time('Cards')

  const cardUpdate = batchCallback(fullUpdate ? UPSERT_BATCH : CARD_BATCH, async (data: Prisma.CardCreateManyInput[]) => {
    if (fullUpdate) await multiUpsert(data)
    else await prisma.card.createMany({ data, skipDuplicates: true })
  })
  const faceUpdate = batchCallback(2 * CARD_BATCH, async (data: Prisma.FaceInCardCreateManyInput[]) => {
    await prisma.faceInCard.createMany({ data, skipDuplicates: true })
  })
  
  await fetchJson<JsonCard>(url, async (data) => {

    await cardUpdate.append(adaptCardToDb(data))
    await faceUpdate.append(...adaptFacesToDb(data))

  }, { jsonPath: 'data.*', maxThreads: DL_THREADS })
  
  await cardUpdate.flush()
  await faceUpdate.flush()

  enableLog && console.timeEnd('Cards')
  enableLog && await prisma.card.count().then((c) => console.log('Added',c-(existing || 0),'/',c,'cards'))
}
