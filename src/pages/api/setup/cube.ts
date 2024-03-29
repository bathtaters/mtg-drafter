import type { NextApiRequest, NextApiResponse } from 'next'
import { newCubeGame } from 'backend/services/setup/createGame'
import { getReqSessionId } from 'backend/libs/auth'
import { cubeOptions } from 'types/setup.validation'

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ url: string }|{ message: string }>) {
  try {
    const body = cubeOptions.parse(req.body)
    const url = await newCubeGame(body, getReqSessionId(req, res))
    res.status(200).json({ url })

  } catch (err: any) {
    console.error('Error creating game', err)
    return res.status(400).json({ message: err.message || 'Unknown Error' })
  }
}
