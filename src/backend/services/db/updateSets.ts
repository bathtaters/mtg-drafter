import type { Prisma } from '@prisma/client'
import prisma from '../../libs/db'
import fetchJson from '../../libs/fetchJson'
import batchCallback from '../../libs/batcher'
import { adaptSetDataToDb, flattenObjects, getBoosterType, isBoosterSet, JsonSet } from '../../utils/db/set.utils'

const DL_THREADS = 1000, ENTRY_BATCH = 25


export default async function updateSets(url: string, fullUpdate = false, enableLog = false) {

  let existingSets: string[] | undefined

  if (fullUpdate) {
    enableLog && console.log('Erasing All Sets')
    await prisma.cardSet.deleteMany()
  } else {
    enableLog && console.log('Collecting existing sets')
    await prisma.cardSet.findMany({ select: { code: true }}).then((sets) => {
      existingSets = sets.map(({ code }) => code)
    })
  }

  enableLog && console.log('Updating Sets',existingSets ? `(${existingSets.length} exisiting)` : '')
  enableLog && console.time('Sets')

  const setUpdate = batchCallback(ENTRY_BATCH, async (data: ReturnType<typeof adaptSetDataToDb>[]) => {
    const { base, boosters, sheets, joins, cards } = flattenObjects(data)
    await prisma.$transaction([
      prisma.cardSet.createMany(        { data: base     }),
      prisma.boosterLayout.createMany(  { data: boosters }),
      prisma.boosterSheet.createMany(   { data: sheets   }),
      prisma.sheetsInLayout.createMany( { data: joins    }),
      prisma.boosterCard.createMany(    { data: cards    }),
    ])
  })
  
  await fetchJson<JsonSet>(url, async (incomingData) => {
    if ((existingSets && existingSets.includes(incomingData.code)) || !isBoosterSet(incomingData)) return
    const boosterType = getBoosterType(incomingData.booster)
    if (!boosterType) return

    await setUpdate.append(adaptSetDataToDb(incomingData, boosterType))

  }, { jsonPath: 'data.*', maxThreads: DL_THREADS })
  
  await setUpdate.flush()

  enableLog && console.timeEnd('Sets')
  enableLog && await prisma.cardSet.count().then((c) => console.log('Added',c-(existingSets?.length || 0),'/',c,'sets'))
}
