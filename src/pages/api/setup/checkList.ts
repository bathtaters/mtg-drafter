import type { NextApiRequest, NextApiResponse } from 'next'
import { getSingleUpload } from 'backend/libs/upload'
import buildCubeList from 'backend/services/game/buildCubeList'
import { fileSettings } from 'assets/constants'

export type ListResponse = Awaited<ReturnType<typeof buildCubeList>>
export type ErrResponse = { error: string }

export const config = {
  api: { bodyParser: false }
}

const splitLines = (file: string) => file.split(/\s*(?:\r?\n|\r)\s*/g).filter(Boolean)

export default async function handler(req: NextApiRequest, res: NextApiResponse<ListResponse | ErrResponse>) {
  try {

    // Get file
    const file = await getSingleUpload(req, fileSettings.maxSize)
    if (!file) throw new Error('File not found')

    // Get cards
    const cardNames = splitLines(file)
    const result = await buildCubeList(cardNames)

    return res.status(200).json(result)

  } catch (err: any) {
    console.error('Error checking file', err)
    return res.status(200).json({ error: err.message || err || 'Unknown Error' })
  }
}