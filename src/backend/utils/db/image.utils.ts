import type { Card as ScryfallCard, BulkData } from '../../../types/scryfall'

export const adaptScryfallToImage = ({ id, image_uris }: ScryfallCard) =>
  ({ scryfallId: id , img: image_uris?.large || null })

export const fetchBulkUrl = (apiUrl: string) => fetch(apiUrl)
  .then((res) => res.json() as Promise<BulkData>)
  .then((data) => data.download_uri)