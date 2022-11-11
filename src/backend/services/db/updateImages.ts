import { Card, Prisma, PrismaClient } from '@prisma/client'
import type { Card as ScryfallCard } from '../../../types/scryfall'
import prisma from '../../libs/db'
import batchCallback from '../../libs/batcher'
import fetchJson from '../../libs/fetchJson'
import { fetchBulkUrl, adaptScryfallToImage } from '../../utils/db/image.utils'
import { createMultiUpdate } from '../../utils/db/db.utils'



const downloadThreads = 1000, imageBatch = 5000, enableLog = true

type ImageUpdate = Pick<Card, "scryfallId"|"img">
const multiUpdate = createMultiUpdate<ImageUpdate>('Card', 'scryfallId', 'img', prisma)


export default async function updateImages(imgJsonUrl: string, preferredJsonUrl: string, fullUpdate?: boolean) {
  
  // FIRST PASS: GET IMAGES

  const imgUrl = await fetchBulkUrl(imgJsonUrl)
  if (!imgUrl) return console.error('Unable to retrieve image url data')
  enableLog && console.log('Retrieved ImageURI URL',imgUrl)


  let missingImgs: string[]
  if (!fullUpdate) {

    missingImgs = await prisma.card.findMany({
      where: { AND: [ { img: { equals: null } }, { scryfallId: { not: null } } ] },
      select: { scryfallId: true },
      distinct: 'scryfallId',
      
    }).then((c) => c.map(({ scryfallId }) => scryfallId as string))

    enableLog && console.log('Found',missingImgs.length,'missing images')
    if (!missingImgs.length) return
  }


  enableLog && console.log('Getting Image URIs')
  enableLog && console.time('Image URIs')

  let count = 0
  const batch = batchCallback(imageBatch, (data: ImageUpdate[]) => multiUpdate(data).then((c) => { count += c }))

  await fetchJson<ScryfallCard>(imgUrl, async (data) => {
    if (missingImgs && !missingImgs.includes(data.id)) return;

    const updateArgs = adaptScryfallToImage(data)
    if (updateArgs.img) await batch.append(updateArgs)

  }, { jsonPath: '*', maxThreads: downloadThreads })

  await batch.flush()

  enableLog && console.timeEnd('Image URIs')
  enableLog && console.log('Updated',count,'image URIs')



  // SECOND PASS: GET PREFERRED IMAGES

  const prefUrl = await fetchBulkUrl(preferredJsonUrl)
  if (!prefUrl) return console.error('Unable to retrieve preferred art data')
  enableLog && console.log('Retrieved Preferred Art URL',prefUrl)

  await prisma.card.updateMany({ data: { preferredArt: false } })

  enableLog && console.log('Getting Preferred Art')
  enableLog && console.time('Preferred Art')

  let preferred = [] as string[]
  await fetchJson<ScryfallCard>(prefUrl, async ({ id }) => { preferred.push(id) }, { jsonPath: '*', maxThreads: downloadThreads })

  enableLog && console.log('Downloaded',preferred.length,'Preferred Art IDs')

  const res = await prisma.card.updateMany({ where: { scryfallId: { in: preferred }, img: { not: null } }, data: { preferredArt: true } })

  enableLog && console.timeEnd('Preferred Art')
  enableLog && console.log('Set',res.count,'preferred images')
}
