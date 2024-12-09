import type { Side } from '@prisma/client'
import type { Card as ScryfallCard, BulkData } from 'types/scryfall'
import { scryfallHeaders } from 'assets/urls'
import { updateScryfall } from '../../services/db/updateSettings'

const A_CHAR_CODE = 'a'.charCodeAt(0)

const stripUrl = (url?: string) => {
  if (!url) return null
  const idx = url.indexOf('?')
  return idx === -1 ? url : url.substring(0, idx)
}

export interface ImageData { scryfallId: string, side: Side | null, img: string | null }

export const isPreferredArt = ({ layout }: ScryfallCard) => layout !== 'art_series'

export const adaptScryfallToImage = ({ id, image_uris, card_faces }: ScryfallCard): ImageData[] => !card_faces ?
  // Standard Card
  [{ scryfallId: id, side: null, img: stripUrl(image_uris?.large) }] :

  // Multi-Faced Card
  card_faces.map(({ image_uris: face_uris }, idx) => ({
    scryfallId: id,
    side: String.fromCharCode(A_CHAR_CODE + idx) as Side,
    img: stripUrl(face_uris?.large || image_uris?.large),
  }))

export const fetchBulkUrl = (apiUrl: string) => fetch(apiUrl, { 'headers': scryfallHeaders })
  .then((res) => res.json() as Promise<BulkData>)
  .then((data) => updateScryfall(data).then(() => data.download_uri))