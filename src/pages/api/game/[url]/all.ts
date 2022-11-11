import type { NextApiRequest, NextApiResponse } from 'next'
import type { ServerSuccess } from 'types/game'
import { apiHandler } from 'backend/controllers/getGame.controller'

export default function handler(req: NextApiRequest, res: NextApiResponse<ServerSuccess>) {
  return apiHandler(req, res)
}
