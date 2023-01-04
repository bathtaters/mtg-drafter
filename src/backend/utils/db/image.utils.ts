import type { Side } from '@prisma/client'
import type { Card as ScryfallCard, BulkData } from 'types/scryfall'

const A_CHAR_CODE = 'a'.charCodeAt(0)

export interface ImageData { scryfallId: string, side: Side | null, img: string | null }

export const isPreferredArt = ({ layout }: ScryfallCard) => layout !== 'art_series'

export const adaptScryfallToImage = ({ id, image_uris, card_faces }: ScryfallCard): ImageData[] => !card_faces ?
  // Standard Card
  [{ scryfallId: id, side: null, img: image_uris?.large || null }] :

  // Multi-Faced Card
  card_faces.map(({ image_uris: face_uris }, idx) => ({
    scryfallId: id,
    side: String.fromCharCode(A_CHAR_CODE + idx) as Side,
    img: face_uris?.large || image_uris?.large || null,
  }))

export const fetchBulkUrl = (apiUrl: string) => fetch(apiUrl)
  .then((res) => res.json() as Promise<BulkData>)
  .then((data) => data.download_uri)