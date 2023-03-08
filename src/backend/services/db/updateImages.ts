import type { Card as ScryfallCard } from '../../../types/scryfall'
import prisma from '../../libs/db'
import Batcher from '../../libs/Batcher'
import fetchJson from '../../libs/fetchJson'
import { fetchBulkUrl, adaptScryfallToImage, ImageData, isPreferredArt } from '../../utils/db/image.utils'
import { createMultiUpdate } from '../../utils/db/db.utils'

const DL_THREADS = 1000, IMAGE_BATCH = 5000

const multiUpdate = createMultiUpdate<ImageData>('Card', ['scryfallId', 'side'], ['img'], prisma)


export default async function updateImages(imgJsonUrl: string, preferredJsonUrl: string, fullUpdate = false, enableLog = false) {

  const imgUrl = await fetchBulkUrl(imgJsonUrl)
  if (!imgUrl) return console.error('Unable to retrieve ImageURI data')
  enableLog && console.log('Retrieved ImageURI data URL')


  let missingImgs: string[] | undefined
  if (!fullUpdate) {

    missingImgs = await prisma.card.findMany({
      where: { img: null, scryfallId: { not: null } },
      select: { scryfallId: true },
      distinct: 'scryfallId',
      
    }).then((c) => c.map(({ scryfallId }) => scryfallId as string))

    enableLog && console.log('Missing',missingImgs?.length,'images')
    if (!missingImgs?.length) return
  }


  enableLog && console.log('Getting Image URIs')
  enableLog && console.time('Image URIs')

  let count = 0
  const batch = new Batcher(IMAGE_BATCH, (data: ImageData[]) => multiUpdate(data).then((c) => { count += c }))

  await fetchJson<ScryfallCard>(imgUrl, async (data) => {
    if (missingImgs && !missingImgs.includes(data.id)) return;

    for (const card of adaptScryfallToImage(data)) {
      if (card.img) await batch.add(card)
    }
  }, { jsonPath: '*', maxThreads: DL_THREADS })

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
  }, { jsonPath: '*', maxThreads: DL_THREADS })

  enableLog && console.log('Downloaded',preferred.length,'Preferred Art IDs')

  const res = await prisma.card.updateMany({ where: { scryfallId: { in: preferred }, img: { not: null } }, data: { preferredArt: true } })

  enableLog && console.timeEnd('Preferred Art')
  enableLog && console.log('Set',res.count,'preferred images')
}
