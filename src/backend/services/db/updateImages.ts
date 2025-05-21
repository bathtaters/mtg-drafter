import type { Card as ScryfallCard } from '../../../types/scryfall'
import prisma from '../../libs/db'
import Batcher from '../../libs/Batcher'
import fetchJson from '../../libs/fetchJson'
import { fetchBulkUrl, adaptScryfallToImage, ImageData, isPreferredArt } from '../../utils/db/image.utils'
import { createMultiUpdate } from '../../utils/db/db.utils'

const multiUpdate = createMultiUpdate<ImageData>('Card', ['scryfallId', 'side'], ['img'], prisma)


export default async function updateImages(imgJsonUrl: string, preferredJsonUrl: string, fullUpdate = false, enableLog = false, maxThreads = 1000, dbBatchSize = 5000, upsertTxLimit = 32000) {

  const imgUrl = await fetchBulkUrl(imgJsonUrl)
  if (!imgUrl) return console.error('Unable to retrieve ImageURI data')
  enableLog && console.log('Retrieved ImageURI data URL')

  const missingImgs = await prisma.card.findMany({
    where: { img: null, scryfallId: { not: null } },
    select: { scryfallId: true },
    distinct: 'scryfallId',
    
  }).then((c) => new Set(c.map(({ scryfallId }) => scryfallId as string)))

  enableLog && console.log('Checking for',missingImgs.size,'missing Image URIs')
  enableLog && console.time('Image URIs')

  let count = 0
  const batch = new Batcher(dbBatchSize, (data: ImageData[]) => multiUpdate(data).then((c) => { count += c }))

  await fetchJson<ScryfallCard>(imgUrl, async (data) => {
    if (!missingImgs.has(data.id)) return;

    for (const card of adaptScryfallToImage(data)) {
      if (card.img) await batch.add(card)
    }
  }, { isArray: true, maxThreads })

  await batch.finish()

  enableLog && console.timeEnd('Image URIs')
  enableLog && console.log('Updated',count,'image URIs')



  const prefUrl = await fetchBulkUrl(preferredJsonUrl)
  if (!prefUrl) return console.error('Unable to retrieve Preferred Art data')
  enableLog && console.log('Retrieved Preferred Art data URL')

  await prisma.card.updateMany({ data: { preferredArt: false } })

  enableLog && console.log('Getting Preferred Art')
  enableLog && console.time('Preferred Art')

  let preferred = [] as string[]
  await fetchJson<ScryfallCard>(prefUrl, async (card) => {
    if (isPreferredArt(card)) preferred.push(card.id)
  }, { isArray: true, maxThreads })

  enableLog && console.log('Downloaded',preferred.length,'Preferred Art IDs')

  // Split 'preferredArt' into 'upsertTxLimit' size updates
  count = 0
  while (preferred.length) {
    const res = await prisma.card.updateMany({
      data: { preferredArt: true },
      where: { img: { not: null }, scryfallId: { in: preferred.slice(0, upsertTxLimit) } },
    })
    count += res.count
    preferred = preferred.slice(upsertTxLimit)
  }

  enableLog && console.timeEnd('Preferred Art')
  enableLog && console.log('Set',count,'preferred images')
}
