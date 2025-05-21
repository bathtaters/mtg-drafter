import type { NextApiRequest, NextApiResponse } from 'next'
import type { ServerProps } from 'types/game'
import { apiHandler } from 'backend/controllers/getGame.controller'

export default function handler(req: NextApiRequest, res: NextApiResponse<ServerProps>) {
  return apiHandler(req, res)
}
