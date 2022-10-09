import type { NextApiRequest, NextApiResponse } from 'next'
import { newCubeGame, CubeOptions } from 'backend/services/game/createGame'
import { getReqSessionId } from 'components/base/services/sessionId.services'

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ url: string }>) {
  // TO DO: VALIDATE BODY
  const data = { ...JSON.parse(req.body), hostSessionId: getReqSessionId(req, res) } as CubeOptions
  
  const url = await newCubeGame(data)
  res.status(200).json({ url })
  
}
