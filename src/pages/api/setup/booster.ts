import type { NextApiRequest, NextApiResponse } from 'next'
import { newBoosterGame } from 'backend/services/setup/createGame'
import { getReqSessionId } from 'backend/libs/auth'
import { boosterOptions } from 'types/setup.validation'

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ url: string }|{ message: string }>) {
  try {
    const body = boosterOptions.parse(req.body)
    const url = await newBoosterGame(body, getReqSessionId(req, res))
    res.status(200).json({ url })

  } catch (err: any) {
    console.error('Error creating game', err)
    return res.status(400).json({ message: err.message || 'Unknown Error' })
  }
}
