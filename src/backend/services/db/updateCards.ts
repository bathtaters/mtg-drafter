import type { Prisma } from '@prisma/client'
import prisma from '../../libs/db'
import fetchJson from '../../libs/fetchJson'
import batchCallback from '../../libs/batcher'
import { adaptCardToDb, adaptCardToConnect, JsonCard } from '../../utils/db/card.utils'

const downloadThreads = 1000, createBatch = 5000, enableLog = true


export default async function updateCards(url: string, fullUpdate?: boolean) {
  let connectOps: Prisma.CardUpdateArgs[] = []


  if (fullUpdate) {
    enableLog && console.log('Erasing All Cards')
    await prisma.card.deleteMany()
  }


  enableLog && console.log('First Pass: Cards')
  enableLog && console.time('First Pass')

  const firstPass = batchCallback(createBatch, async (data: Prisma.CardCreateInput[]) => {
    await prisma.card.createMany({ data, skipDuplicates: !fullUpdate })
  })
  
  await fetchJson<JsonCard>(url, async (data) => {

    await firstPass.append(adaptCardToDb(data))

    const op = adaptCardToConnect(data)
    if (op) connectOps.push(op)

  }, { jsonPath: 'data.*', maxThreads: downloadThreads })
  
  await firstPass.flush()

  enableLog && console.timeEnd('First Pass')


  enableLog && console.log('Second Pass: Card Connections', connectOps.length)
  enableLog && console.time('Second Pass')

  if (!fullUpdate) {
    let removeIdx: number[] = []
    const uuids = connectOps.map((op) => op.where.uuid as string)
    
    const connectEntries = await prisma.card.findMany({
      where: { uuid: { in: uuids } },
      include: { otherFaces: true }
    })
    connectEntries.forEach(({ uuid, otherFaces }) => { 
      if (otherFaces.length) removeIdx.push(uuids.indexOf(uuid))
    })
    
    removeIdx.filter((v) => v !== -1).sort((a,b)=>b-a)
      .forEach((i) => connectOps.splice(i, 1))

    enableLog && console.log('Requiring update:',connectOps.length)
  }

  for (const op of connectOps) {
    await prisma.card.update(op).catch((err) =>
      enableLog && console.error('Error updating card self-references. Card:',op.where.uuid,err)
    )
  }

  enableLog && console.timeEnd('Second Pass')
}
