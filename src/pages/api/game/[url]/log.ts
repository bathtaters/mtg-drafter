import type { NextApiRequest, NextApiResponse } from 'next'
import type { LogFull } from 'types/game'
import getLog from 'backend/controllers/getLog.controller'

export default function handler(req: NextApiRequest, res: NextApiResponse<LogFull>) {
  return getLog(req, res)
}
