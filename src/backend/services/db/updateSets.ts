import prisma from '../../libs/db'
import fetchJson from '../../libs/fetchJson'
import Batcher from '../../libs/Batcher'
import { adaptSetDataToDb, flattenObjects, isBoosterSet, JsonSet } from '../../utils/db/set.utils'
import { updateMtgJson } from './updateSettings'

const DL_THREADS = 1000, ENTRY_BATCH = 25


export default async function updateSets(url: string, fullUpdate = false, enableLog = false) {

  await updateMtgJson("sets", url)

  let existingSets: string[] | undefined
  if (!fullUpdate) existingSets = await prisma.cardSet.findMany({ select: { code: true }})
      .then((sets) => sets.map(({ code }) => code))
  else {
    enableLog && console.log('Erasing All Sets')
    await prisma.cardSet.deleteMany()
  }

  enableLog && console.log('Updating Sets',existingSets ? `(${existingSets.length} exisiting)` : '')
  enableLog && console.time('Sets')

  const setUpdate = new Batcher(ENTRY_BATCH, async (data: ReturnType<typeof adaptSetDataToDb>[]) => {
    const { set, boosters } = flattenObjects(data)
    await prisma.$transaction([
      prisma.cardSet.createMany({ data: set      }),
      prisma.booster.createMany({ data: boosters }),
    ])
  })
  
  await fetchJson<JsonSet>(url, async (incomingData) => {
    if ((existingSets && existingSets.includes(incomingData.code)) || !isBoosterSet(incomingData)) return

    await setUpdate.add(adaptSetDataToDb(incomingData))

  }, { jsonPath: 'data.*', maxThreads: DL_THREADS })
  
  await setUpdate.finish()
  enableLog && console.timeEnd('Sets')
  enableLog && await prisma.cardSet.count().then((c) => console.log('Added',c-(existingSets?.length || 0),'/',c,'sets'))
}
